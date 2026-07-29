'use client';

import React from 'react';
import MemberShell from '@/components/member/MemberShell';
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

function ErrorState({ message, onRetry }) {
  return (
    <div className="dash-error" role="alert">
      <p>{message}</p>
      <button type="button" className="signup-submit signup-submit--inline" onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}

/** Short glance view: available credits, plan, key limits, team size. */
export default function OverviewPage() {
  const { loading, error, data } = useMemberDashboard();

  if (loading) {
    return (
      <MemberShell active="overview" member={null}>
        <Loading />
      </MemberShell>
    );
  }

  if (error) {
    return (
      <MemberShell active="overview" member={null}>
        <ErrorState message={error} onRetry={() => window.location.reload()} />
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

        <section className="overview-credits dash-card">
          <div className="overview-credits__pair">
            <div className="overview-credits__stat">
              <span className="overview-credits__label">Available</span>
              <span className="overview-credits__value">
                {balance != null ? balance.toLocaleString() : '—'}
              </span>
              {allocation != null ? (
                <span className="overview-credits__hint">
                  Plan grant {allocation.toLocaleString()}
                  {prettyCycle(primarySub?.creditResetCycle || wallet?.resetCycle)
                    ? ` · ${prettyCycle(primarySub?.creditResetCycle || wallet?.resetCycle)}`
                    : ''}
                  {extras != null
                    ? ` · +${extras.toLocaleString()} top-up`
                    : ''}
                </span>
              ) : null}
            </div>
            <div className="overview-credits__divider" aria-hidden="true" />
            <div className="overview-credits__stat">
              <span className="overview-credits__label">Used this cycle</span>
              <span className="overview-credits__value overview-credits__value--spent">
                {totalDeducted != null ? totalDeducted.toLocaleString() : '—'}
              </span>
              {nextResetAt ? (
                <span className="overview-credits__hint">
                  Resets{' '}
                  {new Date(nextResetAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              ) : (
                <span className="overview-credits__hint">Spent from your wallet</span>
              )}
            </div>
          </div>
          <a href="/dashboard/credits" className="dash-link-btn">
            View history
          </a>
        </section>

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
            </div>
          </section>
        </div>
      </div>
    </MemberShell>
  );
}
