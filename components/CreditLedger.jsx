'use client';

import React from 'react';
import { format, parseISO, isValid } from 'date-fns';
import LedgerSelect from '@/components/ledger/LedgerSelect';
import LedgerDateField from '@/components/ledger/LedgerDateField';
import { ledgerTypeLabel, prettyServiceLabel } from '@/lib/memberDisplay';

const TYPE_OPTIONS = [
  { value: '', label: 'All types' },
  { value: 'reset', label: 'Allocation' },
  { value: 'grant', label: 'Manual / Purchased' },
  { value: 'deduct', label: 'Usage' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'largest_debit', label: 'Largest consumption' },
  { value: 'largest_credit', label: 'Largest credit addition' },
];

const DIRECTION_OPTIONS = [
  { value: '', label: 'All directions' },
  { value: 'credit', label: 'Additions only' },
  { value: 'debit', label: 'Consumption only' },
];

const INITIAL_FILTERS = {
  from: '',
  to: '',
  type: '',
  featureKey: '',
  userKey: '',
  direction: '',
  q: '',
  sort: 'newest',
};

/** Compact single-line date for the table (avoids locale wrapping). */
const formatDateTime = (iso) => {
  if (!iso) return null;
  try {
    const d = typeof iso === 'string' ? parseISO(iso) : new Date(iso);
    if (!isValid(d)) return null;
    return {
      date: format(d, 'MMM d, yyyy'),
      time: format(d, 'h:mm a'),
      full: format(d, 'MMM d, yyyy · h:mm a'),
    };
  } catch {
    return null;
  }
};

const formatCredits = (amount) => {
  const n = Number(amount) || 0;
  const abs = Math.abs(n).toLocaleString();
  if (n > 0) return `+${abs}`;
  if (n < 0) return `−${abs}`;
  return '0';
};

const summarizeDocs = (docs) => {
  let totalCredited = 0;
  let totalDeducted = 0;
  let packagePurchases = 0;
  for (const row of docs || []) {
    const amount = Number(row.amount) || 0;
    if (amount > 0) totalCredited += amount;
    if (amount < 0) totalDeducted += Math.abs(amount);
    if (String(row.featureKey || '').startsWith('credit_package:')) {
      packagePurchases += 1;
    }
  }
  return {
    totalCredited,
    totalDeducted,
    packagePurchases,
    transactionCount: (docs || []).length,
    net: totalCredited - totalDeducted,
  };
};

/** Local calendar day → ISO bounds without UTC midnight skew. */
const dayStartIso = (yyyyMmDd) => {
  const [y, m, d] = yyyyMmDd.split('-').map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0).toISOString();
};

const dayEndIso = (yyyyMmDd) => {
  const [y, m, d] = yyyyMmDd.split('-').map(Number);
  return new Date(y, m - 1, d, 23, 59, 59, 999).toISOString();
};

/**
 * Resolve sub-account display from current or legacy Core ledger rows.
 * Newer Core returns `subAccount` + `attributedToOwner`; older Core only has `user`.
 * Pass `ownerId` (member id) so legacy owner-attributed rows can be labeled.
 */
const resolveSubAccount = (row, ownerId) => {
  if (row?.subAccount && typeof row.subAccount === 'object') {
    return {
      name: row.subAccount.name || 'Sub-account',
      email: row.subAccount.email || null,
      isOwner: false,
    };
  }
  if (row?.attributedToOwner === true) {
    return {
      name: row.user?.name || 'Owner',
      email: row.user?.email || null,
      isOwner: true,
    };
  }
  if (row?.attributedToOwner === false && row?.user) {
    return {
      name: row.user.name || 'Sub-account',
      email: row.user.email || null,
      isOwner: false,
    };
  }
  if (row?.user?.name || row?.user?.email) {
    const isOwner =
      ownerId && row.user?.id != null
        ? String(row.user.id) === String(ownerId)
        : undefined;
    return {
      name: row.user.name || '-',
      email: row.user.email || null,
      isOwner,
    };
  }
  return null;
};

/** Display label from Core workspace attribution (object or flat fields). */
const resolveWorkspaceLabel = (row) => {
  if (row?.workspace && typeof row.workspace === 'object') {
    return row.workspace.name || row.workspace.id || null;
  }
  return row?.workspaceName || row?.workspaceId || null;
};

const PAGE_SIZE_OPTIONS = [
  { value: '8', label: '8' },
  { value: '16', label: '16' },
  { value: '24', label: '24' },
  { value: '50', label: '50' },
];

function CopyTextButton({ text, label = 'Copy' }) {
  const [copied, setCopied] = React.useState(false);
  if (!text) return null;
  return (
    <button
      type="button"
      className="ledger-copy-btn"
      onClick={async (e) => {
        e.stopPropagation();
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1200);
        } catch {
          // ignore
        }
      }}
    >
      {copied ? 'Copied' : label}
    </button>
  );
}

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.4" />
    <path
      d="M8 7.25v4"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <circle cx="8" cy="5.1" r="0.85" fill="currentColor" />
  </svg>
);

const buildLedgerParams = (applied, page, limit = 8) => {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('limit', String(limit));
  params.set('sort', applied.sort || 'newest');
  if (applied.from) params.set('from', dayStartIso(applied.from));
  if (applied.to) params.set('to', dayEndIso(applied.to));
  if (applied.type) params.set('type', applied.type);
  if (applied.featureKey) params.set('featureKey', applied.featureKey);
  if (applied.direction) params.set('direction', applied.direction);
  if (applied.q.trim()) params.set('q', applied.q.trim());
  if (applied.userKey === 'owner') params.set('ownerOnly', '1');
  else if (applied.userKey) params.set('subAccountId', String(applied.userKey));
  return params;
};

const buildUsersFromProps = (member, subAccounts) => {
  if (!member && !subAccounts?.length) return { ownerId: null, users: [] };
  const ownerName =
    [member?.firstName, member?.lastName].filter(Boolean).join(' ').trim() ||
    member?.email ||
    'You (owner)';
  return {
    ownerId: member?.id ? String(member.id) : null,
    users: [
      { key: 'owner', label: `${ownerName} (owner)` },
      ...(subAccounts || []).map((a) => ({
        key: String(a.id),
        label: `${a.firstName || ''} ${a.lastName || ''}`.trim() || a.email || 'Sub-account',
      })),
    ],
  };
};

const CreditLedger = ({
  embedded = false,
  member: memberProp = null,
  subAccounts: subAccountsProp = null,
}) => {
  const readInitialFilters = () => {
    if (typeof window === 'undefined') return INITIAL_FILTERS;
    const params = new URLSearchParams(window.location.search);
    const user = params.get('user') || params.get('subAccountId') || '';
    if (!user) return INITIAL_FILTERS;
    return { ...INITIAL_FILTERS, userKey: String(user) };
  };

  const seeded = React.useMemo(
    () => buildUsersFromProps(memberProp, subAccountsProp),
    [memberProp, subAccountsProp],
  );
  const hasSeededUsers = Boolean(memberProp || (subAccountsProp && subAccountsProp.length));

  const [filters, setFilters] = React.useState(readInitialFilters);
  const [applied, setApplied] = React.useState(readInitialFilters);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(8);
  const [expandedId, setExpandedId] = React.useState(null);
  const [users, setUsers] = React.useState(() => seeded.users);
  const [ownerId, setOwnerId] = React.useState(() => seeded.ownerId);
  const [exporting, setExporting] = React.useState(false);
  const [showMoreFilters, setShowMoreFilters] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return Boolean(params.get('user') || params.get('subAccountId'));
  });
  const [state, setState] = React.useState({
    loading: true,
    error: '',
    docs: [],
    totalDocs: 0,
    totalPages: 1,
    currentBalance: null,
    allocation: null,
    summary: null,
    featureOptions: [],
  });

  React.useEffect(() => {
    if (hasSeededUsers) {
      setOwnerId(seeded.ownerId);
      setUsers(seeded.users);
      return undefined;
    }

    // Standalone / legacy: only fetch dashboard when parent did not pass team data.
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/dashboard', { cache: 'no-store' });
        if (res.status === 401) {
          window.location.assign('/login?next=/dashboard/credits');
          return;
        }
        const data = await res.json().catch(() => ({}));
        if (!active || !res.ok) return;
        const next = buildUsersFromProps(data.member, data.subAccounts);
        setOwnerId(next.ownerId);
        setUsers(next.users);
      } catch {
        // filter users optional
      }
    })();
    return () => {
      active = false;
    };
  }, [hasSeededUsers, seeded]);

  React.useEffect(() => {
    const controller = new AbortController();

    (async () => {
      setState((prev) => ({ ...prev, loading: true, error: '' }));
      try {
        const params = buildLedgerParams(applied, page, pageSize);
        const res = await fetch(`/api/credits/ledger?${params}`, {
          cache: 'no-store',
          signal: controller.signal,
        });
        if (res.status === 401) {
          window.location.assign('/login?next=/dashboard/credits');
          return;
        }
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Unable to load credit ledger.');
        if (controller.signal.aborted) return;

        // Prefer Core SQL summary; fall back to current page only (no multi-page fan-out).
        let summary =
          data.summary && typeof data.summary === 'object' ? data.summary : null;
        if (
          (!summary ||
            (summary.transactionCount === 0 &&
              (data.totalDocs || 0) > 0 &&
              Array.isArray(data.docs) &&
              data.docs.length > 0)) &&
          Array.isArray(data.docs) &&
          data.docs.length > 0
        ) {
          summary = summarizeDocs(data.docs);
        }

        setState({
          loading: false,
          error: '',
          docs: Array.isArray(data.docs) ? data.docs : [],
          totalDocs: data.totalDocs || 0,
          totalPages: data.totalPages || 1,
          currentBalance: typeof data.currentBalance === 'number' ? data.currentBalance : null,
          allocation: typeof data.allocation === 'number' ? data.allocation : null,
          summary,
          featureOptions: Array.isArray(data.featureOptions) ? data.featureOptions : [],
        });
      } catch (err) {
        if (err?.name === 'AbortError') return;
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err.message || 'Unable to load credit ledger.',
          docs: [],
          totalDocs: 0,
          totalPages: 1,
          summary: null,
        }));
      }
    })();

    return () => controller.abort();
  }, [applied, page, pageSize]);

  React.useEffect(() => {
    setExpandedId(null);
  }, [applied, page, pageSize]);

  const chips = React.useMemo(() => {
    const list = [];
    if (applied.from) list.push({ key: 'from', label: `From ${applied.from}` });
    if (applied.to) list.push({ key: 'to', label: `To ${applied.to}` });
    if (applied.type) {
      const opt = TYPE_OPTIONS.find((o) => o.value === applied.type);
      list.push({ key: 'type', label: opt?.label || applied.type });
    }
    if (applied.featureKey) {
      list.push({
        key: 'featureKey',
        label: `Service: ${prettyServiceLabel(applied.featureKey)}`,
      });
    }
    if (applied.userKey) {
      const u = users.find((x) => x.key === applied.userKey);
      list.push({ key: 'userKey', label: `Sub-account: ${u?.label || applied.userKey}` });
    }
    if (applied.direction) {
      const opt = DIRECTION_OPTIONS.find((o) => o.value === applied.direction);
      list.push({ key: 'direction', label: opt?.label || applied.direction });
    }
    if (applied.q.trim()) list.push({ key: 'q', label: `Search: ${applied.q.trim()}` });
    if (applied.sort && applied.sort !== 'newest') {
      const opt = SORT_OPTIONS.find((o) => o.value === applied.sort);
      list.push({ key: 'sort', label: opt?.label || applied.sort });
    }
    return list;
  }, [applied, users]);

  const serviceOptions = React.useMemo(
    () => [
      { value: '', label: 'All services' },
      ...state.featureOptions.map((key) => ({
        value: key,
        label: prettyServiceLabel(key),
      })),
    ],
    [state.featureOptions],
  );

  const subAccountOptions = React.useMemo(
    () => [
      { value: '', label: 'All sub-accounts' },
      ...users.map((u) => ({ value: u.key, label: u.label })),
    ],
    [users],
  );

  const applyFilters = (e) => {
    e?.preventDefault?.();
    setPage(1);
    setApplied({ ...filters });
  };

  const clearFilters = () => {
    setFilters(INITIAL_FILTERS);
    setApplied(INITIAL_FILTERS);
    setPage(1);
  };

  const removeChip = (key) => {
    const next = {
      ...applied,
      [key]: key === 'sort' ? 'newest' : '',
    };
    setFilters(next);
    setApplied(next);
    setPage(1);
  };

  const exportCsv = async () => {
    setExporting(true);
    try {
      // One browser request; server paginates Core and returns the CSV.
      const params = buildLedgerParams(applied, 1, 100);
      params.delete('page');
      params.delete('limit');
      const res = await fetch(`/api/credits/ledger/export?${params}`, {
        cache: 'no-store',
      });
      if (res.status === 401) {
        window.location.assign('/login?next=/dashboard/credits');
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Export failed.');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `eijent-credit-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  const extrasAboveGrant =
    typeof state.currentBalance === 'number' &&
    typeof state.allocation === 'number' &&
    state.currentBalance > state.allocation
      ? state.currentBalance - state.allocation
      : null;

  const renderRowCards = () =>
    state.docs.map((row) => {
      const amt = Number(row.amount) || 0;
      const when = formatDateTime(row.createdAt);
      const sub = resolveSubAccount(row, ownerId);
      const workspaceLabel = resolveWorkspaceLabel(row);
      const txnId = row.id ? String(row.id) : '';
      const desc = row.description || '';
      const hasDetails = Boolean(txnId || desc);
      const open = expandedId === row.id;
      return (
        <article key={row.id} className={`ledger-card${open ? ' is-expanded' : ''}`}>
          <div className="ledger-card__top">
            <div>
              <span className="ledger-card__type">{ledgerTypeLabel(row)}</span>
              <span className="ledger-card__when">{when?.full || '—'}</span>
            </div>
            <div className="ledger-card__top-end">
              <span className={amt > 0 ? 'is-credit' : amt < 0 ? 'is-debit' : ''}>
                {formatCredits(amt)}
              </span>
              {hasDetails ? (
                <button
                  type="button"
                  className={`ledger-details-btn${open ? ' is-open' : ''}`}
                  aria-expanded={open}
                  aria-label={open ? 'Hide details' : 'Show details'}
                  title={open ? 'Hide details' : 'Show details'}
                  onClick={() => setExpandedId((id) => (id === row.id ? null : row.id))}
                >
                  <InfoIcon />
                </button>
              ) : null}
            </div>
          </div>
          <dl className="ledger-card__meta">
            <div>
              <dt>Service</dt>
              <dd>{prettyServiceLabel(row.service) || '—'}</dd>
            </div>
            <div>
              <dt>Who</dt>
              <dd>
                {sub
                  ? `${sub.name}${sub.isOwner ? ' (owner)' : ''}`
                  : '—'}
              </dd>
            </div>
            <div>
              <dt>Workspace</dt>
              <dd>{workspaceLabel || '—'}</dd>
            </div>
            <div>
              <dt>Balance after</dt>
              <dd>
                {typeof row.balanceAfter === 'number'
                  ? row.balanceAfter.toLocaleString()
                  : '—'}
              </dd>
            </div>
          </dl>
          {open && hasDetails ? (
            <div className="ledger-detail ledger-detail--card">
              {txnId ? (
                <div className="ledger-detail__block">
                  <span className="ledger-detail__label">
                    Reference
                    <span className="ledger-detail__hint">Transaction ID</span>
                  </span>
                  <div className="ledger-detail__ref">
                    <code className="mono">{txnId}</code>
                    <CopyTextButton text={txnId} />
                  </div>
                </div>
              ) : null}
              {desc ? (
                <div className="ledger-detail__block">
                  <span className="ledger-detail__label">Description</span>
                  <p className="ledger-detail__text">{desc}</p>
                </div>
              ) : null}
            </div>
          ) : null}
        </article>
      );
    });

  return (
    <div className={`ledger${embedded ? ' ledger--embedded' : ''}`}>
      {!embedded ? (
        <header className="ledger-top">
          <div>
            <a href="/dashboard" className="ledger-back">
              ← Dashboard
            </a>
            <h1 className="ledger-title">Credit ledger</h1>
            <p className="ledger-sub">
              History of credit movements. Available is what you can spend now; plan grant is
              your cycle allocation (top-ups can raise available above the grant).
            </p>
          </div>
          <div className="ledger-top__actions">
            {state.currentBalance != null && (
              <span className="ledger-balance">
                Available: <strong>{state.currentBalance.toLocaleString()}</strong>
              </span>
            )}
            <button
              type="button"
              className="dash-link-btn dash-link-btn--ghost"
              onClick={() => exportCsv().catch((err) => alert(err.message || 'Export failed'))}
              disabled={state.loading || exporting || state.totalDocs === 0}
            >
              {exporting ? 'Exporting…' : 'Export CSV'}
            </button>
          </div>
        </header>
      ) : (
        <div className="ledger-embedded-head">
          <div>
            <h2 className="dash-card__title" style={{ margin: 0 }}>Ledger</h2>
            <p className="section-page-sub">
              Full movement history with filters, sort, and CSV export.
            </p>
          </div>
          <button
            type="button"
            className="dash-link-btn dash-link-btn--ghost"
            onClick={() => exportCsv().catch((err) => alert(err.message || 'Export failed'))}
            disabled={state.loading || exporting || state.totalDocs === 0}
          >
            {exporting ? 'Exporting…' : 'Export CSV'}
          </button>
        </div>
      )}

      <div className="ledger-kpis" aria-label="Credit summary">
        <div className="ledger-kpi ledger-kpi--primary">
          <span className="ledger-kpi__label">Available</span>
          <span className="ledger-kpi__value">
            {state.currentBalance == null ? '…' : state.currentBalance.toLocaleString()}
          </span>
          <span className="ledger-kpi__hint">
            {extrasAboveGrant != null
              ? `Includes +${extrasAboveGrant.toLocaleString()} top-up`
              : 'Spendable now'}
          </span>
        </div>
        <div className="ledger-kpi">
          <span className="ledger-kpi__label">Plan grant</span>
          <span className="ledger-kpi__value">
            {state.allocation == null ? '—' : state.allocation.toLocaleString()}
          </span>
          <span className="ledger-kpi__hint">Credits from your plan each cycle</span>
        </div>
        <div className="ledger-kpi">
          <span className="ledger-kpi__label">Credited</span>
          <span className={`ledger-kpi__value${state.summary ? ' is-credit' : ''}`}>
            {state.loading && !state.summary
              ? '…'
              : state.summary
                ? formatCredits(state.summary.totalCredited ?? 0)
                : '—'}
          </span>
          <span className="ledger-kpi__hint">Matching filters</span>
        </div>
        <div className="ledger-kpi">
          <span className="ledger-kpi__label">Deducted</span>
          <span className={`ledger-kpi__value${state.summary ? ' is-debit' : ''}`}>
            {state.loading && !state.summary
              ? '…'
              : state.summary
                ? formatCredits(-(state.summary.totalDeducted ?? 0))
                : '—'}
          </span>
          <span className="ledger-kpi__hint">
            {state.summary
              ? `${(state.summary.packagePurchases ?? 0).toLocaleString()} pack purchases`
              : 'Matching filters'}
          </span>
        </div>
      </div>

      <form className="ledger-filters ledger-filters--sticky" onSubmit={applyFilters}>
        <div className="ledger-filters__row">
          <label>
            <span>From</span>
            <LedgerDateField
              aria-label="From date"
              value={filters.from}
              maxDate={filters.to || undefined}
              onChange={(from) =>
                setFilters((f) => {
                  const next = { ...f, from };
                  // Keep range valid if start moves past an existing end.
                  if (from && f.to && from > f.to) next.to = '';
                  return next;
                })
              }
              placeholder="Start date"
            />
          </label>
          <label>
            <span>To</span>
            <LedgerDateField
              aria-label="To date"
              value={filters.to}
              minDate={filters.from || undefined}
              onChange={(to) => setFilters((f) => ({ ...f, to }))}
              placeholder="End date"
            />
          </label>
          <label>
            <span>Type</span>
            <LedgerSelect
              aria-label="Transaction type"
              value={filters.type}
              onValueChange={(type) => setFilters((f) => ({ ...f, type }))}
              options={TYPE_OPTIONS}
            />
          </label>
          <label>
            <span>Service</span>
            <LedgerSelect
              aria-label="Service"
              value={filters.featureKey}
              onValueChange={(featureKey) => setFilters((f) => ({ ...f, featureKey }))}
              options={serviceOptions}
            />
          </label>
          <label className="ledger-filters__search">
            <span>Search</span>
            <input
              type="search"
              placeholder="Description or reference"
              value={filters.q}
              onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
            />
          </label>
        </div>
        <div className="ledger-filters__actions">
          <button
            type="button"
            className="dash-link-btn dash-link-btn--ghost"
            aria-expanded={showMoreFilters}
            onClick={() => setShowMoreFilters((v) => !v)}
          >
            {showMoreFilters ? 'Fewer filters' : 'More filters'}
          </button>
          <button type="submit" className="dash-link-btn">
            Apply
          </button>
          <button type="button" className="dash-link-btn dash-link-btn--ghost" onClick={clearFilters}>
            Clear
          </button>
        </div>
        {showMoreFilters ? (
          <div className="ledger-filters__more">
            <label>
              <span>Sub-account</span>
              <LedgerSelect
                aria-label="Sub-account"
                value={filters.userKey}
                onValueChange={(userKey) => setFilters((f) => ({ ...f, userKey }))}
                options={subAccountOptions}
              />
            </label>
            <label>
              <span>Direction</span>
              <LedgerSelect
                aria-label="Direction"
                value={filters.direction}
                onValueChange={(direction) => setFilters((f) => ({ ...f, direction }))}
                options={DIRECTION_OPTIONS}
              />
            </label>
            <label>
              <span>Sort</span>
              <LedgerSelect
                aria-label="Sort"
                value={filters.sort}
                onValueChange={(sort) => setFilters((f) => ({ ...f, sort }))}
                options={SORT_OPTIONS}
              />
            </label>
          </div>
        ) : null}
      </form>

      {chips.length > 0 && (
        <ul className="ledger-chips">
          {chips.map((chip) => (
            <li key={chip.key}>
              <button type="button" className="ledger-chip" onClick={() => removeChip(chip.key)}>
                {chip.label} ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {state.error && (
        <p className="ledger-error" role="alert">
          {state.error}
        </p>
      )}

      <div className={`ledger-table-wrap ledger-table-wrap--desktop${state.loading ? ' is-loading' : ''}`}>
        <table className="ledger-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Workspace</th>
              <th>Service</th>
              <th>Who</th>
              <th>Amount</th>
              <th>Balance after</th>
              <th aria-label="Details" />
            </tr>
          </thead>
          <tbody>
            {state.loading && state.docs.length === 0 && (
              <tr>
                <td colSpan={8} className="ledger-empty">
                  Loading ledger…
                </td>
              </tr>
            )}
            {!state.loading && state.docs.length === 0 && (
              <tr>
                <td colSpan={8} className="ledger-empty">
                  No credit movements yet. Activity appears here when credits are granted,
                  reset, or spent.
                </td>
              </tr>
            )}
            {state.docs.map((row) => {
              const amt = Number(row.amount) || 0;
              const when = formatDateTime(row.createdAt);
              const sub = resolveSubAccount(row, ownerId);
              const workspaceLabel = resolveWorkspaceLabel(row);
              const txnId = row.id ? String(row.id) : '';
              const desc = row.description || '';
              const hasDetails = Boolean(txnId || desc);
              const open = expandedId === row.id;
              return (
                <React.Fragment key={row.id}>
                  <tr className={open ? 'is-expanded' : undefined}>
                    <td className="ledger-date">
                      {when ? (
                        <>
                          <span className="ledger-date__day">{when.date}</span>
                          <span className="ledger-date__time">{when.time}</span>
                        </>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>{ledgerTypeLabel(row)}</td>
                    <td>{workspaceLabel || '-'}</td>
                    <td>{prettyServiceLabel(row.service)}</td>
                    <td>
                      {sub ? (
                        <div className="ledger-user">
                          <span>
                            {sub.name}
                            {sub.isOwner ? (
                              <span className="ledger-owner-tag">Owner</span>
                            ) : null}
                          </span>
                          {sub.email && (
                            <span className="ledger-user__email mono">{sub.email}</span>
                          )}
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className={amt > 0 ? 'is-credit' : amt < 0 ? 'is-debit' : ''}>
                      {formatCredits(amt)}
                    </td>
                    <td>
                      {typeof row.balanceAfter === 'number'
                        ? row.balanceAfter.toLocaleString()
                        : '-'}
                    </td>
                    <td className="ledger-actions-cell">
                      {hasDetails ? (
                        <button
                          type="button"
                          className={`ledger-details-btn${open ? ' is-open' : ''}`}
                          aria-expanded={open}
                          aria-label={open ? 'Hide details' : 'Show details'}
                          title={open ? 'Hide details' : 'Show details'}
                          onClick={() =>
                            setExpandedId((id) => (id === row.id ? null : row.id))
                          }
                        >
                          <InfoIcon />
                        </button>
                      ) : null}
                    </td>
                  </tr>
                  {open && hasDetails ? (
                    <tr className="ledger-detail-row">
                      <td colSpan={8}>
                        <div className="ledger-detail">
                          {txnId ? (
                            <div className="ledger-detail__block">
                              <span className="ledger-detail__label">
                                Reference
                                <span className="ledger-detail__hint">Transaction ID</span>
                              </span>
                              <div className="ledger-detail__ref">
                                <code className="mono">{txnId}</code>
                                <CopyTextButton text={txnId} />
                              </div>
                            </div>
                          ) : null}
                          {desc ? (
                            <div className="ledger-detail__block">
                              <span className="ledger-detail__label">Description</span>
                              <p className="ledger-detail__text">{desc}</p>
                            </div>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="ledger-cards ledger-cards--mobile">
        {state.loading && state.docs.length === 0 ? (
          <p className="ledger-empty">Loading ledger…</p>
        ) : null}
        {!state.loading && state.docs.length === 0 ? (
          <p className="ledger-empty">
            No credit movements yet. Activity appears here when credits are granted, reset, or
            spent.
          </p>
        ) : null}
        {renderRowCards()}
      </div>

      <div className="ledger-pager">
        <div className="ledger-pager__meta">
          <span>
            {state.loading && state.docs.length === 0
              ? 'Loading…'
              : `${state.totalDocs} entr${state.totalDocs === 1 ? 'y' : 'ies'}`}
            {!state.loading && state.totalPages > 1
              ? ` · page ${page} of ${state.totalPages}`
              : ''}
          </span>
          <label className="ledger-pager__size">
            <span>Per page</span>
            <LedgerSelect
              aria-label="Rows per page"
              value={String(pageSize)}
              onValueChange={(next) => {
                const size = Number(next) || 8;
                setPageSize(size);
                setPage(1);
              }}
              options={PAGE_SIZE_OPTIONS}
            />
          </label>
        </div>
        <div className="ledger-pager__btns">
          <button
            type="button"
            className="dash-link-btn dash-link-btn--ghost"
            disabled={page <= 1 || state.loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <button
            type="button"
            className="dash-link-btn dash-link-btn--ghost"
            disabled={page >= state.totalPages || state.loading}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreditLedger;
