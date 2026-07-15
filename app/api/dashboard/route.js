import { NextResponse } from 'next/server';
import { coreMe, slimMember } from '@/lib/coreAuth';
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
    return {
      id: sub?.id,
      planName: plan?.name || 'Plan',
      status: sub?.status || null,
      paymentStatus: sub?.paymentStatus || null,
      price: typeof sub?.price === 'number' ? sub.price : null,
      currency: sub?.currency || null,
      billingCycle: sub?.billingCycle || null,
      startDate: sub?.startDate || null,
      nextBillingDate: sub?.nextBillingDate || null,
    };
  });
};

const fetchSubAccounts = async (memberId) => {
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

export const GET = async (req) => {
  const token = getRequestToken(req);
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const user = await coreMe(token);
  if (!user?.id) {
    const res = NextResponse.json({ authenticated: false }, { status: 401 });
    clearSessionCookie(res);
    return res;
  }

  const [subscriptions, subAccounts] = await Promise.all([
    fetchSubscriptions(user.id),
    fetchSubAccounts(user.id),
  ]);

  return NextResponse.json({
    authenticated: true,
    member: slimMember(user),
    subscriptions,
    subAccounts,
    // Credit usage lands in a later phase.
    credits: null,
  });
};
