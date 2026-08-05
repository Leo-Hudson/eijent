/**
 * Helpers for post-approval plan selection.
 */

export const TERMINAL_SUB_STATUSES = new Set(['cancelled', 'expired', 'canceled'])

/** True when the member has a non-terminal subscription (active, pending, etc.). */
export const hasBlockingSubscription = (subscriptions = []) =>
  Array.isArray(subscriptions) &&
  subscriptions.some((sub) => {
    const status = String(sub?.status || '').toLowerCase()
    return status && !TERMINAL_SUB_STATUSES.has(status)
  })

/** Free / $0 plans can be selected without Stripe. */
export const isSelfServeablePlan = (plan) => {
  if (!plan) return false
  if (plan.pricingType === 'free') return true
  if (typeof plan.price === 'number' && plan.price === 0) return true
  if (typeof plan.priceMajor === 'number' && plan.priceMajor === 0) return true
  return false
}

export const formatPlanPriceLabel = (plan) => {
  if (!plan) return ''
  if (isSelfServeablePlan(plan)) return 'Free'
  const major =
    typeof plan.priceMajor === 'number'
      ? plan.priceMajor
      : typeof plan.price === 'number'
        ? plan.price / 100
        : null
  if (major == null) return ''
  try {
    const money = major.toLocaleString(undefined, {
      style: 'currency',
      currency: (plan.currency || 'usd').toUpperCase(),
    })
    if (plan.pricingType === 'recurring' && plan.paymentFrequency) {
      const freq =
        plan.paymentFrequency === 'year'
          ? 'year'
          : plan.paymentFrequency === 'month'
            ? 'mo'
            : plan.paymentFrequency.replace(/_/g, ' ')
      return `${money}/${freq}`
    }
    return money
  } catch {
    return String(major)
  }
}
