import { NextResponse } from 'next/server';
import * as yup from 'yup';
import { coreLogin, slimMember } from '@/lib/coreAuth';
import { setSessionCookie } from '@/lib/session';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const loginSchema = yup.object({
  email: yup.string().trim().required().matches(EMAIL_RE),
  password: yup.string().required(),
});

export const POST = async (req) => {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Enter your email and password.' }, { status: 400 });
    }
    let clean;
    try {
      clean = await loginSchema.validate(body, { abortEarly: false, stripUnknown: true });
    } catch {
      return NextResponse.json({ error: 'Enter your email and password.' }, { status: 400 });
    }

    const { ok, status, data } = await coreLogin(clean.email, clean.password);

    if (!ok) {
      if (status === 503 || data?.code === 'core_unavailable') {
        return NextResponse.json(
          {
            error:
              data?.error ||
              'We could not sign you in right now. Please try again in a moment.',
            code: 'core_unavailable',
          },
          { status: 503 },
        );
      }
      const detail = String(data?.errors?.[0]?.message || data?.message || '').toLowerCase();
      if (status === 403 && detail.includes('pending')) {
        return NextResponse.json(
          {
            error:
              'Your account is pending review. You will be able to sign in after an admin approves it.',
          },
          { status: 403 },
        );
      }
      if (status === 403 && detail.includes('suspended')) {
        return NextResponse.json({ error: 'Your account is suspended.' }, { status: 403 });
      }
      if (process.env.DEBUG_LOGS === '1') {
        console.warn('[auth/login] failed', { status, detail });
      }
      return NextResponse.json(
        { error: 'Incorrect email or password.' },
        { status: 401 },
      );
    }

    const token = data?.token;
    const user = data?.user;
    if (!token || !user?.id) {
      return NextResponse.json({ error: 'Login failed. Please try again.' }, { status: 502 });
    }

    const res = NextResponse.json({ success: true, member: slimMember(user) });
    setSessionCookie(res, token, data?.exp);
    return res;
  } catch (error) {
    if (process.env.DEBUG_LOGS === '1') console.error('[auth/login]', error);
    return NextResponse.json({ error: 'Login failed. Please try again.' }, { status: 500 });
  }
};
