'use client';

import React from 'react';

const STATUS_TONE = {
  active: 'is-good',
  trialing: 'is-good',
  pending: 'is-warn',
  past_due: 'is-warn',
  paused: 'is-warn',
  cancelled: 'is-bad',
  expired: 'is-bad',
};

const prettyStatus = (s) =>
  s ? s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Unknown';

const prettyCycle = (s) =>
  s ? s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : null;

const prettyFeatureKey = (key) =>
  String(key || '')
    .replace(/[._]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

const formatMoney = (price, currency) => {
  if (price == null) return null;
  try {
    return price.toLocaleString(undefined, {
      style: 'currency',
      currency: (currency || 'usd').toUpperCase(),
    });
  } catch {
    return `${price} ${(currency || '').toUpperCase()}`;
  }
};

const formatDate = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const findLimit = (limits, field) => limits.find((l) => l.field === field) || null;

const limitProgressPct = (limit) => {
  if (!limit || limit.unlimited || typeof limit.limit !== 'number' || limit.limit <= 0) return null;
  if (typeof limit.used !== 'number') return null;
  return Math.min(100, Math.round((limit.used / limit.limit) * 100));
};

const limitStatusClass = (status) => {
  if (status === 'warning') return 'is-warn';
  if (status === 'reached' || status === 'exceeded') return 'is-bad';
  return '';
};

const formatUsedMax = (limit) => {
  if (!limit) return '—';
  if (limit.unlimited) {
    return typeof limit.used === 'number' ? `${limit.used.toLocaleString()} / Unlimited` : 'Unlimited';
  }
  if (typeof limit.limit !== 'number') return '—';
  if (typeof limit.used === 'number') {
    return `${limit.used.toLocaleString()} / ${limit.limit.toLocaleString()}`;
  }
  return `— / ${limit.limit.toLocaleString()}`;
};

const initials = (m) =>
  `${(m?.firstName || '')[0] || ''}${(m?.lastName || '')[0] || ''}`.toUpperCase() ||
  (m?.email || '?')[0].toUpperCase();

const Dashboard = () => {
  const [state, setState] = React.useState({ loading: true, error: '', data: null });
  const [signingOut, setSigningOut] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/dashboard', { cache: 'no-store' });
        if (res.status === 401) {
          window.location.assign('/login?next=/dashboard');
          return;
        }
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Unable to load your dashboard.');
        if (active) setState({ loading: false, error: '', data });
      } catch (err) {
        if (active) setState({ loading: false, error: err.message || 'Something went wrong.', data: null });
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const signOut = async () => {
    setSigningOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore; redirect regardless
    }
    window.location.assign('/login');
  };

  if (state.loading) {
    return (
      <div className="dash-loading" aria-busy="true">
        <div className="dash-skeleton dash-skeleton--head" />
        <div className="dash-skeleton" />
        <div className="dash-skeleton" />
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="dash-error" role="alert">
        <p>{state.error}</p>
        <button type="button" className="signup-submit signup-submit--inline" onClick={() => window.location.reload()}>
          Try again
        </button>
      </div>
    );
  }

  const {
    member,
    subscriptions = [],
    subAccounts = [],
    credits = null,
    entitlements = null,
  } = state.data || {};

  const wallet = entitlements?.credits || null;
  const balance =
    wallet?.balance != null ? wallet.balance : credits?.balance != null ? credits.balance : null;
  const allocation =
    wallet?.allocation != null
      ? wallet.allocation
      : credits?.allocation != null
        ? credits.allocation
        : null;
  const totalDeducted = credits?.totalDeducted || 0;
  const hasCredits =
    balance != null || totalDeducted > 0 || (credits?.bySubAccount || []).length > 0;
  const modules = entitlements?.modules || [];
  const limits = entitlements?.limits || [];
  const cappedLimits = limits.filter((l) => !l.unlimited && typeof l.limit === 'number');
  const seatsLimit = findLimit(limits, 'maxTeamMembers');
  const workspacesLimit = findLimit(limits, 'maxWorkspaces');
  const primarySub = subscriptions[0] || null;
  const ownerName =
    `${member?.firstName || ''} ${member?.lastName || ''}`.trim() || member?.email || 'Owner';
  const ownerStatusTone =
    member?.status === 'Active' ? 'is-good' : member?.status === 'Suspended' ? 'is-bad' : 'is-warn';
  const byFeature = credits?.byFeature || [];
  const featureTotal = byFeature.reduce((sum, f) => sum + (f.deducted || 0), 0) || totalDeducted || 1;

  return (
    <div className="dash">
      <header className="dash-top">
        <div className="dash-identity">
          <span className="dash-avatar" aria-hidden="true">{initials(member)}</span>
          <div>
            <p className="dash-hello">
              {member?.firstName ? `Hi, ${member.firstName}` : 'Welcome'}
            </p>
          </div>
        </div>
        <div className="dash-top__actions">
          <a href="/dashboard/ledger" className="dash-go-app dash-go-app--ghost">
            Credit ledger
          </a>
          <button type="button" className="dash-go-app" title="Coming soon" onClick={() => {}}>
            Go to app
          </button>
          <button type="button" className="dash-signout" onClick={signOut} disabled={signingOut}>
            {signingOut ? 'Signing out\u2026' : 'Sign out'}
          </button>
        </div>
      </header>

      <section className="dash-card">
        <div className="dash-card__head">
          <h2 className="dash-card__title">Account owner</h2>
          {member?.status ? (
            <span className={'dash-badge ' + ownerStatusTone}>{member.status}</span>
          ) : null}
        </div>
        <div className="dash-owner">
          <div className="dash-owner__identity">
            <div>
              <p className="dash-owner__name">{ownerName}</p>
              <p className="dash-owner__role">Organization owner</p>
            </div>
          </div>
          <dl className="dash-owner__grid">
            <div>
              <dt>Email</dt>
              <dd className="mono">{member?.email || '—'}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{member?.phone || '—'}</dd>
            </div>
            <div>
              <dt>Account name</dt>
              <dd>{member?.accountName || '—'}</dd>
            </div>
            <div>
              <dt>Company</dt>
              <dd>{member?.companyName || '—'}</dd>
            </div>
            <div>
              <dt>Team size</dt>
              <dd>
                {1 + subAccounts.length}{' '}
                {1 + subAccounts.length === 1 ? 'person' : 'people'}
                {subAccounts.length > 0
                  ? ` · ${subAccounts.length} sub-account${subAccounts.length === 1 ? '' : 's'}`
                  : ''}
              </dd>
            </div>
            <div>
              <dt>Credits available</dt>
              <dd>
                {balance != null ? balance.toLocaleString() : '—'}
                {allocation != null ? ` / ${allocation.toLocaleString()}` : ''}
              </dd>
            </div>
          </dl>
        </div>
      </section>

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
                const money = formatMoney(sub.price, sub.currency);
                const tone = STATUS_TONE[sub.status] || 'is-warn';
                const serviceName =
                  sub.servicePlanName || entitlements?.servicePlan?.name || null;
                return (
                  <li key={sub.id} className="dash-sub">
                    <div className="dash-sub__main">
                      <span className="dash-sub__plan">{sub.planName}</span>
                      <span className={'dash-badge ' + tone}>{prettyStatus(sub.status)}</span>
                    </div>
                    <div className="dash-sub__meta">
                      {serviceName && <span>Service plan: {serviceName}</span>}
                      {money && (
                        <span>
                          {money}
                          {sub.billingCycle && sub.billingCycle !== 'one_time'
                            ? ` / ${sub.billingCycle.replace('ly', '')}`
                            : ''}
                        </span>
                      )}
                      <span>Payment: {prettyStatus(sub.paymentStatus)}</span>
                      {formatDate(sub.startDate) && (
                        <span>Started: {formatDate(sub.startDate)}</span>
                      )}
                      {formatDate(sub.nextBillingDate) && (
                        <span>Next billing: {formatDate(sub.nextBillingDate)}</span>
                      )}
                      {(sub.creditResetCycle || wallet?.resetCycle) && (
                        <span>
                          Reset: {prettyCycle(sub.creditResetCycle || wallet?.resetCycle)}
                          {formatDate(sub.nextCreditResetAt || wallet?.nextResetAt)
                            ? ` · next ${formatDate(sub.nextCreditResetAt || wallet?.nextResetAt)}`
                            : ''}
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="dash-summary">
              <div className="dash-summary__item">
                <span className="dash-summary__label">Monthly credits</span>
                <span className="dash-summary__value">
                  {allocation != null ? allocation.toLocaleString() : '—'}
                </span>
              </div>
              <div className="dash-summary__item">
                <span className="dash-summary__label">Credits left</span>
                <span className="dash-summary__value">
                  {balance != null ? balance.toLocaleString() : '—'}
                </span>
              </div>
              <div className="dash-summary__item">
                <span className="dash-summary__label">Seats</span>
                <span className="dash-summary__value">{formatUsedMax(seatsLimit)}</span>
                <span className="dash-summary__hint">
                  {1 + subAccounts.length} on account now
                </span>
              </div>
              <div className="dash-summary__item">
                <span className="dash-summary__label">Workspaces</span>
                <span className="dash-summary__value">{formatUsedMax(workspacesLimit)}</span>
              </div>
              <div className="dash-summary__item">
                <span className="dash-summary__label">Active modules</span>
                <span className="dash-summary__value">{modules.length}</span>
              </div>
              <div className="dash-summary__item">
                <span className="dash-summary__label">Billing cycle</span>
                <span className="dash-summary__value">
                  {prettyCycle(primarySub?.billingCycle) || '—'}
                </span>
                {formatDate(primarySub?.nextBillingDate) ? (
                  <span className="dash-summary__hint">
                    Renews {formatDate(primarySub.nextBillingDate)}
                  </span>
                ) : null}
              </div>
            </div>
          </>
        )}
      </section>

      <section className={'dash-card' + (modules.length ? '' : ' dash-card--muted')}>
        <div className="dash-card__head">
          <h2 className="dash-card__title">Modules</h2>
          <span className="dash-count">{modules.length}</span>
        </div>
        {modules.length === 0 ? (
          <p className="dash-empty">Modules will appear once your plan is assigned.</p>
        ) : (
          <ul className="dash-module-grid">
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
        )}
      </section>

      <section className={'dash-card' + (cappedLimits.length ? '' : ' dash-card--muted')}>
        <div className="dash-card__head">
          <h2 className="dash-card__title">Limits</h2>
          <span className="dash-count">{cappedLimits.length}</span>
        </div>
        {cappedLimits.length === 0 ? (
          <p className="dash-empty">
            No numeric caps on this plan, or usage has not been synced from the product yet.
          </p>
        ) : (
          <ul className="dash-limits">
            {cappedLimits.map((limit) => {
              const pct = limitProgressPct(limit);
              const statusClass = limitStatusClass(limit.status);
              return (
                <li key={limit.field || limit.label} className={`dash-limit ${statusClass}`.trim()}>
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
                    <span>{limit.status || 'normal'}</span>
                    {typeof limit.remaining === 'number' ? (
                      <span>{limit.remaining.toLocaleString()} remaining</span>
                    ) : (
                      <span>Usage pending sync</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="dash-card">
        <div className="dash-card__head">
          <h2 className="dash-card__title">Sub-accounts</h2>
          <span className="dash-count">{subAccounts.length}</span>
        </div>
        {subAccounts.length === 0 ? (
          <p className="dash-empty">No sub-accounts yet. Invites will appear here once you add teammates.</p>
        ) : (
          <ul className="dash-account-list">
            {subAccounts.map((acc) => {
              const name = `${acc.firstName} ${acc.lastName}`.trim() || acc.email;
              const tone =
                acc.status === 'Active' ? 'is-good' : acc.status === 'Disabled' ? 'is-bad' : 'is-warn';
              return (
                <li key={acc.id} className="dash-account">
                  <span className="dash-account__avatar" aria-hidden="true">
                    {(name[0] || '?').toUpperCase()}
                  </span>
                  <div className="dash-account__info">
                    <span className="dash-account__name">{name}</span>
                    <span className="dash-account__email mono">{acc.email}</span>
                  </div>
                  <span className={'dash-badge ' + tone}>{acc.status || 'Pending'}</span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className={'dash-card' + (hasCredits ? '' : ' dash-card--muted')}>
        <div className="dash-card__head">
          <h2 className="dash-card__title">Credits & usage</h2>
        </div>
        {!hasCredits ? (
          <p className="dash-empty">Usage and credit tracking will show up here once your team starts using credits.</p>
        ) : (
          <>
            <div className="dash-credit-cards">
              <div className="dash-credit-card">
                <span className="dash-credit-card__label">Current balance</span>
                <span className="dash-credit-card__value">
                  {balance != null ? balance.toLocaleString() : '—'}
                </span>
              </div>
              <div className="dash-credit-card">
                <span className="dash-credit-card__label">Monthly allocation</span>
                <span className="dash-credit-card__value">
                  {allocation != null ? allocation.toLocaleString() : '—'}
                </span>
              </div>
              <div className="dash-credit-card">
                <span className="dash-credit-card__label">Used this cycle</span>
                <span className="dash-credit-card__value">{totalDeducted.toLocaleString()}</span>
              </div>
            </div>

            <h3 className="dash-section-label">By user</h3>
            <ul className="dash-usage-list">
              <li className="dash-usage">
                <span className="dash-usage__name">
                  {ownerName}
                  <span className="dash-usage__tag">Owner</span>
                </span>
                <span className="dash-usage__val">{credits?.owner?.deducted || 0}</span>
              </li>
              {(credits?.bySubAccount || []).map((u) => (
                <li key={u.subAccountId} className="dash-usage">
                  <div className="dash-usage__info">
                    <span className="dash-usage__name">{u.name}</span>
                    {u.email && <span className="dash-usage__email mono">{u.email}</span>}
                  </div>
                  <span className="dash-usage__val">{u.deducted}</span>
                </li>
              ))}
            </ul>

            {byFeature.length > 0 ? (
              <>
                <h3 className="dash-section-label">By service</h3>
                <ul className="dash-feature-list">
                  {byFeature.slice(0, 8).map((f) => {
                    const pct = Math.round(((f.deducted || 0) / featureTotal) * 100);
                    return (
                      <li key={f.key} className="dash-feature">
                        <div className="dash-feature__head">
                          <span>{prettyFeatureKey(f.key)}</span>
                          <strong>{f.deducted.toLocaleString()}</strong>
                        </div>
                        <div className="dash-feature__bar" aria-hidden="true">
                          <span style={{ width: `${pct}%` }} />
                        </div>
                        <span className="dash-feature__pct">{pct}% of usage</span>
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : null}
          </>
        )}
        <div className="dash-card__foot">
          <a href="/dashboard/ledger" className="dash-link-btn">
            View credit ledger
          </a>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
