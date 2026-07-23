import { NextResponse } from 'next/server';
import { coreLogout } from '@/lib/coreAuth';
import { clearSessionCookie, getRequestToken } from '@/lib/session';

export const POST = async (req) => {
  const token = getRequestToken(req);
  await coreLogout(token);
  const res = NextResponse.json({ success: true });
  clearSessionCookie(res);
  return res;
};
