import { NextResponse } from 'next/server';
import * as yup from 'yup';
import {
  coreMe,
  coreUnavailablePayload,
  coreUpdateSelf,
  isCoreUnavailable,
  slimMember,
} from '@/lib/coreAuth';
import { clearSessionCookie, getRequestToken } from '@/lib/session';
import { guardRequest, HOUR } from '@/lib/requestGuards';

// Email, accountName, status and tenant are deliberately absent: email is the
// login identifier, accountName is the workspace key, and Core rejects member
// self-edits of the last two anyway.
const profileSchema = yup.object({
  firstName: yup.string().trim().required().max(80),
  lastName: yup.string().trim().required().max(80),
  companyName: yup.string().trim().required().max(160),
  phone: yup
    .string()
    .trim()
    .transform((v) => (v == null ? '' : String(v).trim()))
    .max(24)
    .default(''),
});

export const PATCH = async (req) => {
  const blocked = guardRequest(req, {
    name: 'profile',
    buckets: [{ limit: 30, windowMs: HOUR }],
  });
  if (blocked) return blocked;

  const token = getRequestToken(req);
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  let user;
  try {
    user = await coreMe(token);
  } catch (err) {
    if (isCoreUnavailable(err)) {
      return NextResponse.json(coreUnavailablePayload(), { status: 503 });
    }
    throw err;
  }

  if (!user?.id) {
    const res = NextResponse.json({ authenticated: false }, { status: 401 });
    clearSessionCookie(res);
    return res;
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Please check your details and try again.' }, { status: 400 });
  }

  let clean;
  try {
    clean = await profileSchema.validate(body, { abortEarly: false, stripUnknown: true });
  } catch (err) {
    return NextResponse.json(
      { error: err?.errors?.[0] || 'Please check your details and try again.' },
      { status: 400 },
    );
  }

  const existingMeta = user.metadata && typeof user.metadata === 'object' ? user.metadata : {};

  const updated = await coreUpdateSelf(token, user.id, {
    firstName: clean.firstName,
    lastName: clean.lastName,
    companyName: clean.companyName,
    phone: clean.phone,
    // Signup writes the same legacy key; keep it in sync for older admin views.
    metadata: { ...existingMeta, companyName: clean.companyName },
  });

  if (!updated.ok) {
    if (updated.status === 503 || updated.data?.code === 'core_unavailable') {
      return NextResponse.json(coreUnavailablePayload(), { status: 503 });
    }
    if (process.env.DEBUG_LOGS === '1') {
      console.error('[auth/profile] core update failed', { status: updated.status });
    }
    return NextResponse.json(
      { error: 'We could not save your details. Please try again.' },
      { status: 502 },
    );
  }

  const doc = updated.data?.doc || updated.data;
  return NextResponse.json({
    success: true,
    message: 'Your details have been saved.',
    member: slimMember({ ...user, ...doc }),
  });
};
