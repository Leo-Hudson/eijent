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

  const { member, subscriptions = [], subAccounts = [] } = state.data || {};

  return (
    <div className="dash">
      <header className="dash-top">
        <div className="dash-identity">
          <span className="dash-avatar" aria-hidden="true">{initials(member)}</span>
          <div>
            <p className="dash-hello">
              {member?.firstName ? `Hi, ${member.firstName}` : 'Welcome'}
            </p>
            {member?.companyName && <p className="dash-company">{member.companyName}</p>}
          </div>
        </div>
        <button type="button" className="dash-signout" onClick={signOut} disabled={signingOut}>
          {signingOut ? 'Signing out\u2026' : 'Sign out'}
        </button>
      </header>

      <section className="dash-card">
        <div className="dash-card__head">
          <h2 className="dash-card__title">Subscription</h2>
        </div>
        {subscriptions.length === 0 ? (
          <p className="dash-empty">No active plan yet.</p>
        ) : (
          <ul className="dash-sub-list">
            {subscriptions.map((sub) => {
              const money = formatMoney(sub.price, sub.currency);
              const tone = STATUS_TONE[sub.status] || 'is-warn';
              return (
                <li key={sub.id} className="dash-sub">
                  <div className="dash-sub__main">
                    <span className="dash-sub__plan">{sub.planName}</span>
                    <span className={'dash-badge ' + tone}>{prettyStatus(sub.status)}</span>
                  </div>
                  <div className="dash-sub__meta">
                    {money && (
                      <span>
                        {money}
                        {sub.billingCycle && sub.billingCycle !== 'one_time'
                          ? ` / ${sub.billingCycle.replace('ly', '')}`
                          : ''}
                      </span>
                    )}
                    <span>Payment: {prettyStatus(sub.paymentStatus)}</span>
                    {formatDate(sub.nextBillingDate) && (
                      <span>Next billing: {formatDate(sub.nextBillingDate)}</span>
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

      <section className="dash-card dash-card--muted">
        <div className="dash-card__head">
          <h2 className="dash-card__title">Credit usage</h2>
          <span className="dash-badge is-soon">Coming soon</span>
        </div>
        <p className="dash-empty">Usage and credit tracking will show up here in a future update.</p>
      </section>
    </div>
  );
};

export default Dashboard;
