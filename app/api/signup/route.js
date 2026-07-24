import { NextResponse } from 'next/server';
import * as yup from 'yup';

const CORE_API_BASE_URL = process.env.CORE_API_BASE_URL || '';
const CORE_API_KEY = process.env.CORE_API_KEY || '';
const CORE_TENANT_ID = process.env.CORE_TENANT_ID || '';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signupSchema = yup.object({
  companyName: yup.string().trim().required().min(2),
  accountName: yup.string().trim().required().min(2),
  firstName: yup.string().trim().required().min(1),
  lastName: yup.string().trim().required().min(1),
  email: yup.string().trim().required().matches(EMAIL_RE),
  phone: yup.string().trim().required().min(7),
  password: yup.string().required().min(8),
});

const coreHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${CORE_API_KEY}`,
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Looks up an existing member by email in the Eijent tenant, or null. */
const findMemberByEmail = async (email) => {
  const query =
    `where[email][equals]=${encodeURIComponent(email)}` +
    `&where[tenant][equals]=${encodeURIComponent(CORE_TENANT_ID)}` +
    `&limit=1&depth=0`;

  const res = await fetch(`${CORE_API_BASE_URL}/api/members?${query}`, {
    headers: coreHeaders(),
    cache: 'no-store',
  });
  if (!res.ok) return null;

  const data = await res.json();
  return data?.docs?.[0] || null;
};

/**
 * Best-effort: Core creates the contact async after member create.
 * Wait briefly, then write company name onto contacts.companyInfo.
 */
const attachCompanyToContact = async ({ email, companyName, tenantId }) => {
  await sleep(400);

  const query =
    `where[email][equals]=${encodeURIComponent(email)}` +
    `&where[tenant][equals]=${encodeURIComponent(tenantId)}` +
    `&limit=1&depth=0`;

  const listRes = await fetch(`${CORE_API_BASE_URL}/api/contacts?${query}`, {
    headers: coreHeaders(),
    cache: 'no-store',
  });
  if (!listRes.ok) return;

  const list = await listRes.json();
  const contact = list?.docs?.[0];
  if (!contact?.id) return;

  await fetch(`${CORE_API_BASE_URL}/api/contacts/${contact.id}`, {
    method: 'PATCH',
    headers: coreHeaders(),
    body: JSON.stringify({ companyInfo: { company: companyName } }),
  });
};

const readCoreError = async (response) => {
  try {
    const body = await response.json();
    return (
      body?.errors?.[0]?.message ||
      body?.message ||
      body?.error ||
      (typeof body === 'string' ? body : '')
    );
  } catch {
    return await response.text().catch(() => '');
  }
};

const mapMemberCreateError = (status, detail) => {
  const lower = String(detail).toLowerCase();
  if (lower.includes('unique') || lower.includes('already') || lower.includes('duplicate')) {
    return {
      status: 409,
      error: 'An account with this email already exists. Try signing in instead.',
    };
  }
  if (status === 403) {
    return {
      status: 403,
      error: 'Signup is not allowed for this tenant. Check Core API key and tenant config.',
    };
  }
  return { status: 502, error: 'Failed to create account. Please try again.' };
};

const pendingReviewResponse = ({ member, companyName, accountName, message }) =>
  NextResponse.json({
    success: true,
    pendingReview: true,
    authenticated: false,
    message:
      message ||
      'Your account was created and is pending review. You will be able to sign in after an admin assigns a plan and approves it.',
    member: {
      id: member?.id,
      companyName,
      accountName,
      phone: member?.phone,
      firstName: member?.firstName,
      lastName: member?.lastName,
      email: member?.email,
      status: member?.status || 'Pending',
    },
  });

/**
 * Signup: creates a Pending Eijent member in Core with company details only.
 * No plan selection, subscription, or session. An admin assigns the plan on approve.
 */
export const POST = async (req) => {
  try {
    if (!CORE_API_BASE_URL || !CORE_API_KEY || !CORE_TENANT_ID) {
      throw new Error(
        'Signup is not configured (missing CORE_API_BASE_URL, CORE_API_KEY or CORE_TENANT_ID).',
      );
    }

    const body = await req.json();
    let clean;
    try {
      clean = await signupSchema.validate(body, { abortEarly: false, stripUnknown: true });
    } catch {
      return NextResponse.json(
        { error: 'Please check your details and try again.' },
        { status: 400 },
      );
    }

    const existing = await findMemberByEmail(clean.email);

    if (existing) {
      const status = existing.status || 'Active';

      if (status === 'Pending') {
        const existingMeta =
          existing.metadata && typeof existing.metadata === 'object' ? existing.metadata : {};
        try {
          await fetch(`${CORE_API_BASE_URL}/api/members/${existing.id}`, {
            method: 'PATCH',
            headers: coreHeaders(),
            body: JSON.stringify({
              phone: clean.phone,
              companyName: clean.companyName,
              accountName: clean.accountName,
              // Keep legacy metadata key in sync for older admin views until fully migrated.
              metadata: {
                ...existingMeta,
                companyName: clean.companyName,
              },
            }),
          });
        } catch (patchErr) {
          if (process.env.DEBUG_LOGS === '1') {
            console.warn('[signup] profile refresh skipped', patchErr);
          }
        }

        return pendingReviewResponse({
          member: { ...existing, status: 'Pending', phone: clean.phone },
          companyName: clean.companyName,
          accountName: clean.accountName,
          message:
            'Your account is still pending review. We updated your details. You will be able to sign in after an admin assigns a plan and approves it.',
        });
      }

      return NextResponse.json(
        {
          error: 'An account with this email already exists. Try signing in instead.',
          alreadyRegistered: true,
        },
        { status: 409 },
      );
    }

    const createRes = await fetch(`${CORE_API_BASE_URL}/api/members`, {
      method: 'POST',
      headers: coreHeaders(),
      body: JSON.stringify({
        email: clean.email,
        password: clean.password,
        firstName: clean.firstName,
        lastName: clean.lastName,
        phone: clean.phone,
        companyName: clean.companyName,
        accountName: clean.accountName,
        tenant: CORE_TENANT_ID,
        status: 'Pending',
        // Keep legacy metadata key for older tooling during transition.
        metadata: {
          companyName: clean.companyName,
        },
      }),
    });

    if (!createRes.ok) {
      const detail = await readCoreError(createRes);
      if (process.env.DEBUG_LOGS === '1') {
        console.error('[signup] Core members create failed', { status: createRes.status, detail });
      }
      const mapped = mapMemberCreateError(createRes.status, detail);
      return NextResponse.json({ error: mapped.error }, { status: mapped.status });
    }

    const created = await createRes.json();
    const member = created?.doc || created;
    const memberId = member?.id;
    const tenantId =
      (typeof member?.tenant === 'object' ? member.tenant?.id : member?.tenant) || CORE_TENANT_ID;

    try {
      await attachCompanyToContact({
        email: clean.email,
        companyName: clean.companyName,
        tenantId,
      });
    } catch (contactErr) {
      if (process.env.DEBUG_LOGS === '1') {
        console.warn('[signup] contact companyInfo update skipped', contactErr);
      }
    }

    if (process.env.DEBUG_LOGS === '1') {
      console.info('[signup] pending member created in Core', {
        memberId,
        status: member?.status,
      });
    }

    return pendingReviewResponse({
      member: {
        id: memberId,
        email: clean.email,
        firstName: clean.firstName,
        lastName: clean.lastName,
        phone: clean.phone,
        status: member?.status || 'Pending',
      },
      companyName: clean.companyName,
      accountName: clean.accountName,
    });
  } catch (error) {
    if (process.env.DEBUG_LOGS === '1') console.error('[signup]', error);
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 },
    );
  }
};
