'use client';

import React from 'react';

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

const formatDateTime = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
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

const CreditLedger = () => {
  const [filters, setFilters] = React.useState(INITIAL_FILTERS);
  const [applied, setApplied] = React.useState(INITIAL_FILTERS);
  const [page, setPage] = React.useState(1);
  const [users, setUsers] = React.useState([]);
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
        const ownerName =
          [member?.firstName, member?.lastName].filter(Boolean).join(' ').trim() ||
          member?.email ||
          'You (owner)';
        const list = [
          { key: 'owner', label: `${ownerName} (owner)` },
          ...(data.subAccounts || []).map((a) => ({
            key: a.id,
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

  const load = React.useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: '' }));
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '50');
      params.set('sort', applied.sort || 'newest');
      if (applied.from) params.set('from', new Date(applied.from).toISOString());
      if (applied.to) {
        const end = new Date(applied.to);
        end.setHours(23, 59, 59, 999);
        params.set('to', end.toISOString());
      }
      if (applied.type) params.set('type', applied.type);
      if (applied.featureKey) params.set('featureKey', applied.featureKey);
      if (applied.direction) params.set('direction', applied.direction);
      if (applied.q.trim()) params.set('q', applied.q.trim());
      if (applied.userKey === 'owner') params.set('ownerOnly', '1');
      else if (applied.userKey) params.set('subAccountId', applied.userKey);

      const res = await fetch(`/api/credits/ledger?${params}`, { cache: 'no-store' });
      if (res.status === 401) {
        window.location.assign('/login?next=/dashboard/ledger');
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Unable to load credit ledger.');
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
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err.message || 'Unable to load credit ledger.',
        docs: [],
      }));
    }
  }, [applied, page]);

  React.useEffect(() => {
    void load();
  }, [load]);

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
      list.push({ key: 'userKey', label: `User: ${u?.label || applied.userKey}` });
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
    // Paginate up to a safe cap so export matches filters/sort.
    const all = [];
    let p = 1;
    let totalPages = 1;
    const maxPages = 100; // 5k rows at limit 50
    while (p <= totalPages && p <= maxPages) {
      const params = new URLSearchParams();
      params.set('page', String(p));
      params.set('limit', '50');
      params.set('sort', applied.sort || 'newest');
      if (applied.from) params.set('from', new Date(applied.from).toISOString());
      if (applied.to) {
        const end = new Date(applied.to);
        end.setHours(23, 59, 59, 999);
        params.set('to', end.toISOString());
      }
      if (applied.type) params.set('type', applied.type);
      if (applied.featureKey) params.set('featureKey', applied.featureKey);
      if (applied.direction) params.set('direction', applied.direction);
      if (applied.q.trim()) params.set('q', applied.q.trim());
      if (applied.userKey === 'owner') params.set('ownerOnly', '1');
      else if (applied.userKey) params.set('subAccountId', applied.userKey);

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
      'Service',
      'Workspace',
      'User',
      'Credits',
      'Running Balance',
      'Reference',
      'Description',
    ];
    const lines = [header.map(csvEscape).join(',')];
    for (const row of all) {
      lines.push(
        [
          formatDateTime(row.createdAt),
          row.displayType || row.type || '',
          row.service || '',
          row.workspace || '',
          row.user?.name || '',
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
            balance after each transaction. Workspace and some detailed types will fill in as the
            product sends richer metadata.
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
          <input
            type="date"
            value={filters.from}
            onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))}
          />
        </label>
        <label>
          <span>To</span>
          <input
            type="date"
            value={filters.to}
            onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))}
          />
        </label>
        <label>
          <span>Type</span>
          <select
            value={filters.type}
            onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
          >
            {TYPE_OPTIONS.map((o) => (
              <option key={o.value || 'all'} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Service</span>
          <select
            value={filters.featureKey}
            onChange={(e) => setFilters((f) => ({ ...f, featureKey: e.target.value }))}
          >
            <option value="">All services</option>
            {state.featureOptions.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>User</span>
          <select
            value={filters.userKey}
            onChange={(e) => setFilters((f) => ({ ...f, userKey: e.target.value }))}
          >
            <option value="">All users</option>
            {users.map((u) => (
              <option key={u.key} value={u.key}>
                {u.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Direction</span>
          <select
            value={filters.direction}
            onChange={(e) => setFilters((f) => ({ ...f, direction: e.target.value }))}
          >
            {DIRECTION_OPTIONS.map((o) => (
              <option key={o.value || 'all-dir'} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Sort</span>
          <select
            value={filters.sort}
            onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
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

      <div className="ledger-table-wrap">
        <table className="ledger-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Transaction Type</th>
              <th>Service</th>
              <th>Workspace</th>
              <th>User</th>
              <th>Credits</th>
              <th>Running Balance</th>
              <th>Reference</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {state.loading && (
              <tr>
                <td colSpan={9} className="ledger-empty">
                  Loading ledger…
                </td>
              </tr>
            )}
            {!state.loading && state.docs.length === 0 && (
              <tr>
                <td colSpan={9} className="ledger-empty">
                  No credit transactions match these filters.
                </td>
              </tr>
            )}
            {!state.loading &&
              state.docs.map((row) => {
                const amt = Number(row.amount) || 0;
                return (
                  <tr key={row.id}>
                    <td>{formatDateTime(row.createdAt)}</td>
                    <td>{row.displayType || row.type}</td>
                    <td>{row.service || '—'}</td>
                    <td>{row.workspace || '—'}</td>
                    <td>
                      <div className="ledger-user">
                        <span>{row.user?.name || '—'}</span>
                        {row.user?.email && (
                          <span className="ledger-user__email mono">{row.user.email}</span>
                        )}
                      </div>
                    </td>
                    <td className={amt > 0 ? 'is-credit' : amt < 0 ? 'is-debit' : ''}>
                      {formatCredits(amt)}
                    </td>
                    <td>{typeof row.balanceAfter === 'number' ? row.balanceAfter.toLocaleString() : '—'}</td>
                    <td className="mono ledger-ref">{row.reference || '—'}</td>
                    <td>{row.description || '—'}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <div className="ledger-pager">
        <span>
          {state.totalDocs} entr{state.totalDocs === 1 ? 'y' : 'ies'}
          {state.totalPages > 1 ? ` · page ${page} of ${state.totalPages}` : ''}
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
