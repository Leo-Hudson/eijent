import { NextResponse } from 'next/server';
import * as yup from 'yup';
import {
  coreLogin,
  coreMe,
  coreUnavailablePayload,
  coreUpdateSelf,
  isCoreUnavailable,
} from '@/lib/coreAuth';
import { clearSessionCookie, getRequestToken, setSessionCookie } from '@/lib/session';
import { guardRequest, HOUR } from '@/lib/requestGuards';
import { isPasswordComplex, PASSWORD_COMPLEXITY_ERROR } from '@/lib/passwordRules';

const changeSchema = yup.object({
  currentPassword: yup.string().required(),
  newPassword: yup
    .string()
    .required()
    .test('complexity', PASSWORD_COMPLEXITY_ERROR, (value) => isPasswordComplex(value)),
});

export const POST = async (req) => {
  const blocked = guardRequest(req, {
    name: 'change-password',
    buckets: [{ limit: 10, windowMs: HOUR }],
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
    return NextResponse.json({ error: 'Enter your current and new password.' }, { status: 400 });
  }

  let clean;
  try {
    clean = await changeSchema.validate(body, { abortEarly: false, stripUnknown: true });
  } catch (err) {
    return NextResponse.json(
      { error: err?.errors?.[0] || 'Enter your current and new password.' },
      { status: 400 },
    );
  }

  if (clean.newPassword === clean.currentPassword) {
    return NextResponse.json(
      { error: 'Your new password must be different from your current one.' },
      { status: 400 },
    );
  }

  // Re-authenticate before allowing the change, so a stolen session cookie
  // alone cannot lock the owner out of their account.
  const verified = await coreLogin(user.email, clean.currentPassword);
  if (!verified.ok) {
    if (verified.status === 503 || verified.data?.code === 'core_unavailable') {
      return NextResponse.json(coreUnavailablePayload(), { status: 503 });
    }
    if (verified.status === 403) {
      return NextResponse.json(
        { error: 'Your account is no longer active. Contact support for help.' },
        { status: 403 },
      );
    }
    return NextResponse.json({ error: 'Your current password is incorrect.' }, { status: 400 });
  }

  const updated = await coreUpdateSelf(token, user.id, { password: clean.newPassword });
  if (!updated.ok) {
    if (updated.status === 503 || updated.data?.code === 'core_unavailable') {
      return NextResponse.json(coreUnavailablePayload(), { status: 503 });
    }
    if (process.env.DEBUG_LOGS === '1') {
      console.error('[auth/change-password] core update failed', { status: updated.status });
    }
    return NextResponse.json(
      { error: 'We could not update your password. Please try again.' },
      { status: 502 },
    );
  }

  const res = NextResponse.json({
    success: true,
    message: 'Your password has been updated.',
  });

  // Swap in the token minted during verification so the cookie carries a fresh
  // expiry rather than one issued under the old password.
  if (verified.data?.token) {
    setSessionCookie(res, verified.data.token, verified.data.exp);
  }
  return res;
};
