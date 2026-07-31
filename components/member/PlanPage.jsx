'use client';

import React from 'react';
import MemberShell from '@/components/member/MemberShell';
import MemberErrorState from '@/components/member/MemberErrorState';
import MemberSoftActions from '@/components/member/MemberSoftActions';
import { useMemberDashboard, deriveWallet } from '@/hooks/useMemberDashboard';
import {
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
  const { wallet, allocation, balance } = deriveWallet(data);
  const modules = entitlements?.modules || [];
  const limits = entitlements?.limits || [];
  const seatsLimit = findLimit(limits, 'maxTeamMembers');
  const workspacesLimit = findLimit(limits, 'maxWorkspaces');
  const seatsUsed =
    typeof seatsLimit?.used === 'number' ? seatsLimit.used : 1 + subAccounts.length;
  const primarySub = subscriptions[0] || null;
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

  return (
    <MemberShell active="plan" member={member}>
      <div className="dash">
        <header className="section-page-head">
          <h1 className="section-page-title">Plan</h1>
          <p className="section-page-sub">
            Subscription, modules, and usage limits for your account.
          </p>
        </header>

        <MemberSoftActions />

        <section className="dash-card">
          <div className="dash-card__head">
            <h2 className="dash-card__title">Subscription</h2>
          </div>
          {subscriptions.length === 0 ? (
            <p className="dash-empty">No active subscription found.</p>
          ) : (
            <>
              <ul className="dash-sub-list">
                {subscriptions.map((sub) => {
                  const tone = STATUS_TONE[sub.status] || 'is-warn';
                  const serviceName =
                    sub.servicePlanName || entitlements?.servicePlan?.name || null;
                  const priceLabel = formatPlanPrice(sub);
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

              <div className="dash-summary" aria-label="Plan summary">
                <div className="dash-summary__item">
                  <span className="dash-summary__label">Included credits</span>
                  <span className="dash-summary__value">
                    {allocation != null ? allocation.toLocaleString() : '—'}
                  </span>
                </div>
                <div className="dash-summary__item">
                  <span className="dash-summary__label">Seats</span>
                  <span className="dash-summary__value">
                    {seatsLimit
                      ? formatUsedMax({ ...seatsLimit, used: seatsUsed })
                      : `${seatsUsed}`}
                  </span>
                </div>
                <div className="dash-summary__item">
                  <span className="dash-summary__label">Workspaces</span>
                  <span className="dash-summary__value">
                    {workspacesLimit ? formatUsedMax(workspacesLimit) : '—'}
                  </span>
                </div>
                <div className="dash-summary__item">
                  <span className="dash-summary__label">Modules</span>
                  <span className="dash-summary__value">{modules.length}</span>
                </div>
              </div>
            </>
          )}
        </section>

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
