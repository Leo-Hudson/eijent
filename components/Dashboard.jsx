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

const formatLimitCap = (row) => {
  if (!row) return 'Included';
  if (row.unlimited) return 'Unlimited';
  if (typeof row.limit === 'number') return row.limit.toLocaleString();
  return 'Included';
};

/**
 * Build table rows: each enabled module + its limit(s), plus standalone
 * limits that are not tied to a module (e.g. team members).
 */
const buildModuleLimitRows = (modules, limits) => {
  const rows = [];
  const usedLimitKeys = new Set();

  for (const mod of modules) {
    const matched = limits.filter((l) => l.module === mod);
    if (matched.length === 0) {
      rows.push({
        key: mod,
        module: mod,
        limitLabel: null,
        cap: 'Included',
      });
      continue;
    }
    matched.forEach((limit, idx) => {
      const key = limit.field || `${mod}-${idx}`;
      usedLimitKeys.add(key);
      rows.push({
        key,
        module: mod,
        limitLabel: limit.label || null,
        cap: formatLimitCap(limit),
      });
    });
  }

  for (const limit of limits) {
    const key = limit.field || limit.label;
    if (usedLimitKeys.has(key)) continue;
    if (limit.module && modules.includes(limit.module)) continue;
    rows.push({
      key,
      module: limit.module || limit.label || 'Plan limit',
      limitLabel: limit.module ? limit.label : null,
      cap: formatLimitCap(limit),
    });
  }

  return rows;
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
  const hasCredits =
    balance != null ||
    (credits && (credits.totalDeducted > 0 || credits.bySubAccount?.length));
  const modules = entitlements?.modules || [];
  const limits = entitlements?.limits || [];
  const moduleLimitRows = buildModuleLimitRows(modules, limits);

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
        <div className="dash-top__actions">
          <button
            type="button"
            className="dash-go-app"
            title="Coming soon"
            onClick={() => {}}
          >
            Go to app
          </button>
          <button type="button" className="dash-signout" onClick={signOut} disabled={signingOut}>
            {signingOut ? 'Signing out\u2026' : 'Sign out'}
          </button>
        </div>
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
                    {(sub.creditBalance != null || balance != null) && (
                      <span>
                        Credits:{' '}
                        {(sub.creditBalance != null ? sub.creditBalance : balance).toLocaleString()}
                        {(sub.creditAllocation != null || allocation != null)
                          ? ` / ${(sub.creditAllocation != null ? sub.creditAllocation : allocation).toLocaleString()}`
                          : ''}
                      </span>
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
        )}
      </section>

      <section className={'dash-card' + (moduleLimitRows.length ? '' : ' dash-card--muted')}>
        <div className="dash-card__head">
          <h2 className="dash-card__title">Included modules</h2>
          <span className="dash-count">{modules.length}</span>
        </div>
        {moduleLimitRows.length === 0 ? (
          <p className="dash-empty">Module details will appear once your plan is assigned.</p>
        ) : (
          <div className="dash-modules-table-wrap">
            <table className="dash-modules-table">
              <thead>
                <tr>
                  <th>Module</th>
                  <th>Limit</th>
                  <th>Max</th>
                </tr>
              </thead>
              <tbody>
                {moduleLimitRows.map((row) => (
                  <tr key={row.key}>
                    <td>{row.module}</td>
                    <td className="dash-modules-table__limit">
                      {row.limitLabel || (row.cap === 'Included' ? 'Access' : 'Usage cap')}
                    </td>
                    <td className="dash-modules-table__max">{row.cap}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
          <h2 className="dash-card__title">Credit usage</h2>
          {hasCredits && balance != null && (
            <span className="dash-count">
              {balance.toLocaleString()}
              {allocation != null ? ` / ${allocation.toLocaleString()}` : ''} left
            </span>
          )}
        </div>
        {!hasCredits ? (
          <p className="dash-empty">Usage and credit tracking will show up here once your team starts using credits.</p>
        ) : (
          <>
            <p className="dash-credit-total">
              {credits?.totalDeducted || 0} credit
              {(credits?.totalDeducted || 0) === 1 ? '' : 's'} used
            </p>
            <ul className="dash-usage-list">
              <li className="dash-usage">
                <span className="dash-usage__name">You (owner)</span>
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
