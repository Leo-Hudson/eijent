'use client';

import React from 'react';
import { format, parseISO, isValid } from 'date-fns';
import LedgerSelect from '@/components/ledger/LedgerSelect';
import LedgerDateField from '@/components/ledger/LedgerDateField';

const TYPE_OPTIONS = [
  { value: '', label: 'All types' },
  { value: 'reset', label: 'Monthly Allocation' },
  { value: 'grant', label: 'Manual Adjustment' },
  { value: 'deduct', label: 'Usage (deductions)' },
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

const csvEscape = (value) => {
  const s = value == null ? '' : String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
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

const buildLedgerParams = (applied, page) => {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('limit', '50');
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

const CreditLedger = () => {
  const [filters, setFilters] = React.useState(INITIAL_FILTERS);
  const [applied, setApplied] = React.useState(INITIAL_FILTERS);
  const [page, setPage] = React.useState(1);
  const [users, setUsers] = React.useState([]);
  const [ownerId, setOwnerId] = React.useState(null);
  const [state, setState] = React.useState({
    loading: true,
    error: '',
    docs: [],
    totalDocs: 0,
    totalPages: 1,
    currentBalance: null,
    featureOptions: [],
  });

  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/dashboard', { cache: 'no-store' });
        if (res.status === 401) {
          window.location.assign('/login?next=/dashboard/ledger');
          return;
        }
        const data = await res.json().catch(() => ({}));
        if (!active || !res.ok) return;
        const member = data.member;
        if (member?.id) setOwnerId(String(member.id));
        const ownerName =
          [member?.firstName, member?.lastName].filter(Boolean).join(' ').trim() ||
          member?.email ||
          'You (owner)';
        const list = [
          { key: 'owner', label: `${ownerName} (owner)` },
          ...(data.subAccounts || []).map((a) => ({
            key: String(a.id),
            label:
              `${a.firstName || ''} ${a.lastName || ''}`.trim() || a.email || 'Sub-account',
          })),
        ];
        setUsers(list);
      } catch {
        // filter users optional
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  React.useEffect(() => {
    const controller = new AbortController();

    (async () => {
      setState((prev) => ({ ...prev, loading: true, error: '' }));
      try {
        const params = buildLedgerParams(applied, page);
        const res = await fetch(`/api/credits/ledger?${params}`, {
          cache: 'no-store',
          signal: controller.signal,
        });
        if (res.status === 401) {
          window.location.assign('/login?next=/dashboard/ledger');
          return;
        }
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Unable to load credit ledger.');
        if (controller.signal.aborted) return;
        setState({
          loading: false,
          error: '',
          docs: Array.isArray(data.docs) ? data.docs : [],
          totalDocs: data.totalDocs || 0,
          totalPages: data.totalPages || 1,
          currentBalance: typeof data.currentBalance === 'number' ? data.currentBalance : null,
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
        }));
      }
    })();

    return () => controller.abort();
  }, [applied, page]);

  const chips = React.useMemo(() => {
    const list = [];
    if (applied.from) list.push({ key: 'from', label: `From ${applied.from}` });
    if (applied.to) list.push({ key: 'to', label: `To ${applied.to}` });
    if (applied.type) {
      const opt = TYPE_OPTIONS.find((o) => o.value === applied.type);
      list.push({ key: 'type', label: opt?.label || applied.type });
    }
    if (applied.featureKey) list.push({ key: 'featureKey', label: `Service: ${applied.featureKey}` });
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
      ...state.featureOptions.map((key) => ({ value: key, label: key })),
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
    const all = [];
    let p = 1;
    let totalPages = 1;
    const maxPages = 100;
    while (p <= totalPages && p <= maxPages) {
      const params = buildLedgerParams(applied, p);
      const res = await fetch(`/api/credits/ledger?${params}`, { cache: 'no-store' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Export failed.');
      all.push(...(data.docs || []));
      totalPages = data.totalPages || 1;
      p += 1;
    }

    const header = [
      'Date',
      'Transaction Type',
      'Workspace',
      'Service',
      'Sub-account',
      'Sub-account Email',
      'Credits',
      'Running Balance',
      'Reference',
      'Description',
    ];
    const lines = [header.map(csvEscape).join(',')];
    for (const row of all) {
      const when = formatDateTime(row.createdAt);
      const sub = resolveSubAccount(row, ownerId);
      const subLabel = sub
        ? sub.isOwner
          ? `${sub.name} (owner)`
          : sub.name
        : '';
      lines.push(
        [
          when?.full || '',
          row.displayType || row.type || '',
          resolveWorkspaceLabel(row) || '',
          row.service || '',
          subLabel,
          sub?.email || '',
          formatCredits(row.amount),
          typeof row.balanceAfter === 'number' ? row.balanceAfter : '',
          row.reference || '',
          row.description || '',
        ]
          .map(csvEscape)
          .join(','),
      );
    }

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eijent-credit-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="ledger">
      <header className="ledger-top">
        <div>
          <a href="/dashboard" className="ledger-back">
            ← Dashboard
          </a>
          <h1 className="ledger-title">Credit ledger</h1>
          <p className="ledger-sub">
            Immutable history of credit movements for your organization. Running balance is the
            balance after each transaction. Sub-account shows who consumed credits from the org
            pool.
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
            disabled={state.loading || state.totalDocs === 0}
          >
            Export CSV
          </button>
        </div>
      </header>

      <form className="ledger-filters" onSubmit={applyFilters}>
        <label>
          <span>From</span>
          <LedgerDateField
            aria-label="From date"
            value={filters.from}
            onChange={(from) => setFilters((f) => ({ ...f, from }))}
            placeholder="Start date"
          />
        </label>
        <label>
          <span>To</span>
          <LedgerDateField
            aria-label="To date"
            value={filters.to}
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
        <label className="ledger-filters__search">
          <span>Search</span>
          <input
            type="search"
            placeholder="Description or reference"
            value={filters.q}
            onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
          />
        </label>
        <div className="ledger-filters__actions">
          <button type="submit" className="dash-link-btn">
            Apply
          </button>
          <button type="button" className="dash-link-btn dash-link-btn--ghost" onClick={clearFilters}>
            Clear
          </button>
        </div>
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

      <div className={`ledger-table-wrap${state.loading ? ' is-loading' : ''}`}>
        <table className="ledger-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Transaction Type</th>
              <th>Workspace</th>
              <th>Service</th>
              <th>Sub-account</th>
              <th>Credits</th>
              <th>Running Balance</th>
              <th>Reference</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {state.loading && state.docs.length === 0 && (
              <tr>
                <td colSpan={9} className="ledger-empty">
                  Loading ledger…
                </td>
              </tr>
            )}
            {!state.loading && state.docs.length === 0 && (
              <tr>
                <td colSpan={9} className="ledger-empty">
                  No credit transactions match these filters. Usage only appears under a
                  sub-account when the product attributes the deduction to that account.
                </td>
              </tr>
            )}
            {state.docs.map((row) => {
              const amt = Number(row.amount) || 0;
              const when = formatDateTime(row.createdAt);
              const sub = resolveSubAccount(row, ownerId);
              const workspaceLabel = resolveWorkspaceLabel(row);
              return (
                <tr key={row.id}>
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
                  <td>{row.displayType || row.type}</td>
                  <td>{workspaceLabel || '-'}</td>
                  <td>{row.service || '-'}</td>
                  <td>
                    {sub ? (
                      <div className="ledger-user">
                        <span>
                          {sub.name}
                          {sub.isOwner ? (
                            <span className="ledger-owner-tag">Owner</span>
                          ) : null}
                        </span>
                        {sub.email && <span className="ledger-user__email mono">{sub.email}</span>}
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className={amt > 0 ? 'is-credit' : amt < 0 ? 'is-debit' : ''}>
                    {formatCredits(amt)}
                  </td>
                  <td>
                    {typeof row.balanceAfter === 'number' ? row.balanceAfter.toLocaleString() : '-'}
                  </td>
                  <td className="mono ledger-ref">{row.reference || '-'}</td>
                  <td>{row.description || '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="ledger-pager">
        <span>
          {state.loading && state.docs.length === 0
            ? 'Loading…'
            : `${state.totalDocs} entr${state.totalDocs === 1 ? 'y' : 'ies'}`}
          {!state.loading && state.totalPages > 1 ? ` · page ${page} of ${state.totalPages}` : ''}
        </span>
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
