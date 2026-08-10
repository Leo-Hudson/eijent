'use client';

import React from 'react';
import MemberShell from '@/components/member/MemberShell';
import MemberErrorState from '@/components/member/MemberErrorState';
import MemberSoftActions from '@/components/member/MemberSoftActions';
import { useMemberDashboard, deriveWallet } from '@/hooks/useMemberDashboard';
import {
  displayName,
  findLimit,
  formatUsedMax,
  prettyCycle,
  prettyStatus,
  STATUS_TONE,
  walletExtras,
} from '@/lib/memberDisplay';

function Loading() {
  return (
    <div className="dash-loading" aria-busy="true">
      <div className="dash-skeleton dash-skeleton--head" />
      <div className="dash-skeleton" />
      <div className="dash-skeleton" />
    </div>
  );
}

/** Short glance view: available credits, plan, key limits, team size. */
export default function OverviewPage() {
  const { loading, error, errorCode, data, reload } = useMemberDashboard();

  if (loading) {
    return (
      <MemberShell active="overview" member={null}>
        <Loading />
      </MemberShell>
    );
  }

  if (error) {
    return (
      <MemberShell active="overview" member={data?.member || null} offline={errorCode === 'core_unavailable'}>
        <MemberErrorState message={error} code={errorCode} onRetry={reload} />
      </MemberShell>
    );
  }

  const { member, subscriptions = [], subAccounts = [], entitlements = null } = data || {};
  const { balance, allocation, totalDeducted, isLowOnCredits, lowCreditThreshold, nextResetAt, wallet } =
    deriveWallet(data);
  const extras = walletExtras(balance, allocation);
  const limits = entitlements?.limits || [];
  const seatsLimit = findLimit(limits, 'maxTeamMembers');
  const workspacesLimit = findLimit(limits, 'maxWorkspaces');
  const primarySub = subscriptions[0] || null;
  const planTone = STATUS_TONE[primarySub?.status] || 'is-warn';
  const firstName = member?.firstName;
  const usedPct =
    typeof totalDeducted === 'number' && typeof allocation === 'number' && allocation > 0
      ? Math.min(100, Math.round((totalDeducted / allocation) * 1000) / 10)
      : null;

  return (
    <MemberShell active="overview" member={member}>
      <div className="dash overview">
        <header className="overview-hero">
          <div>
            <p className="dash-hello">
              {firstName ? `Hi, ${firstName}` : 'Welcome'}
            </p>
            <p className="overview-hero__sub">
              Your plan, credits, and team at a glance.
            </p>
          </div>
        </header>

        {isLowOnCredits ? (
          <div className="dash-low-credits" role="status">
            You are low on credits
            {balance != null ? ` (${balance.toLocaleString()} available)` : ''}
            {lowCreditThreshold != null && lowCreditThreshold > 0
              ? `. Warning shows below ${lowCreditThreshold.toLocaleString()}.`
              : '.'}{' '}
            Consider a credit pack or wait for your next reset.
          </div>
        ) : null}

        <MemberSoftActions showCredits />

        <div className="app-metric-row" aria-label="Credit metrics">
          <div className="app-metric-card">
            <span className="app-metric-card__label">Current balance</span>
            <span className="app-metric-card__value">
              {balance != null ? balance.toLocaleString() : '—'}
            </span>
            {allocation != null ? (
              <span className="app-metric-card__hint">
                Plan grant {allocation.toLocaleString()}
                {extras != null ? ` · +${extras.toLocaleString()} top-up` : ''}
              </span>
            ) : null}
          </div>
          <div className="app-metric-card">
            <span className="app-metric-card__label">Monthly allocation</span>
            <span className="app-metric-card__value">
              {allocation != null ? allocation.toLocaleString() : '—'}
            </span>
            {prettyCycle(primarySub?.creditResetCycle || wallet?.resetCycle) ? (
              <span className="app-metric-card__hint">
                {prettyCycle(primarySub?.creditResetCycle || wallet?.resetCycle)}
              </span>
            ) : null}
          </div>
          <div className="app-metric-card">
            <span className="app-metric-card__label">Credits used this cycle</span>
            <span className="app-metric-card__value">
              {totalDeducted != null ? totalDeducted.toLocaleString() : '—'}
            </span>
            <span className="app-metric-card__hint">
              {usedPct != null
                ? `${usedPct}% of allocation`
                : nextResetAt
                  ? `Resets ${new Date(nextResetAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}`
                  : 'Spent from your wallet'}
            </span>
          </div>
          <div className="app-metric-card">
            <span className="app-metric-card__label">Team</span>
            <span className="app-metric-card__value">{1 + subAccounts.length}</span>
            <span className="app-metric-card__hint">
              {subAccounts.length === 0
                ? 'Owner only'
                : `${subAccounts.length} sub-account${subAccounts.length === 1 ? '' : 's'}`}
            </span>
          </div>
        </div>

        <div className="overview-grid">
          <section className="dash-card">
            <div className="dash-card__head">
              <h2 className="dash-card__title">Plan</h2>
              {primarySub?.status ? (
                <span className={`dash-badge ${planTone}`}>
                  {prettyStatus(primarySub.status)}
                </span>
              ) : null}
            </div>
            {primarySub ? (
              <>
                <p className="overview-plan-name">{primarySub.planName || 'Plan'}</p>
                <p className="overview-plan-meta">
                  {[
                    entitlements?.servicePlan?.name || primarySub.servicePlanName,
                    `${1 + subAccounts.length} on team`,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
                <p className="overview-key-limits">
                  <span>Seats {formatUsedMax(seatsLimit)}</span>
                  <span aria-hidden="true"> · </span>
                  <span>Workspaces {formatUsedMax(workspacesLimit)}</span>
                </p>
                <div className="dash-card__foot">
                  <a href="/dashboard/plan" className="dash-link-btn dash-link-btn--ghost">
                    Full plan details
                  </a>
                </div>
              </>
            ) : (
              <p className="dash-empty">No active subscription yet.</p>
            )}
          </section>

          <section className="dash-card">
            <div className="dash-card__head">
              <h2 className="dash-card__title">Team</h2>
              <span className="dash-count">{1 + subAccounts.length}</span>
            </div>
            <p className="overview-plan-meta">
              {displayName(member, 'You')} (owner)
              {subAccounts.length > 0
                ? ` · ${subAccounts.length} sub-account${subAccounts.length === 1 ? '' : 's'}`
                : ' · no sub-accounts yet'}
            </p>
            <div className="dash-card__foot">
              <a href="/dashboard/team" className="dash-link-btn dash-link-btn--ghost">
                Manage team
              </a>
              <a href="/dashboard/credits" className="dash-link-btn dash-link-btn--ghost">
                View usage & history
              </a>
            </div>
          </section>
        </div>
      </div>
    </MemberShell>
  );
}
