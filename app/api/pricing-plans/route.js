import { NextResponse } from 'next/server';

const CORE_API_BASE_URL = process.env.CORE_API_BASE_URL || '';
const CORE_API_KEY = process.env.CORE_API_KEY || '';
const CORE_TENANT_ID = process.env.CORE_TENANT_ID || '';

/**
 * Maps a Core pricing-plan doc (with product populated at depth>=2) into the
 * slim shape the choose-plan / catalog UI needs. Price on the product is stored
 * in minor units (cents).
 */
const toSlimPlan = (doc) => {
  const product = doc?.product && typeof doc.product === 'object' ? doc.product : null;
  const planConfig = product?.planConfig || {};
  const priceMinor = typeof product?.price === 'number' ? product.price : null;
  const currency = product?.currency || 'USD';

  const featureGroups = Array.isArray(planConfig.featureGroups)
    ? planConfig.featureGroups
        .filter((g) => g?.title)
        .map((g) => ({
          title: g.title,
          items: Array.isArray(g.items)
            ? g.items
                .filter((i) => i?.label)
                .map((i) => ({
                  label: i.label,
                  value: i.value || null,
                }))
            : [],
        }))
    : [];

  const trialUnit = planConfig.freeTrialUnit === 'weeks' ? 'weeks' : 'days';
  const trialRaw =
    planConfig.enableFreeTrial && typeof planConfig.freeTrialDays === 'number'
      ? planConfig.freeTrialDays
      : null;
  const freeTrialDays =
    trialRaw == null ? null : trialUnit === 'weeks' ? trialRaw * 7 : trialRaw;

  return {
    id: doc.id,
    name: product?.title || doc.name,
    shortDescription: planConfig.shortDescription || null,
    featured: Boolean(doc.featured),
    displayOrder: typeof doc.displayOrder === 'number' ? doc.displayOrder : 0,
    credits: typeof doc.credits === 'number' ? doc.credits : null,
    price: priceMinor,
    priceMajor: priceMinor === null ? null : priceMinor / 100,
    currency,
    pricingType: planConfig.pricingType || null,
    paymentFrequency: planConfig.paymentFrequency || null,
    planLength: planConfig.planLength || null,
    customDuration: planConfig.customDuration ?? null,
    customDurationUnit: planConfig.customDurationUnit || null,
    chargeSetupFee: Boolean(planConfig.chargeSetupFee),
    setupFeeAmount:
      planConfig.chargeSetupFee && typeof planConfig.setupFeeAmount === 'number'
        ? planConfig.setupFeeAmount
        : null,
    freeTrialDays,
    freeTrialUnit: planConfig.enableFreeTrial ? trialUnit : null,
    allowCancellation: planConfig.settings?.allowCancellation !== false,
    limitOnePerCustomer: Boolean(planConfig.settings?.limitOnePerCustomer),
    allowCustomerStartDate: Boolean(planConfig.settings?.allowCustomerStartDate),
    featureGroups,
    hasProduct: Boolean(product),
  };
};

/**
 * Server-side proxy so CORE_API_KEY never reaches the browser.
 * Returns active Eijent pricing plans, sorted by displayOrder.
 */
export const GET = async () => {
  try {
    if (!CORE_API_BASE_URL || !CORE_API_KEY || !CORE_TENANT_ID) {
      throw new Error(
        'Pricing is not configured (missing CORE_API_BASE_URL, CORE_API_KEY or CORE_TENANT_ID).',
      );
    }

    const query =
      `where[status][equals]=active` +
      `&where[tenant][equals]=${encodeURIComponent(CORE_TENANT_ID)}` +
      `&sort=displayOrder&depth=2&limit=100`;

    const res = await fetch(`${CORE_API_BASE_URL}/api/pricing-plans?${query}`, {
      headers: { Authorization: `Bearer ${CORE_API_KEY}` },
      cache: 'no-store',
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      if (process.env.DEBUG_LOGS === '1') {
        console.error('[pricing-plans] Core fetch failed', { status: res.status, detail });
      }
      return NextResponse.json({ error: 'Unable to load plans right now.' }, { status: 502 });
    }

    const data = await res.json();
    const plans = Array.isArray(data?.docs)
      ? data.docs
          .map(toSlimPlan)
          // Skip pricing plans whose product was deleted / cannot be populated.
          .filter((plan) => plan.hasProduct && plan.price != null)
      : [];

    return NextResponse.json({ plans });
  } catch (error) {
    if (process.env.DEBUG_LOGS === '1') console.error('[pricing-plans]', error);
    return NextResponse.json({ error: 'Unable to load plans right now.' }, { status: 500 });
  }
};
