import { NextResponse } from 'next/server';
import * as yup from 'yup';
import { coreLogin } from '@/lib/coreAuth';
import { setSessionCookie } from '@/lib/session';

const CORE_API_BASE_URL = process.env.CORE_API_BASE_URL || '';
const CORE_API_KEY = process.env.CORE_API_KEY || '';
const CORE_TENANT_ID = process.env.CORE_TENANT_ID || '';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signupSchema = yup.object({
  companyName: yup.string().trim().required().min(2),
  firstName: yup.string().trim().required().min(1),
  lastName: yup.string().trim().required().min(1),
  email: yup.string().trim().required().matches(EMAIL_RE),
  password: yup.string().required().min(8),
  pricingPlanId: yup.string().trim().required(),
});

const coreHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${CORE_API_KEY}`,
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetches the selected plan from Core, enforcing active + Eijent tenant so an
 * inactive or foreign plan id from the client is rejected.
 */
const fetchActivePlan = async (pricingPlanId) => {
  const query =
    `where[id][equals]=${encodeURIComponent(pricingPlanId)}` +
    `&where[status][equals]=active` +
    `&where[tenant][equals]=${encodeURIComponent(CORE_TENANT_ID)}` +
    `&depth=2&limit=1`;

  const res = await fetch(
    `${CORE_API_BASE_URL}/api/pricing-plans?${query}`,
    { headers: coreHeaders(), cache: 'no-store' },
  );
  if (!res.ok) return null;

  const data = await res.json();
  return data?.docs?.[0] || null;
};

/** Reads price/currency/free-ness from a plan's populated product. */
const readPlanPricing = (plan) => {
  const product = plan?.product && typeof plan.product === 'object' ? plan.product : null;
  const pricingType = product?.planConfig?.pricingType;
  const rawPrice = product?.price;
  const price =
    typeof rawPrice === 'number'
      ? rawPrice
      : rawPrice != null && !Number.isNaN(Number(rawPrice))
        ? Number(rawPrice)
        : null;
  const currency = product?.currency || 'USD';
  const free = pricingType === 'free' || price === 0;
  return { price, currency, free };
};

/** Looks up an existing member by email in the Eijent tenant, or null. */
const findMemberByEmail = async (email) => {
  const query =
    `where[email][equals]=${encodeURIComponent(email)}` +
    `&where[tenant][equals]=${encodeURIComponent(CORE_TENANT_ID)}` +
    `&limit=1&depth=0`;

  const res = await fetch(
    `${CORE_API_BASE_URL}/api/members?${query}`,
    { headers: coreHeaders(), cache: 'no-store' },
  );
  if (!res.ok) return null;

  const data = await res.json();
  return data?.docs?.[0] || null;
};

/** Returns an existing active/pending subscription for the member, or null. */
const findExistingSubscription = async (memberId) => {
  const query = `where[member][equals]=${encodeURIComponent(memberId)}&limit=1&depth=0`;
  const res = await fetch(
    `${CORE_API_BASE_URL}/api/subscriptions?${query}`,
    { headers: coreHeaders(), cache: 'no-store' },
  );
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

  const listRes = await fetch(
    `${CORE_API_BASE_URL}/api/contacts?${query}`,
    { headers: coreHeaders(), cache: 'no-store' },
  );
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

/**
 * Builds a JSON response and, when possible, auto-logs the member in by setting
 * the session cookie. `authenticated` tells the client whether a session exists.
 */
const respondWithSession = async (payload, email, password) => {
  let authenticated = false;
  let token;
  let exp;
  try {
    const login = await coreLogin(email, password);
    if (login.ok && login.data?.token) {
      token = login.data.token;
      exp = login.data.exp;
      authenticated = true;
    }
  } catch (err) {
    if (process.env.DEBUG_LOGS === '1') console.warn('[signup] auto-login skipped', err);
  }

  const res = NextResponse.json({ ...payload, authenticated });
  if (authenticated) setSessionCookie(res, token, exp);
  return res;
};

/**
 * Signup: verifies the selected plan, creates (or reuses) an Eijent member in
 * Core, then assigns the subscription for that plan. Paid plans (all plans
 * today) are created pending/unpaid until real payment lands; the free branch
 * is kept for the future but currently unused.
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

    const plan = await fetchActivePlan(clean.pricingPlanId);
    if (!plan) {
      return NextResponse.json(
        { error: 'The selected plan is no longer available. Please choose another.' },
        { status: 400 },
      );
    }

    const { price: planPrice, currency: planCurrency, free } = readPlanPricing(plan);

    let member = await findMemberByEmail(clean.email);
    let memberCreated = false;

    if (!member) {
      const createRes = await fetch(`${CORE_API_BASE_URL}/api/members`, {
        method: 'POST',
        headers: coreHeaders(),
        body: JSON.stringify({
          email: clean.email,
          password: clean.password,
          firstName: clean.firstName,
          lastName: clean.lastName,
          tenant: CORE_TENANT_ID,
          metadata: { companyName: clean.companyName },
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
      member = created?.doc || created;
      memberCreated = true;
    }

    const memberId = member?.id;
    const tenantId =
      (typeof member?.tenant === 'object' ? member.tenant?.id : member?.tenant) || CORE_TENANT_ID;

    if (memberCreated) {
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
    }

    const existingSubscription = await findExistingSubscription(memberId);
    if (existingSubscription) {
      if (process.env.DEBUG_LOGS === '1') {
        console.info('[signup] member already has subscription, treating as success', {
          memberId,
          subscriptionId: existingSubscription.id,
        });
      }
      return respondWithSession(
        {
          success: true,
          alreadySubscribed: true,
          message: 'You already have an account with a plan.',
          member: {
            id: memberId,
            companyName: clean.companyName,
            firstName: clean.firstName,
            lastName: clean.lastName,
            email: clean.email,
            status: member?.status,
          },
          plan: { id: plan.id, name: plan.name },
        },
        clean.email,
        clean.password,
      );
    }

    const subscriptionBody = {
      member: memberId,
      pricingPlan: plan.id,
      tenant: CORE_TENANT_ID,
      startDate: new Date().toISOString(),
    };
    if (!free) {
      subscriptionBody.status = 'pending';
      subscriptionBody.paymentStatus = 'unpaid';
      subscriptionBody.paymentSource = 'offline';
      // Pass price explicitly: Core's autofill can resolve product price to 0,
      // which would misclassify a paid plan as free and auto-activate it.
      if (planPrice != null) subscriptionBody.price = planPrice;
      if (planCurrency) subscriptionBody.currency = String(planCurrency).toLowerCase();
    }

    const subRes = await fetch(`${CORE_API_BASE_URL}/api/subscriptions`, {
      method: 'POST',
      headers: coreHeaders(),
      body: JSON.stringify(subscriptionBody),
    });

    if (!subRes.ok) {
      const detail = await readCoreError(subRes);
      if (process.env.DEBUG_LOGS === '1') {
        console.error('[signup] Core subscription create failed', { status: subRes.status, detail });
      }
      return NextResponse.json(
        {
          error:
            'Your account was created, but we could not assign the plan. Please try again in a moment.',
          member: { id: memberId, email: clean.email },
        },
        { status: 502 },
      );
    }

    const subCreated = await subRes.json();
    const subscription = subCreated?.doc || subCreated;

    if (process.env.DEBUG_LOGS === '1') {
      console.info('[signup] member + subscription created in Core', {
        memberId,
        subscriptionId: subscription?.id,
        plan: plan.name,
        free,
      });
    }

    return respondWithSession(
      {
        success: true,
        message: 'Account created successfully.',
        member: {
          id: memberId,
          companyName: clean.companyName,
          firstName: clean.firstName,
          lastName: clean.lastName,
          email: clean.email,
          status: member?.status,
        },
        plan: { id: plan.id, name: plan.name },
        subscription: {
          id: subscription?.id,
          status: subscription?.status,
          paymentStatus: subscription?.paymentStatus,
        },
      },
      clean.email,
      clean.password,
    );
  } catch (error) {
    if (process.env.DEBUG_LOGS === '1') console.error('[signup]', error);
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 },
    );
  }
};
