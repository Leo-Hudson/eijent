import { NextResponse } from 'next/server';
import {
  coreMe,
  coreUnavailablePayload,
  isCoreUnavailable,
} from '@/lib/coreAuth';
import { clearSessionCookie, getRequestToken } from '@/lib/session';

const CORE_API_BASE_URL = process.env.CORE_API_BASE_URL || '';
const CORE_API_KEY = process.env.CORE_API_KEY || '';

const ALLOWED_PARAMS = new Set([
  'from',
  'to',
  'type',
  'featureKey',
  'workspaceId',
  'subAccountId',
  'ownerOnly',
  'direction',
  'q',
  'sort',
  'page',
  'limit',
]);

/**
 * GET /api/credits/ledger
 * Session-gated proxy to Core ledger for the authenticated member's org.
 * Never trusts a client-supplied memberId.
 */
export const GET = async (req) => {
  const token = getRequestToken(req);
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  if (!CORE_API_BASE_URL || !CORE_API_KEY) {
    return NextResponse.json(coreUnavailablePayload(), { status: 503 });
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

  const incoming = new URL(req.url).searchParams;
  const outbound = new URLSearchParams();
  outbound.set('memberId', user.id);

  for (const key of ALLOWED_PARAMS) {
    const value = incoming.get(key);
    if (value != null && value !== '') outbound.set(key, value);
  }

  try {
    const res = await fetch(`${CORE_API_BASE_URL}/api/credits/ledger?${outbound}`, {
      headers: {
        Authorization: `Bearer ${CORE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { error: data?.error || 'Unable to load credit ledger.' },
        { status: res.status === 401 || res.status === 403 ? 502 : res.status },
      );
    }
    return NextResponse.json({ authenticated: true, ...data });
  } catch {
    return NextResponse.json(coreUnavailablePayload(), { status: 503 });
  }
};
