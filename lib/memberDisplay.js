/** Shared display helpers for member dashboard / ledger. */

export const STATUS_TONE = {
  active: 'is-good',
  Active: 'is-good',
  trialing: 'is-good',
  Trial: 'is-good',
  pending: 'is-warn',
  Pending: 'is-warn',
  past_due: 'is-warn',
  'Past Due': 'is-warn',
  paused: 'is-warn',
  suspended: 'is-bad',
  Suspended: 'is-bad',
  cancelled: 'is-bad',
  Cancelled: 'is-bad',
  canceled: 'is-bad',
  expired: 'is-bad',
  Disabled: 'is-bad',
  succeeded: 'is-good',
  Succeeded: 'is-good',
  failed: 'is-bad',
  Failed: 'is-bad',
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

/**
 * Plan price for display. Avoid "No charge" when admin/offline paid $0.
 * Returns null when Price should be hidden (keep Payment fact instead).
 */
export const formatPlanPrice = (sub) => {
  if (!sub || sub.price == null) return null;
  if (Number(sub.price) === 0) {
    if (sub.paymentSource === 'offline' || sub.paymentStatus === 'paid') {
      return 'Offline / admin';
    }
    if (sub.paymentSource === 'free') return 'No charge';
    return 'No charge';
  }
  const money = formatMoney(sub.price, sub.currency);
  if (
    money &&
    sub.billingCycle &&
    sub.billingCycle !== 'one_time'
  ) {
    return `${money} / ${sub.billingCycle.replace(/_?ly$/i, '').replace(/_/g, ' ')}`;
  }
  return money;
};

export const SALES_MAILTO =
  'mailto:hello@eijent.app?subject=Eijent%20sales%20inquiry';

export const BUY_CREDITS_MAILTO =
  'mailto:hello@eijent.app?subject=Eijent%20credit%20pack%20inquiry';

/** Spec-friendly ledger type labels from Core type + featureKey. */
export const ledgerTypeLabel = (row) => {
  if (!row) return '—';
  const key = String(row.featureKey || '');
  if (key.startsWith('credit_package:')) return 'Purchased';
  if (key.includes('expir')) return 'Expired';
  const core = String(row.type || '');
  if (core === 'reset') return 'Allocation';
  if (core === 'grant') return 'Manual';
  if (core === 'deduct') return 'Usage';
  return row.displayType || prettyStatus(core) || '—';
};

export const prettyServiceLabel = (key) => {
  if (!key) return '—';
  const raw = String(key);
  if (raw.startsWith('credit_package:')) return 'Credit package';
  if (raw === 'entity_overage_maxWorkspaces') return 'Workspace overage';
  if (raw === 'entity_overage_maxTeamMembers') return 'Seat overage';
  if (raw.startsWith('entity_overage_')) {
    const field = raw.slice('entity_overage_'.length);
    return `${field.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()).trim()} overage`;
  }
  if (raw.includes('_') || raw.includes(':')) {
    return raw
      .replace(/[:_]+/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim();
  }
  return raw;
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
  { href: '/dashboard/billing', id: 'billing', label: 'Billing' },
  { href: '/dashboard/team', id: 'team', label: 'Team' },
];
