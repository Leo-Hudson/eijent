import { NextResponse } from 'next/server';
import {
  coreMe,
  coreUnavailablePayload,
  isCoreUnavailable,
  slimMember,
} from '@/lib/coreAuth';
import { clearSessionCookie, getRequestToken } from '@/lib/session';

const CORE_API_BASE_URL = process.env.CORE_API_BASE_URL || '';
const CORE_API_KEY = process.env.CORE_API_KEY || '';

const coreHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${CORE_API_KEY}`,
});

const fetchSubscriptions = async (memberId) => {
  const query =
    `where[member][equals]=${encodeURIComponent(memberId)}` +
    `&depth=2&limit=20&sort=-startDate`;
  const res = await fetch(`${CORE_API_BASE_URL}/api/subscriptions?${query}`, {
    headers: coreHeaders(),
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data?.docs || []).map((sub) => {
    const plan = sub?.pricingPlan && typeof sub.pricingPlan === 'object' ? sub.pricingPlan : null;
    const servicePlan =
      plan?.servicePlan && typeof plan.servicePlan === 'object' ? plan.servicePlan : null;
    return {
      id: sub?.id,
      planName: plan?.name || 'Plan',
      servicePlanName: servicePlan?.name || null,
      status: sub?.status || null,
      paymentStatus: sub?.paymentStatus || null,
      paymentSource: sub?.paymentSource || null,
      price: typeof sub?.price === 'number' ? sub.price : null,
      currency: sub?.currency || null,
      billingCycle: sub?.billingCycle || null,
      startDate: sub?.startDate || null,
      nextBillingDate: sub?.nextBillingDate || null,
      creditBalance: typeof sub?.creditBalance === 'number' ? sub.creditBalance : null,
      creditAllocation: typeof sub?.creditAllocation === 'number' ? sub.creditAllocation : null,
      creditResetCycle: sub?.creditResetCycle || null,
      nextCreditResetAt: sub?.nextCreditResetAt || null,
    };
  });
};

const fetchCreditUsage = async (memberId) => {
  const query = `memberId=${encodeURIComponent(memberId)}`;
  const res = await fetch(`${CORE_API_BASE_URL}/api/credits/usage?${query}`, {
    headers: coreHeaders(),
    cache: 'no-store',
  });
  if (!res.ok) return null;
  const data = await res.json().catch(() => null);
  if (!data) return null;

  const byFeatureMap = {};
  const addFeatures = (src) => {
    if (!src || typeof src !== 'object') return;
    for (const [key, amount] of Object.entries(src)) {
      const n = Number(amount) || 0;
      if (!key || n <= 0) continue;
      byFeatureMap[key] = (byFeatureMap[key] || 0) + n;
    }
  };
  addFeatures(data?.owner?.byFeature);
  if (Array.isArray(data.bySubAccount)) {
    for (const b of data.bySubAccount) addFeatures(b?.byFeature);
  }
  const byFeature = Object.entries(byFeatureMap)
    .map(([key, deducted]) => ({ key, deducted }))
    .sort((a, b) => b.deducted - a.deducted);

  return {
    balance: typeof data.currentBalance === 'number' ? data.currentBalance : null,
    allocation: typeof data.allocation === 'number' ? data.allocation : null,
    totalDeducted: typeof data.totalDeducted === 'number' ? data.totalDeducted : 0,
    owner: {
      deducted: data?.owner?.deducted || 0,
      transactions: data?.owner?.transactions || 0,
    },
    bySubAccount: Array.isArray(data.bySubAccount)
      ? data.bySubAccount.map((b) => ({
          subAccountId: b.subAccountId,
          name:
            [b.firstName, b.lastName].filter(Boolean).join(' ').trim() ||
            b.email ||
            'Sub-account',
          email: b.email || null,
          deducted: b.deducted || 0,
          transactions: b.transactions || 0,
        }))
      : [],
    byFeature,
  };
};

const fetchEntitlements = async (memberId) => {
  const query = `memberId=${encodeURIComponent(memberId)}`;
  const res = await fetch(`${CORE_API_BASE_URL}/api/entitlements?${query}`, {
    headers: coreHeaders(),
    cache: 'no-store',
  });
  if (!res.ok) return null;
  const data = await res.json().catch(() => null);
  if (!data) return null;

  const limits = Array.isArray(data.limits)
    ? data.limits
        .filter((l) => l?.moduleEnabled !== false)
        .map((l) => ({
          field: l.field ?? null,
          label: l.label || 'Limit',
          module: l.module || null,
          unlimited: Boolean(l.unlimited),
          limit: typeof l.limit === 'number' ? l.limit : null,
          used: typeof l.used === 'number' ? l.used : null,
          remaining: typeof l.remaining === 'number' ? l.remaining : null,
          status: l.status || null,
          custom: Boolean(l.custom),
        }))
    : [];

  return {
    subscriptionId: data.subscriptionId || null,
    status: data.status || null,
    pricingPlan: data.pricingPlan || null,
    servicePlan: data.servicePlan || null,
    modules: Array.isArray(data.modules) ? data.modules : [],
    limits,
    usageCountsUpdatedAt: data.usageCountsUpdatedAt || null,
    credits: data.credits
      ? {
          balance: typeof data.credits.balance === 'number' ? data.credits.balance : null,
          allocation: typeof data.credits.allocation === 'number' ? data.credits.allocation : null,
          resetCycle: data.credits.resetCycle || null,
          customDays: data.credits.customDays ?? null,
          nextResetAt: data.credits.nextResetAt || null,
          unusedCreditsPolicy: data.credits.unusedCreditsPolicy || null,
          lowCreditAlertThreshold:
            typeof data.credits.lowCreditAlertThreshold === 'number'
              ? data.credits.lowCreditAlertThreshold
              : null,
          isLowOnCredits: Boolean(data.credits.isLowOnCredits),
        }
      : null,
  };
};

const fetchSubAccounts = async (memberId) => {
  // Caps at 100 client-side; Team page paginates/filters locally. Orgs over 100 need a paged Core proxy later.
  const query =
    `where[member_owner][equals]=${encodeURIComponent(memberId)}` +
    `&depth=0&limit=100&sort=-createdAt`;
  const res = await fetch(`${CORE_API_BASE_URL}/api/member-sub-accounts?${query}`, {
    headers: coreHeaders(),
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data?.docs || []).map((acc) => ({
    id: acc?.id,
    firstName: acc?.firstName || '',
    lastName: acc?.lastName || '',
    email: acc?.email || '',
    role: acc?.role ?? null,
    status: acc?.status || null,
  }));
};

const fetchPayments = async (memberId) => {
  const query =
    `where[member][equals]=${encodeURIComponent(memberId)}` +
    `&depth=0&limit=10&sort=-paymentDate`;
  const res = await fetch(`${CORE_API_BASE_URL}/api/payments?${query}`, {
    headers: coreHeaders(),
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const data = await res.json().catch(() => ({}));
  return (data?.docs || []).map((p) => ({
    id: p?.id,
    amount: typeof p?.amount === 'number' ? p.amount : null,
    currency: p?.currency || null,
    status: p?.status || null,
    paymentDate: p?.paymentDate || null,
    paymentMethod: p?.paymentMethod || null,
  }));
};

export const GET = async (req) => {
  const token = getRequestToken(req);
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
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

  try {
    const [subscriptions, subAccounts, credits, entitlements, payments] = await Promise.all([
      fetchSubscriptions(user.id),
      fetchSubAccounts(user.id),
      fetchCreditUsage(user.id),
      fetchEntitlements(user.id),
      fetchPayments(user.id),
    ]);

    return NextResponse.json({
      authenticated: true,
      member: slimMember(user),
      subscriptions,
      subAccounts,
      credits,
      entitlements,
      payments,
    });
  } catch (err) {
    if (isCoreUnavailable(err) || err?.cause?.code === 'ECONNREFUSED') {
      return NextResponse.json(coreUnavailablePayload(), { status: 503 });
    }
    // Network failures from undici/node fetch often surface as TypeError
    if (err instanceof TypeError || /fetch|ECONNREFUSED|ENOTFOUND|network/i.test(String(err?.message))) {
      return NextResponse.json(coreUnavailablePayload(), { status: 503 });
    }
    throw err;
  }
};
