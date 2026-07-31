'use client';

import React from 'react';
import MemberShell from '@/components/member/MemberShell';
import MemberErrorState from '@/components/member/MemberErrorState';
import MemberSoftActions from '@/components/member/MemberSoftActions';
import { useMemberDashboard } from '@/hooks/useMemberDashboard';
import {
  BUY_CREDITS_MAILTO,
  displayName,
  formatDate,
  formatMoney,
  formatNextInvoice,
  formatPlanPrice,
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

export default function BillingPage() {
  const { loading, error, errorCode, data, reload } = useMemberDashboard();

  if (loading) {
    return (
      <MemberShell active="billing" member={null}>
        <Loading />
      </MemberShell>
    );
  }

  if (error) {
    return (
      <MemberShell active="billing" member={data?.member || null} offline={errorCode === 'core_unavailable'}>
        <MemberErrorState message={error} code={errorCode} onRetry={reload} />
      </MemberShell>
    );
  }

  const { member, subscriptions = [], payments = [] } = data || {};
  const primarySub = subscriptions[0] || null;
  const tone = STATUS_TONE[primarySub?.status] || 'is-warn';
  const priceLabel = primarySub ? formatPlanPrice(primarySub) : null;
  const contactName = displayName(member, '—');

  return (
    <MemberShell active="billing" member={member}>
      <div className="dash">
        <header className="section-page-head">
          <div className="section-page-head__row">
            <div>
              <h1 className="section-page-title">Billing</h1>
              <p className="section-page-sub">
                Subscription billing summary. Card on file and invoices are not enabled yet.
              </p>
            </div>
            <span className="dash-badge is-soon">Coming soon</span>
          </div>
        </header>

        <MemberSoftActions showBilling={false} showCredits />

        <section className="dash-card">
          <div className="dash-card__head">
            <h2 className="dash-card__title">Billing summary</h2>
            {primarySub?.status ? (
              <span className={`dash-badge ${tone}`}>{prettyStatus(primarySub.status)}</span>
            ) : null}
          </div>
          {!primarySub ? (
            <p className="dash-empty">No active subscription found.</p>
          ) : (
            <dl className="dash-sub__facts">
              <div className="dash-sub__fact">
                <dt>Plan</dt>
                <dd>{primarySub.planName || 'Plan'}</dd>
              </div>
              {prettyCycle(primarySub.billingCycle) ? (
                <div className="dash-sub__fact">
                  <dt>Cycle</dt>
                  <dd>{prettyCycle(primarySub.billingCycle)}</dd>
                </div>
              ) : null}
              {formatNextInvoice(primarySub) ? (
                <div className="dash-sub__fact">
                  <dt>Next bill</dt>
                  <dd>{formatNextInvoice(primarySub)}</dd>
                </div>
              ) : null}
              {priceLabel ? (
                <div className="dash-sub__fact">
                  <dt>Price</dt>
                  <dd>{priceLabel}</dd>
                </div>
              ) : null}
              <div className="dash-sub__fact">
                <dt>Payment</dt>
                <dd>{prettyStatus(primarySub.paymentStatus)}</dd>
              </div>
            </dl>
          )}
        </section>

        <section className="dash-card dash-card--muted">
          <div className="dash-card__head">
            <h2 className="dash-card__title">Payment method</h2>
            <span className="dash-badge is-soon">Coming soon</span>
          </div>
          <p className="dash-empty">
            Card on file will appear here when self-serve payments are enabled. Today, plans are
            activated by an admin after payment is confirmed offline.
          </p>
        </section>

        <section className="dash-card">
          <div className="dash-card__head">
            <h2 className="dash-card__title">Billing contact</h2>
          </div>
          <dl className="dash-sub__facts">
            <div className="dash-sub__fact">
              <dt>Name</dt>
              <dd>{contactName}</dd>
            </div>
            <div className="dash-sub__fact">
              <dt>Email</dt>
              <dd>{member?.email || '—'}</dd>
            </div>
            <div className="dash-sub__fact">
              <dt>Phone</dt>
              <dd>{member?.phone || '—'}</dd>
            </div>
          </dl>
        </section>

        <section className="dash-card dash-card--muted">
          <div className="dash-card__head">
            <h2 className="dash-card__title">Invoice history</h2>
            <span className="dash-badge is-soon">Coming soon</span>
          </div>
          <p className="dash-empty">
            Invoices will appear here when payments are enabled.
          </p>
          <div className="member-soft-actions member-soft-actions--compact" style={{ marginTop: 12 }}>
            <button type="button" className="dash-link-btn dash-link-btn--ghost" disabled title="Coming soon">
              Download Invoice
            </button>
          </div>
        </section>

        {payments.length > 0 ? (
          <section className="dash-card">
            <div className="dash-card__head">
              <h2 className="dash-card__title">Recent payments</h2>
              <span className="dash-count">{payments.length}</span>
            </div>
            <ul className="billing-payment-list">
              {payments.map((p) => (
                <li key={p.id} className="billing-payment">
                  <div className="billing-payment__main">
                    <span className="billing-payment__amount">
                      {formatMoney(p.amount, p.currency) || '—'}
                    </span>
                    <span className={`dash-badge ${STATUS_TONE[p.status] || 'is-warn'}`}>
                      {prettyStatus(p.status)}
                    </span>
                  </div>
                  <p className="billing-payment__meta">
                    {[
                      formatDate(p.paymentDate),
                      p.paymentMethod ? prettyStatus(p.paymentMethod) : null,
                    ]
                      .filter(Boolean)
                      .join(' · ') || 'Recorded payment'}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="dash-card">
          <div className="dash-card__head">
            <h2 className="dash-card__title">Actions</h2>
          </div>
          <div className="member-soft-actions">
            <a href={SALES_MAILTO} className="dash-link-btn">
              Contact Sales
            </a>
            <a href={BUY_CREDITS_MAILTO} className="dash-link-btn dash-link-btn--ghost">
              Buy Credits
              <span className="dash-badge is-soon">Coming soon</span>
            </a>
          </div>
          <p className="dash-hint" style={{ marginTop: 12 }}>
            Estimated cost at checkout and self-serve credit packs are coming soon.
          </p>
        </section>
      </div>
    </MemberShell>
  );
}
