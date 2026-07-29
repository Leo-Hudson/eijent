/** Shared display helpers for member dashboard / ledger. */

export const STATUS_TONE = {
  active: 'is-good',
  Active: 'is-good',
  trialing: 'is-good',
  pending: 'is-warn',
  Pending: 'is-warn',
  past_due: 'is-warn',
  paused: 'is-warn',
  cancelled: 'is-bad',
  expired: 'is-bad',
  Suspended: 'is-bad',
  Disabled: 'is-bad',
};

export const prettyStatus = (s) =>
  s ? String(s).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Unknown';

export const prettyCycle = (s) =>
  s ? String(s).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : null;

export const formatMoney = (price, currency) => {
  if (price == null) return null;
  if (Number(price) === 0) return 'No charge';
  try {
    return price.toLocaleString(undefined, {
      style: 'currency',
      currency: (currency || 'usd').toUpperCase(),
    });
  } catch {
    return `${price} ${(currency || '').toUpperCase()}`;
  }
};

export const formatDate = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

export const formatNextInvoice = (sub) => {
  if (!sub) return null;
  if (sub.billingCycle === 'one_time') return 'One-time (no recurring invoice)';
  if (formatDate(sub.nextBillingDate)) return formatDate(sub.nextBillingDate);
  if (Number(sub.price) === 0 || sub.paymentSource === 'free') return 'None ($0 plan)';
  if (sub.paymentSource === 'offline') return 'None (admin / offline)';
  if (sub.billingCycle) return 'Not scheduled';
  return null;
};

export const findLimit = (limits, field) =>
  (limits || []).find((l) => l.field === field) || null;

export const limitProgressPct = (limit) => {
  if (!limit || limit.unlimited || typeof limit.limit !== 'number' || limit.limit <= 0) return null;
  if (typeof limit.used !== 'number') return null;
  return Math.min(100, Math.round((limit.used / limit.limit) * 100));
};

export const limitStatusClass = (status) => {
  if (status === 'warning') return 'is-warn';
  if (status === 'reached' || status === 'exceeded') return 'is-bad';
  return '';
};

/** Entity caps: never show "— / max" as if usage failed. */
export const formatUsedMax = (limit) => {
  if (!limit) return '—';
  if (limit.unlimited) {
    return typeof limit.used === 'number'
      ? `${limit.used.toLocaleString()} / Unlimited`
      : 'Unlimited';
  }
  if (typeof limit.limit !== 'number') return '—';
  if (typeof limit.used === 'number') {
    return `${limit.used.toLocaleString()} / ${limit.limit.toLocaleString()}`;
  }
  return `Not synced / ${limit.limit.toLocaleString()}`;
};

export const initials = (m) =>
  `${(m?.firstName || '')[0] || ''}${(m?.lastName || '')[0] || ''}`.toUpperCase() ||
  (m?.email || '?')[0].toUpperCase();

export const displayName = (person, fallback = 'Member') =>
  `${person?.firstName || ''} ${person?.lastName || ''}`.trim() ||
  person?.email ||
  fallback;

/**
 * Credit vocabulary: Available (balance) vs Plan grant (allocation).
 * Never present as balance/allocation fraction.
 */
export const walletExtras = (balance, allocation) => {
  if (typeof balance !== 'number' || typeof allocation !== 'number') return null;
  if (balance <= allocation) return null;
  return balance - allocation;
};

export const MEMBER_NAV = [
  { href: '/dashboard', id: 'overview', label: 'Overview' },
  { href: '/dashboard/plan', id: 'plan', label: 'Plan' },
  { href: '/dashboard/credits', id: 'credits', label: 'Credits' },
  { href: '/dashboard/team', id: 'team', label: 'Team' },
];
