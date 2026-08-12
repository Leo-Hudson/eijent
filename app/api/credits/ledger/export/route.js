import { NextResponse } from 'next/server';
import {
  coreMe,
  coreUnavailablePayload,
  isCoreUnavailable,
} from '@/lib/coreAuth';
import { clearSessionCookie, getRequestToken } from '@/lib/session';
import { ledgerTypeLabel } from '@/lib/memberDisplay';

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
]);

const csvEscape = (value) => {
  const s = value == null ? '' : String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
};

const formatCredits = (amount) => {
  const n = Number(amount) || 0;
  const abs = Math.abs(n).toLocaleString('en-US');
  if (n > 0) return `+${abs}`;
  if (n < 0) return `-${abs}`;
  return '0';
};

const resolveWorkspaceLabel = (row) => {
  if (row?.workspace && typeof row.workspace === 'object') {
    return row.workspace.name || row.workspace.id || null;
  }
  return row?.workspaceName || row?.workspaceId || null;
};

const resolveSubAccount = (row, ownerId) => {
  if (row?.subAccount && typeof row.subAccount === 'object') {
    return {
      name: row.subAccount.name || 'Sub-account',
      email: row.subAccount.email || null,
      isOwner: false,
    };
  }
  if (row?.attributedToOwner === true) {
    return {
      name: row.user?.name || 'Owner',
      email: row.user?.email || null,
      isOwner: true,
    };
  }
  if (row?.user?.name || row?.user?.email) {
    const isOwner =
      ownerId && row.user?.id != null
        ? String(row.user.id) === String(ownerId)
        : undefined;
    return {
      name: row.user.name || '-',
      email: row.user.email || null,
      isOwner,
    };
  }
  return null;
};

/**
 * GET /api/credits/ledger/export
 *
 * Session-gated CSV export. Paginates Core ledger server-side so the browser
 * makes one request instead of up to 100 client-side page loops.
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
  const baseParams = new URLSearchParams();
  baseParams.set('memberId', user.id);
  for (const key of ALLOWED_PARAMS) {
    const value = incoming.get(key);
    if (value != null && value !== '') baseParams.set(key, value);
  }
  if (!baseParams.get('sort')) baseParams.set('sort', 'newest');

  const pageSize = 100;
  const maxPages = 100;
  const all = [];

  try {
    let page = 1;
    let totalPages = 1;
    while (page <= totalPages && page <= maxPages) {
      const outbound = new URLSearchParams(baseParams);
      outbound.set('page', String(page));
      outbound.set('limit', String(pageSize));

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
          { error: data?.error || 'Unable to export credit ledger.' },
          { status: res.status === 401 || res.status === 403 ? 502 : res.status },
        );
      }
      all.push(...(data.docs || []));
      totalPages = data.totalPages || 1;
      page += 1;
    }
  } catch {
    return NextResponse.json(coreUnavailablePayload(), { status: 503 });
  }

  const ownerId = String(user.id);
  const header = [
    'Date',
    'Transaction Type',
    'Workspace',
    'Service',
    'Sub-account',
    'Sub-account Email',
    'Credits',
    'Running Balance',
    'Reference',
    'Description',
  ];
  const lines = [header.map(csvEscape).join(',')];

  for (const row of all) {
    const sub = resolveSubAccount(row, ownerId);
    const subLabel = sub
      ? sub.isOwner
        ? `${sub.name} (owner)`
        : sub.name
      : '';
    lines.push(
      [
        row.createdAt || '',
        ledgerTypeLabel(row),
        resolveWorkspaceLabel(row) || '',
        row.service || '',
        subLabel,
        sub?.email || '',
        formatCredits(row.amount),
        typeof row.balanceAfter === 'number' ? row.balanceAfter : '',
        row.id || '',
        row.description || '',
      ]
        .map(csvEscape)
        .join(','),
    );
  }

  const filename = `eijent-credit-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
  return new NextResponse(lines.join('\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
};
