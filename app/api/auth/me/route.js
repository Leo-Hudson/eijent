import { NextResponse } from 'next/server';
import {
  coreMe,
  coreUnavailablePayload,
  isCoreUnavailable,
  slimMember,
} from '@/lib/coreAuth';
import { clearSessionCookie, getRequestToken } from '@/lib/session';

export const GET = async (req) => {
  const token = getRequestToken(req);
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const user = await coreMe(token);
    if (!user) {
      const res = NextResponse.json({ authenticated: false }, { status: 401 });
      clearSessionCookie(res);
      return res;
    }
    return NextResponse.json({ authenticated: true, member: slimMember(user) });
  } catch (err) {
    if (isCoreUnavailable(err)) {
      return NextResponse.json(coreUnavailablePayload(), { status: 503 });
    }
    throw err;
  }
};
