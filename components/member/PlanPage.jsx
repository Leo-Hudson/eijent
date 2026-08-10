'use client';

import React from 'react';
import MemberShell from '@/components/member/MemberShell';
import MemberErrorState from '@/components/member/MemberErrorState';
import MemberSoftActions from '@/components/member/MemberSoftActions';
import { useMemberDashboard, deriveWallet } from '@/hooks/useMemberDashboard';
import {
  BUY_CREDITS_MAILTO,
  findLimit,
  formatDate,
  formatNextInvoice,
  formatPlanPrice,
  formatUsedMax,
  limitProgressPct,
  limitStatusClass,
  prettyCycle,
  prettyStatus,
  SALES_MAILTO,
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

function ModuleLimitRow({ limit }) {
  const pct = limitProgressPct(limit);
  const statusClass = limitStatusClass(limit.status);
  const synced = typeof limit.used === 'number';
  const showBar = !limit.unlimited && typeof limit.limit === 'number';

  return (
    <li className={`dash-module-limit ${statusClass}`.trim()}>
      <div className="dash-module-limit__head">
        <span>{limit.label}</span>
        <strong>{formatUsedMax(limit)}</strong>
      </div>
      {showBar ? (
        <div
          className="dash-module-limit__bar"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct == null ? 0 : pct}
          aria-label={`${limit.label} usage`}
        >
          <span style={{ width: `${pct == null ? 0 : pct}%` }} />
        </div>
      ) : null}
      <div className="dash-module-limit__foot">
        <span>
          {limit.unlimited ? 'unlimited' : synced ? limit.status || 'normal' : 'awaiting sync'}
        </span>
        {!limit.unlimited && typeof limit.remaining === 'number' ? (
          <span>{limit.remaining.toLocaleString()} remaining</span>
        ) : null}
      </div>
    </li>
  );
}

function ModuleCard({ title, limits }) {
  return (
    <li className="dash-module-card dash-module-card--roomy">
      <div className="dash-module-card__top">
        <span className="dash-module-card__name">{title}</span>
      </div>
      <ul className="dash-module-card__limits">
        {limits.map((l) => (
          <ModuleLimitRow key={l.field || l.label} limit={l} />
        ))}
      </ul>
    </li>
  );
}

function MetricCard({ label, value, hint }) {
  return (
    <div className="app-metric-card">
      <span className="app-metric-card__label">{label}</span>
      <span className="app-metric-card__value">{value}</span>
      {hint ? <span className="app-metric-card__hint">{hint}</span> : null}
    </div>
  );
}

export default function PlanPage() {
  const { loading, error, errorCode, data, reload } = useMemberDashboard();

  if (loading) {
    return (
      <MemberShell active="plan" member={null}>
        <Loading />
      </MemberShell>
    );
  }

  if (error) {
    return (
      <MemberShell active="plan" member={data?.member || null} offline={errorCode === 'core_unavailable'}>
        <MemberErrorState message={error} code={errorCode} onRetry={reload} />
      </MemberShell>
    );
  }

  const { member, subscriptions = [], subAccounts = [], entitlements = null } = data || {};
  const { wallet, allocation, balance, totalDeducted, nextResetAt } = deriveWallet(data);
  const modules = entitlements?.modules || [];
  const limits = entitlements?.limits || [];
  const seatsLimit = findLimit(limits, 'maxTeamMembers');
  const workspacesLimit = findLimit(limits, 'maxWorkspaces');
  const seatsUsed =
    typeof seatsLimit?.used === 'number' ? seatsLimit.used : 1 + subAccounts.length;
  const primarySub = subscriptions[0] || null;
  const tone = STATUS_TONE[primarySub?.status] || 'is-warn';
  const serviceName =
    primarySub?.servicePlanName || entitlements?.servicePlan?.name || null;
  const priceLabel = primarySub ? formatPlanPrice(primarySub) : null;
  const resetCycle = prettyCycle(primarySub?.creditResetCycle || wallet?.resetCycle);
  const nextReset = formatDate(primarySub?.nextCreditResetAt || nextResetAt || wallet?.nextResetAt);
  const billingCycle = prettyCycle(primarySub?.billingCycle);
  const renewal = formatNextInvoice(primarySub) || formatDate(primarySub?.endDate);
  const usedPct =
    typeof totalDeducted === 'number' && typeof allocation === 'number' && allocation > 0
      ? Math.min(100, Math.round((totalDeducted / allocation) * 1000) / 10)
      : null;

  const standaloneLimits = limits
    .filter((l) => !l.module)
    .map((l) =>
      l.field === 'maxTeamMembers' ? { ...l, used: seatsUsed } : l,
    );
  const modulesWithLimits = [];
  const modulesIncludedOnly = [];
  for (const mod of modules) {
    const modLimits = limits.filter((l) => l.module === mod);
    if (modLimits.length) modulesWithLimits.push({ mod, modLimits });
    else modulesIncludedOnly.push(mod);
  }
  const limitedCardCount =
    modulesWithLimits.length + (standaloneLimits.length ? 1 : 0);

  const summaryRows = [
    {
      label: 'Status',
      value: primarySub?.status ? (
        <span className={`dash-badge ${tone}`}>{prettyStatus(primarySub.status)}</span>
      ) : (
        '—'
      ),
    },
    {
      label: 'Monthly credits',
      value: allocation != null ? allocation.toLocaleString() : '—',
    },
    {
      label: 'Seats',
      value: seatsLimit
        ? formatUsedMax({ ...seatsLimit, used: seatsUsed })
        : `${seatsUsed}`,
    },
    {
      label: 'Workspaces',
      value: workspacesLimit ? formatUsedMax(workspacesLimit) : '—',
    },
    {
      label: 'Active modules',
      value: modules.length ? modules.join(', ') : '—',
      wide: true,
    },
  ];

  return (
    <MemberShell active="plan" member={member}>
      <div className="dash">
        <header className="section-page-head">
          <h1 className="section-page-title">Plan</h1>
          <p className="section-page-sub">
            Subscription, modules, and usage limits for your account.
          </p>
        </header>

        {primarySub ? (
          <div className="plan-top-grid">
            <section className="plan-hero-card" aria-label="Pricing plan">
              <div className="plan-hero-card__head">
                {primarySub.status ? (
                  <span className={`dash-badge ${tone} dash-badge--on-dark`}>
                    {prettyStatus(primarySub.status)}
                  </span>
                ) : null}
                {serviceName ? (
                  <span className="plan-hero-card__service">{serviceName}</span>
                ) : null}
              </div>
              <h2 className="plan-hero-card__title">{primarySub.planName || 'Plan'}</h2>
              {priceLabel ? (
                <p className="plan-hero-card__price">{priceLabel}</p>
              ) : null}

              <dl className="plan-hero-card__facts">
                {billingCycle ? (
                  <div>
                    <dt>Billing cycle</dt>
                    <dd>{billingCycle}</dd>
                  </div>
                ) : null}
                {renewal ? (
                  <div>
                    <dt>Renewal date</dt>
                    <dd>{renewal}</dd>
                  </div>
                ) : null}
                {allocation != null ? (
                  <div>
                    <dt>Monthly credits</dt>
                    <dd>{allocation.toLocaleString()}</dd>
                  </div>
                ) : null}
                {resetCycle || nextReset ? (
                  <div>
                    <dt>Credits reset at</dt>
                    <dd>
                      {[resetCycle, nextReset].filter(Boolean).join(' · ') || '—'}
                    </dd>
                  </div>
                ) : null}
              </dl>

              <div className="plan-hero-card__actions">
                <a href={SALES_MAILTO} className="dash-link-btn dash-link-btn--on-dark">
                  Upgrade Plan
                </a>
                <a href="/dashboard/billing" className="dash-link-btn dash-link-btn--ghost-on-dark">
                  View Billing →
                </a>
              </div>
            </section>

            <section className="dash-card plan-summary-card" aria-label="Subscription summary">
              <div className="dash-card__head">
                <h2 className="dash-card__title">Subscription Summary</h2>
              </div>
              <dl className="plan-summary-list">
                {summaryRows.map((row) => (
                  <div
                    key={row.label}
                    className={`plan-summary-list__row${row.wide ? ' is-wide' : ''}`}
                  >
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="dash-card__foot plan-summary-card__foot">
                <a href={BUY_CREDITS_MAILTO} className="dash-link-btn">
                  Buy Credits
                </a>
                <a href={SALES_MAILTO} className="dash-link-btn dash-link-btn--ghost">
                  Contact Sales
                </a>
              </div>
            </section>
          </div>
        ) : (
          <section className="dash-card">
            <div className="dash-card__head">
              <h2 className="dash-card__title">Subscription</h2>
            </div>
            <p className="dash-empty">No active subscription found.</p>
            <div className="dash-card__foot">
              <MemberSoftActions showBilling={false} showCredits={false} />
            </div>
          </section>
        )}

        {primarySub ? (
          <div className="app-metric-row" aria-label="Credit metrics">
            <MetricCard
              label="Current balance"
              value={balance != null ? balance.toLocaleString() : '—'}
              hint={
                typeof balance === 'number' && typeof allocation === 'number' && balance > allocation
                  ? 'Includes top-ups'
                  : undefined
              }
            />
            <MetricCard
              label="Monthly allocation"
              value={allocation != null ? allocation.toLocaleString() : '—'}
              hint={resetCycle || undefined}
            />
            <MetricCard
              label="Credits used this cycle"
              value={totalDeducted != null ? totalDeducted.toLocaleString() : '—'}
              hint={usedPct != null ? `${usedPct}% of allocation` : undefined}
            />
            <MetricCard
              label="Next reset"
              value={nextReset || '—'}
              hint={resetCycle ? `${resetCycle} cycle` : undefined}
            />
          </div>
        ) : null}

        {subscriptions.length > 1 ? (
          <section className="dash-card">
            <div className="dash-card__head">
              <h2 className="dash-card__title">Other subscriptions</h2>
              <span className="dash-count">{subscriptions.length - 1}</span>
            </div>
            <ul className="dash-sub-list">
              {subscriptions.slice(1).map((sub) => {
                const subTone = STATUS_TONE[sub.status] || 'is-warn';
                return (
                  <li key={sub.id} className="dash-sub">
                    <div className="dash-sub__main">
                      <span className="dash-sub__plan">{sub.planName}</span>
                      <span className={`dash-badge ${subTone}`}>
                        {prettyStatus(sub.status)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        <section
          className={`dash-card${limitedCardCount ? '' : ' dash-card--muted'}`}
        >
          <div className="dash-card__head">
            <h2 className="dash-card__title">Modules & limits</h2>
            {limitedCardCount ? (
              <span className="dash-count">{limitedCardCount}</span>
            ) : null}
          </div>
          {limitedCardCount === 0 ? (
            <p className="dash-empty">
              {primarySub
                ? modulesIncludedOnly.length
                  ? 'No usage caps on your enabled modules yet. Included modules are listed below.'
                  : 'Modules will appear once your plan entitlements are assigned.'
                : 'No active subscription found. Modules unlock with a plan.'}
            </p>
          ) : (
            <>
              <ul
                className="dash-module-grid dash-module-grid--roomy"
                aria-label="Modules with usage limits"
              >
                {modulesWithLimits.map(({ mod, modLimits }) => (
                  <ModuleCard key={mod} title={mod} limits={modLimits} />
                ))}
                {standaloneLimits.length > 0 ? (
                  <ModuleCard title="Account" limits={standaloneLimits} />
                ) : null}
              </ul>
              {modulesIncludedOnly.length === 0 ? (
                <p className="dash-hint" style={{ marginTop: 14 }}>
                  Need a module that is not listed?{' '}
                  <a href={SALES_MAILTO}>Contact Sales</a> about plan options.
                </p>
              ) : null}
            </>
          )}
        </section>

        {modulesIncludedOnly.length > 0 ? (
          <section className="dash-card">
            <div className="dash-card__head">
              <h2 className="dash-card__title">Also included</h2>
              <span className="dash-count">{modulesIncludedOnly.length}</span>
            </div>
            <p className="dash-included__lead">
              These modules are on your plan without a separate usage cap.
            </p>
            <ul className="dash-included-list" aria-label="Included modules">
              {modulesIncludedOnly.map((mod) => (
                <li key={mod} className="dash-included-item">
                  {mod}
                </li>
              ))}
            </ul>
            <p className="dash-hint" style={{ marginTop: 14 }}>
              Need a module that is not listed?{' '}
              <a href={SALES_MAILTO}>Contact Sales</a> about plan options.
            </p>
          </section>
        ) : null}
      </div>
    </MemberShell>
  );
}
