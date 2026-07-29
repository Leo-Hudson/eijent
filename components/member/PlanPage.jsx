'use client';

import React from 'react';
import MemberShell from '@/components/member/MemberShell';
import { useMemberDashboard, deriveWallet } from '@/hooks/useMemberDashboard';
import {
  formatDate,
  formatMoney,
  formatNextInvoice,
  formatUsedMax,
  limitProgressPct,
  limitStatusClass,
  prettyCycle,
  prettyStatus,
  STATUS_TONE,
} from '@/lib/memberDisplay';

function Loading() {
  return (
    <div className="dash-loading" aria-busy="true">
      <div className="dash-skeleton dash-skeleton--head" />
      <div className="dash-skeleton" />
    </div>
  );
}

export default function PlanPage() {
  const { loading, error, data } = useMemberDashboard();
  const [openModules, setOpenModules] = React.useState(false);
  const [showAllLimits, setShowAllLimits] = React.useState(false);

  if (loading) {
    return (
      <MemberShell active="plan" member={null}>
        <Loading />
      </MemberShell>
    );
  }

  if (error) {
    return (
      <MemberShell active="plan" member={null}>
        <div className="dash-error" role="alert">
          <p>{error}</p>
        </div>
      </MemberShell>
    );
  }

  const { member, subscriptions = [], entitlements = null } = data || {};
  const { wallet, allocation, balance } = deriveWallet(data);
  const modules = entitlements?.modules || [];
  const limits = entitlements?.limits || [];
  const cappedLimits = limits.filter((l) => !l.unlimited && typeof l.limit === 'number');
  const LIMIT_PREVIEW = 8;
  const visibleLimits = showAllLimits
    ? cappedLimits
    : cappedLimits.slice(0, LIMIT_PREVIEW);
  const hasMoreLimits = cappedLimits.length > LIMIT_PREVIEW;

  return (
    <MemberShell active="plan" member={member}>
      <div className="dash">
        <header className="section-page-head">
          <h1 className="section-page-title">Plan</h1>
          <p className="section-page-sub">
            Billing, modules, and usage limits for your subscription.
          </p>
        </header>

        <section className="dash-card">
          <div className="dash-card__head">
            <h2 className="dash-card__title">Subscription</h2>
          </div>
          {subscriptions.length === 0 ? (
            <p className="dash-empty">No active subscription found.</p>
          ) : (
            <ul className="dash-sub-list">
              {subscriptions.map((sub) => {
                const money = formatMoney(sub.price, sub.currency);
                const tone = STATUS_TONE[sub.status] || 'is-warn';
                const serviceName =
                  sub.servicePlanName || entitlements?.servicePlan?.name || null;
                const priceLabel =
                  money &&
                  money !== 'No charge' &&
                  sub.billingCycle &&
                  sub.billingCycle !== 'one_time'
                    ? `${money} / ${sub.billingCycle.replace(/_?ly$/i, '').replace(/_/g, ' ')}`
                    : money;
                const resetCycle = prettyCycle(sub.creditResetCycle || wallet?.resetCycle);
                const nextReset = formatDate(sub.nextCreditResetAt || wallet?.nextResetAt);
                const facts = [
                  serviceName ? { label: 'Service plan', value: serviceName } : null,
                  priceLabel ? { label: 'Price', value: priceLabel } : null,
                  { label: 'Payment', value: prettyStatus(sub.paymentStatus) },
                  formatDate(sub.startDate)
                    ? { label: 'Started', value: formatDate(sub.startDate) }
                    : null,
                  prettyCycle(sub.billingCycle)
                    ? { label: 'Billing cycle', value: prettyCycle(sub.billingCycle) }
                    : null,
                  formatNextInvoice(sub)
                    ? { label: 'Next invoice', value: formatNextInvoice(sub) }
                    : null,
                  resetCycle
                    ? {
                        label: 'Credit reset',
                        value: nextReset ? `${resetCycle} · next ${nextReset}` : resetCycle,
                      }
                    : null,
                  allocation != null
                    ? {
                        label: 'Plan grant',
                        value: `${allocation.toLocaleString()} credits`,
                      }
                    : null,
                  balance != null
                    ? {
                        label: 'Available',
                        value: `${balance.toLocaleString()} credits`,
                      }
                    : null,
                ].filter(Boolean);

                return (
                  <li key={sub.id} className="dash-sub">
                    <div className="dash-sub__main">
                      <span className="dash-sub__plan">{sub.planName}</span>
                      <span className={`dash-badge ${tone}`}>
                        {prettyStatus(sub.status)}
                      </span>
                    </div>
                    <dl className="dash-sub__facts">
                      {facts.map((fact) => (
                        <div key={fact.label} className="dash-sub__fact">
                          <dt>{fact.label}</dt>
                          <dd>{fact.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className={`dash-card${modules.length ? '' : ' dash-card--muted'}`}>
          <div className="dash-card__head">
            <h2 className="dash-card__title">Modules</h2>
            <span className="dash-count">{modules.length}</span>
          </div>
          {modules.length === 0 ? (
            <p className="dash-empty">Modules will appear once your plan is assigned.</p>
          ) : (
            <>
              <ul className="module-chips" aria-label="Enabled modules">
                {modules.map((mod) => (
                  <li key={mod} className="module-chip">
                    {mod}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="module-accordion-toggle"
                aria-expanded={openModules}
                onClick={() => setOpenModules((v) => !v)}
              >
                {openModules ? 'Hide module limits' : 'Show limits by module'}
              </button>
              {openModules ? (
                <ul className="dash-module-grid" style={{ marginTop: 12 }}>
                  {modules.map((mod) => {
                    const modLimits = limits.filter((l) => l.module === mod);
                    return (
                      <li key={mod} className="dash-module-card">
                        <div className="dash-module-card__top">
                          <span className="dash-module-card__name">{mod}</span>
                          <span className="dash-badge is-good">Enabled</span>
                        </div>
                        {modLimits.length === 0 ? (
                          <p className="dash-module-card__meta">Included with your plan</p>
                        ) : (
                          <ul className="dash-module-card__limits">
                            {modLimits.map((l) => (
                              <li key={l.field || l.label}>
                                <span>{l.label}</span>
                                <strong>{formatUsedMax(l)}</strong>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </>
          )}
        </section>

        <section className={`dash-card${cappedLimits.length ? '' : ' dash-card--muted'}`}>
          <div className="dash-card__head">
            <h2 className="dash-card__title">Limits</h2>
            <span className="dash-count">{cappedLimits.length}</span>
          </div>
          {cappedLimits.length === 0 ? (
            <p className="dash-empty">
              No numeric caps on this plan, or usage has not been synced from the product yet.
            </p>
          ) : (
            <>
              <ul className="dash-limits">
                {visibleLimits.map((limit) => {
                  const pct = limitProgressPct(limit);
                  const statusClass = limitStatusClass(limit.status);
                  const synced = typeof limit.used === 'number';
                  return (
                    <li
                      key={limit.field || limit.label}
                      className={`dash-limit ${statusClass}`.trim()}
                    >
                      <div className="dash-limit__head">
                        <div>
                          <span className="dash-limit__name">{limit.label}</span>
                          {limit.module ? (
                            <span className="dash-limit__module">{limit.module}</span>
                          ) : null}
                        </div>
                        <span className="dash-limit__ratio">{formatUsedMax(limit)}</span>
                      </div>
                      <div className="dash-limit__bar" aria-hidden="true">
                        <span style={{ width: `${pct == null ? 0 : pct}%` }} />
                      </div>
                      <div className="dash-limit__foot">
                        <span>{synced ? limit.status || 'normal' : 'awaiting sync'}</span>
                        {typeof limit.remaining === 'number' ? (
                          <span>{limit.remaining.toLocaleString()} remaining</span>
                        ) : (
                          <span>Not synced yet</span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
              {hasMoreLimits ? (
                <button
                  type="button"
                  className="module-accordion-toggle"
                  onClick={() => setShowAllLimits((v) => !v)}
                >
                  {showAllLimits
                    ? 'Show fewer limits'
                    : `Show all ${cappedLimits.length} limits`}
                </button>
              ) : null}
            </>
          )}
        </section>
      </div>
    </MemberShell>
  );
}
