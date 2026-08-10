'use client'

import React from 'react'
import {
  formatPlanPriceLabel,
  isSelfServeablePlan,
} from '@/lib/memberPlan'

function ComingSoonModal({ open, onClose }) {
  if (!open) return null
  return (
    <div
      className="choose-plan-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="coming-soon-title"
    >
      <button
        type="button"
        className="choose-plan-modal__backdrop"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="choose-plan-modal__panel">
        <h2 id="coming-soon-title">Coming soon</h2>
        <p>
          Online checkout for paid plans is not available yet. Pick the free demo plan to continue
          testing.
        </p>
        <div className="signup-actions">
          <button type="button" className="signup-submit" onClick={onClose}>
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}

function PlanCard({ plan, busy, onPick }) {
  const priceLabel = formatPlanPriceLabel(plan) || '—'
  const free = isSelfServeablePlan(plan)
  const features = Array.isArray(plan.featureGroups)
    ? plan.featureGroups.flatMap((g) => (Array.isArray(g.items) ? g.items : [])).slice(0, 4)
    : []
  const creditsLabel =
    typeof plan.credits === 'number' ? `${plan.credits.toLocaleString()} credits / cycle` : null

  return (
    <article
      className={[
        'choose-plan-card',
        plan.featured ? 'is-featured' : '',
        free ? 'is-free' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="choose-plan-card__badges">
        {plan.featured ? <span className="choose-plan-card__badge">Popular</span> : null}
        {free ? <span className="choose-plan-card__badge is-free">Free demo</span> : null}
      </div>

      <h2 className="choose-plan-card__name">{plan.name}</h2>
      <p className="choose-plan-card__price">{priceLabel}</p>

      {plan.shortDescription ? (
        <p className="choose-plan-card__desc">{plan.shortDescription}</p>
      ) : creditsLabel ? (
        <p className="choose-plan-card__desc">{creditsLabel}</p>
      ) : (
        <p className="choose-plan-card__desc">Plan details coming soon.</p>
      )}

      {creditsLabel && plan.shortDescription ? (
        <p className="choose-plan-card__meta">{creditsLabel}</p>
      ) : null}

      {features.length > 0 ? (
        <ul className="choose-plan-card__features">
          {features.map((item, idx) => (
            <li key={`${plan.id}-${idx}`}>
              {item.label}
              {item.value ? `: ${item.value}` : ''}
            </li>
          ))}
        </ul>
      ) : null}

      <button
        type="button"
        className={free ? 'choose-plan-card__cta' : 'choose-plan-card__cta is-secondary'}
        onClick={() => onPick(plan)}
        disabled={busy}
      >
        {busy ? 'Working…' : free ? 'Get started free' : 'Coming soon'}
      </button>
    </article>
  )
}

export default function ChoosePlanPage() {
  const [plans, setPlans] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [busyId, setBusyId] = React.useState('')
  const [comingSoon, setComingSoon] = React.useState(false)

  React.useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await fetch('/api/pricing-plans', { cache: 'no-store' })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error || 'Unable to load plans.')
        if (!active) return
        const list = Array.isArray(data.plans) ? data.plans : []
        // Free / featured first so the usable demo plan is obvious.
        list.sort((a, b) => {
          const af = isSelfServeablePlan(a) ? 0 : 1
          const bf = isSelfServeablePlan(b) ? 0 : 1
          if (af !== bf) return af - bf
          if (Boolean(b.featured) !== Boolean(a.featured)) return Number(b.featured) - Number(a.featured)
          return (a.displayOrder || 0) - (b.displayOrder || 0)
        })
        setPlans(list)
      } catch (err) {
        if (active) setError(err.message || 'Unable to load plans.')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  const onPick = async (plan) => {
    if (!plan) return

    if (!isSelfServeablePlan(plan)) {
      setComingSoon(true)
      return
    }

    setBusyId(plan.id)
    setError('')
    try {
      const res = await fetch('/api/plans/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pricingPlanId: plan.id }),
      })
      const data = await res.json().catch(() => ({}))

      if (res.status === 401) {
        window.location.assign('/login?next=/dashboard/choose-plan')
        return
      }

      if (res.status === 402 || data.comingSoon) {
        setComingSoon(true)
        setBusyId('')
        return
      }

      if (!res.ok) {
        throw new Error(data.error || 'Unable to select this plan.')
      }

      window.location.assign('/dashboard')
    } catch (err) {
      setError(err.message || 'Unable to select this plan.')
      setBusyId('')
    }
  }

  const signOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // redirect anyway
    }
    window.location.assign('/login')
  }

  const hasFree = plans.some((p) => isSelfServeablePlan(p))

  return (
    <div className="dash-page">
      <div className="dash-page__glow" aria-hidden="true" />
      <div className="dash-shell dash-shell--choose-plan">
        <div className="choose-plan__top">
          <a href="/" className="choose-plan__brand">
            Eijent
          </a>
          <button type="button" className="dash-signout" onClick={signOut}>
            Sign out
          </button>
        </div>

        <header className="choose-plan__header">
          <h1 className="choose-plan__title">Choose your plan</h1>
          <p className="choose-plan__lede">
            Your account is approved. Pick a plan to unlock your dashboard.
            {!hasFree && !loading
              ? ' No free plan is available yet. Ask an admin to activate the Free Demo plan.'
              : ' Paid checkout is coming soon; use Free Demo to continue testing.'}
          </p>
        </header>

        {loading ? <p className="choose-plan__hint">Loading plans…</p> : null}

        {!loading && plans.length === 0 && !error ? (
          <p className="choose-plan__hint" role="status">
            No plans are available right now. Please check back soon.
          </p>
        ) : null}

        {plans.length > 0 ? (
          <div className="choose-plan-grid">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                busy={Boolean(busyId)}
                onPick={onPick}
              />
            ))}
          </div>
        ) : null}

        {error ? (
          <p className="signup-form-error" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      <ComingSoonModal open={comingSoon} onClose={() => setComingSoon(false)} />
    </div>
  )
}
