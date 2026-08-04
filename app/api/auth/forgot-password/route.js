import { NextResponse } from 'next/server';
import * as yup from 'yup';
import { coreForgotPassword } from '@/lib/coreAuth';
import { guardRequest, HOUR } from '@/lib/requestGuards';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const forgotSchema = yup.object({
  email: yup.string().trim().lowercase().required().matches(EMAIL_RE),
});

// Same response whether or not the address has an account, so this route
// cannot be used to discover which emails are registered.
const GENERIC_RESULT = {
  success: true,
  message:
    'If an account exists for that email, we have sent a link to reset the password. The link expires in 1 hour.',
};

export const POST = async (req) => {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Enter your email address.' }, { status: 400 });
  }

  let clean;
  try {
    clean = await forgotSchema.validate(body, { abortEarly: false, stripUnknown: true });
  } catch {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }

  const blocked = guardRequest(req, {
    name: 'forgot-password',
    buckets: [
      { limit: 5, windowMs: HOUR },
      { scope: `email:${clean.email}`, limit: 3, windowMs: HOUR },
    ],
  });
  if (blocked) return blocked;

  const { ok, status, data } = await coreForgotPassword(clean.email);

  if (!ok && (status === 503 || data?.code === 'core_unavailable')) {
    return NextResponse.json(
      {
        error: 'We could not send the reset email right now. Please try again in a moment.',
        code: 'core_unavailable',
      },
      { status: 503 },
    );
  }

  if (!ok && process.env.DEBUG_LOGS === '1') {
    console.warn('[auth/forgot-password] core responded', { status });
  }

  return NextResponse.json(GENERIC_RESULT);
};
