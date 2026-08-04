import { NextResponse } from 'next/server';
import * as yup from 'yup';
import { coreResetPassword } from '@/lib/coreAuth';
import { guardRequest, HOUR } from '@/lib/requestGuards';
import { isPasswordComplex, PASSWORD_COMPLEXITY_ERROR } from '@/lib/passwordRules';

const resetSchema = yup.object({
  token: yup.string().trim().required(),
  password: yup
    .string()
    .required()
    .test('complexity', PASSWORD_COMPLEXITY_ERROR, (value) => isPasswordComplex(value)),
});

export const POST = async (req) => {
  const blocked = guardRequest(req, {
    name: 'reset-password',
    buckets: [{ limit: 10, windowMs: HOUR }],
  });
  if (blocked) return blocked;

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Enter a new password.' }, { status: 400 });
  }

  let clean;
  try {
    clean = await resetSchema.validate(body, { abortEarly: false, stripUnknown: true });
  } catch (err) {
    return NextResponse.json(
      { error: err?.errors?.[0] || PASSWORD_COMPLEXITY_ERROR },
      { status: 400 },
    );
  }

  const { ok, status, data } = await coreResetPassword(clean.token, clean.password);

  if (!ok) {
    if (status === 503 || data?.code === 'core_unavailable') {
      return NextResponse.json(
        {
          error: 'We could not reset your password right now. Please try again in a moment.',
          code: 'core_unavailable',
        },
        { status: 503 },
      );
    }
    if (process.env.DEBUG_LOGS === '1') {
      console.warn('[auth/reset-password] failed', { status });
    }
    return NextResponse.json(
      {
        error: 'This reset link is invalid or has expired. Request a new one.',
        code: 'invalid_token',
      },
      { status: 400 },
    );
  }

  // Core returns a session token here, but we deliberately drop it. Signing in
  // through /login keeps the Pending and Suspended gates in the path, which the
  // reset endpoint itself does not run.
  return NextResponse.json({
    success: true,
    message: 'Your password has been updated. You can sign in with it now.',
  });
};
