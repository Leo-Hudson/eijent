import { NextResponse } from 'next/server';
import {
  coreMe,
  coreUnavailablePayload,
  isCoreUnavailable,
} from '@/lib/coreAuth';
import { clearSessionCookie, getRequestToken } from '@/lib/session';
import { prettyServiceLabel } from '@/lib/memberDisplay';

const CORE_API_BASE_URL = process.env.CORE_API_BASE_URL || '';
const CORE_API_KEY = process.env.CORE_API_KEY || '';

/**
 * GET /api/credits/usage-breakdown
 *
 * Session-gated single-call usage analytics for the Credits Usage panel.
 * Proxies Core GET /api/credits/usage (SQL aggregates) and maps to UI rows.
 * Never trusts a client-supplied memberId.
 *
 * Query: optional from, to (ISO timestamps).
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
  const from = incoming.get('from');
  const to = incoming.get('to');
  if (from) outbound.set('from', from);
  if (to) outbound.set('to', to);

  try {
    const res = await fetch(`${CORE_API_BASE_URL}/api/credits/usage?${outbound}`, {
      headers: {
        Authorization: `Bearer ${CORE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { error: data?.error || 'Unable to load credit usage.' },
        { status: res.status === 401 || res.status === 403 ? 502 : res.status },
      );
    }

    const ownerLabel =
      [user.firstName, user.lastName].filter(Boolean).join(' ').trim() ||
      user.email ||
      'Owner';

    const byUser = [];
    if (data?.owner?.deducted) {
      byUser.push({
        label: `${ownerLabel} (owner)`,
        deducted: Number(data.owner.deducted) || 0,
        kind: 'owner',
      });
    }
    for (const b of data?.bySubAccount || []) {
      const name =
        [b.firstName, b.lastName].filter(Boolean).join(' ').trim() ||
        b.email ||
        'Sub-account';
      byUser.push({
        label: name,
        deducted: Number(b.deducted) || 0,
        kind: 'subAccount',
        subAccountId: b.subAccountId || null,
      });
    }
    byUser.sort((a, b) => b.deducted - a.deducted);

    // Prefer Core top-level byFeature; fall back to merging nested maps.
    let byService = [];
    if (Array.isArray(data?.byFeature) && data.byFeature.length) {
      byService = data.byFeature.map((f) => ({
        label: prettyServiceLabel(f.key),
        deducted: Number(f.deducted) || 0,
        key: f.key,
      }));
    } else {
      const featureMap = new Map();
      const merge = (byFeature) => {
        if (!byFeature || typeof byFeature !== 'object') return;
        for (const [key, amount] of Object.entries(byFeature)) {
          featureMap.set(key, (featureMap.get(key) || 0) + (Number(amount) || 0));
        }
      };
      merge(data?.owner?.byFeature);
      for (const b of data?.bySubAccount || []) merge(b.byFeature);
      byService = [...featureMap.entries()].map(([key, deducted]) => ({
        label: prettyServiceLabel(key),
        deducted,
        key,
      }));
    }
    byService.sort((a, b) => b.deducted - a.deducted);

    const byWorkspace = Array.isArray(data?.byWorkspace)
      ? data.byWorkspace
          .map((w) => ({
            label: w.label || 'Unknown',
            deducted: Number(w.deducted) || 0,
          }))
          .filter((w) => w.deducted > 0)
      : [];

    return NextResponse.json({
      authenticated: true,
      from: data?.from ?? from ?? null,
      to: data?.to ?? to ?? null,
      usedInRange: Number(data?.totalDeducted) || 0,
      currentBalance: data?.currentBalance ?? null,
      allocation: data?.allocation ?? null,
      byUser,
      byService,
      byWorkspace,
      truncated: Boolean(data?.truncated),
    });
  } catch {
    return NextResponse.json(coreUnavailablePayload(), { status: 503 });
  }
};
