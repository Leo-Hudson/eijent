import { NextResponse } from 'next/server';
import { coreLogout } from '@/lib/coreAuth';
import { clearSessionCookie, getRequestToken } from '@/lib/session';
import { isSameOrigin } from '@/lib/requestGuards';

export const POST = async (req) => {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: 'Request blocked.' }, { status: 403 });
  }

  const token = getRequestToken(req);
  await coreLogout(token);
  const res = NextResponse.json({ success: true });
  clearSessionCookie(res);
  return res;
};
