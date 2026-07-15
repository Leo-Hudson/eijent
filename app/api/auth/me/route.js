import { NextResponse } from 'next/server';
import { coreMe, slimMember } from '@/lib/coreAuth';
import { clearSessionCookie, getRequestToken } from '@/lib/session';

export const GET = async (req) => {
  const token = getRequestToken(req);
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const user = await coreMe(token);
  if (!user) {
    const res = NextResponse.json({ authenticated: false }, { status: 401 });
    clearSessionCookie(res);
    return res;
  }

  return NextResponse.json({ authenticated: true, member: slimMember(user) });
};
