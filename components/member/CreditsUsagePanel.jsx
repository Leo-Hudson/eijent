'use client';

import React from 'react';
import LedgerDateField from '@/components/ledger/LedgerDateField';
import { deriveWallet } from '@/hooks/useMemberDashboard';
import {
  formatDate,
  prettyCycle,
  prettyServiceLabel,
} from '@/lib/memberDisplay';
import { buildCreditForecast, FORECAST_TRAILING_DAYS } from '@/lib/creditForecast';

const PRESETS = [
  { id: 'today', label: 'Today' },
  { id: '7d', label: '7d' },
  { id: '30d', label: '30d' },
  { id: 'cycle', label: 'This cycle' },
  { id: 'custom', label: 'Custom' },
];

const toYmd = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const dayStartIso = (yyyyMmDd) => {
  const [y, m, d] = yyyyMmDd.split('-').map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0).toISOString();
};

const dayEndIso = (yyyyMmDd) => {
  const [y, m, d] = yyyyMmDd.split('-').map(Number);
  return new Date(y, m - 1, d, 23, 59, 59, 999).toISOString();
};

const resolveWorkspaceLabel = (row) => {
  if (row?.workspace && typeof row.workspace === 'object') {
    return row.workspace.name || row.workspace.id || null;
  }
  return row?.workspaceName || row?.workspaceId || null;
};

const resolveUserLabel = (row, ownerId, ownerLabel) => {
  if (row?.attributedToOwner === true) return ownerLabel || 'Owner';
  if (row?.subAccount && typeof row.subAccount === 'object') {
    return row.subAccount.name || row.subAccount.email || 'Sub-account';
  }
  if (row?.user?.name || row?.user?.email) {
    if (ownerId && row.user?.id != null && String(row.user.id) === String(ownerId)) {
      return ownerLabel || 'Owner';
    }
    return row.user.name || row.user.email;
  }
  return 'Unknown';
};

const csvEscape = (value) => {
  const s = value == null ? '' : String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
};

function rangeForPreset(preset, customFrom, customTo, nextResetAt) {
  const today = new Date();
  const end = toYmd(today);
  if (preset === 'today') return { from: end, to: end };
  if (preset === '7d') {
    const start = new Date(today);
    start.setDate(start.getDate() - 6);
    return { from: toYmd(start), to: end };
  }
  if (preset === '30d') {
    const start = new Date(today);
    start.setDate(start.getDate() - 29);
    return { from: toYmd(start), to: end };
  }
  if (preset === 'cycle') {
    if (nextResetAt) {
      const reset = new Date(nextResetAt);
      if (!Number.isNaN(reset.getTime())) {
        const start = new Date(reset);
        start.setMonth(start.getMonth() - 1);
        return { from: toYmd(start), to: end };
      }
    }
    const start = new Date(today);
    start.setDate(1);
    return { from: toYmd(start), to: end };
  }
  return { from: customFrom || '', to: customTo || end };
}

/**
 * Usage analytics from dashboard usage + ledger aggregates (date-filtered).
 */
export default function CreditsUsagePanel({ data }) {
  const { balance, allocation, totalDeducted, nextResetAt, resetCycle } = deriveWallet(data);
  const credits = data?.credits || null;
  const member = data?.member;
  const ownerId = member?.id ? String(member.id) : null;
  const ownerLabel =
    [member?.firstName, member?.lastName].filter(Boolean).join(' ').trim() ||
    member?.email ||
    'Owner';

  const [preset, setPreset] = React.useState('30d');
  const [customFrom, setCustomFrom] = React.useState('');
  const [customTo, setCustomTo] = React.useState('');
  const [agg, setAgg] = React.useState({
    loading: true,
    error: '',
    byUser: [],
    byService: [],
    byWorkspace: [],
    usedInRange: 0,
  });
  const [trailing, setTrailing] = React.useState({
    loading: true,
    used: null,
    days: FORECAST_TRAILING_DAYS,
  });

  const range = React.useMemo(
    () => rangeForPreset(preset, customFrom, customTo, nextResetAt),
    [preset, customFrom, customTo, nextResetAt],
  );

  React.useEffect(() => {
    const controller = new AbortController();
    (async () => {
      setTrailing((prev) => ({ ...prev, loading: true }));
      try {
        const today = new Date();
        const start = new Date(today);
        start.setDate(start.getDate() - (FORECAST_TRAILING_DAYS - 1));
        const params = new URLSearchParams();
        params.set('from', dayStartIso(toYmd(start)));
        params.set('to', dayEndIso(toYmd(today)));
        params.set('type', 'deduct');
        params.set('direction', 'debit');
        params.set('sort', 'newest');
        params.set('limit', '1');
        params.set('page', '1');
        const res = await fetch(`/api/credits/ledger?${params}`, {
          cache: 'no-store',
          signal: controller.signal,
        });
        if (res.status === 401) {
          window.location.assign('/login?next=/dashboard/credits');
          return;
        }
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.error || 'Unable to load trailing usage.');
        const used =
          typeof json.summary?.totalDeducted === 'number'
            ? Math.abs(json.summary.totalDeducted)
            : Array.isArray(json.docs)
              ? json.docs.reduce((sum, row) => sum + Math.abs(Number(row.amount) || 0), 0)
              : 0;
        setTrailing({ loading: false, used, days: FORECAST_TRAILING_DAYS });
      } catch (err) {
        if (err?.name === 'AbortError') return;
        setTrailing({ loading: false, used: null, days: FORECAST_TRAILING_DAYS });
      }
    })();
    return () => controller.abort();
  }, []);

  React.useEffect(() => {
    if (preset === 'custom' && (!range.from || !range.to)) {
      setAgg((prev) => ({ ...prev, loading: false, error: '', byUser: [], byService: [], byWorkspace: [], usedInRange: 0 }));
      return undefined;
    }
    if (!range.from || !range.to) return undefined;

    const controller = new AbortController();
    (async () => {
      setAgg((prev) => ({ ...prev, loading: true, error: '' }));
      try {
        const params = new URLSearchParams();
        params.set('from', dayStartIso(range.from));
        params.set('to', dayEndIso(range.to));
        params.set('type', 'deduct');
        params.set('direction', 'debit');
        params.set('sort', 'newest');
        params.set('limit', '100');

        const all = [];
        let page = 1;
        let totalPages = 1;
        const maxPages = 20;
        while (page <= totalPages && page <= maxPages) {
          params.set('page', String(page));
          const res = await fetch(`/api/credits/ledger?${params}`, {
            cache: 'no-store',
            signal: controller.signal,
          });
          if (res.status === 401) {
            window.location.assign('/login?next=/dashboard/credits');
            return;
          }
          const json = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(json.error || 'Unable to load usage.');
          all.push(...(json.docs || []));
          totalPages = json.totalPages || 1;
          page += 1;
        }

        const byUserMap = new Map();
        const byServiceMap = new Map();
        const byWorkspaceMap = new Map();
        let usedInRange = 0;

        for (const row of all) {
          const amount = Math.abs(Number(row.amount) || 0);
          if (amount <= 0) continue;
          usedInRange += amount;

          const user = resolveUserLabel(row, ownerId, ownerLabel);
          byUserMap.set(user, (byUserMap.get(user) || 0) + amount);

          const serviceKey = row.featureKey || row.service || 'other';
          const serviceLabel = prettyServiceLabel(serviceKey);
          byServiceMap.set(serviceLabel, (byServiceMap.get(serviceLabel) || 0) + amount);

          const ws = resolveWorkspaceLabel(row);
          if (ws) {
            byWorkspaceMap.set(ws, (byWorkspaceMap.get(ws) || 0) + amount);
          }
        }

        const toSorted = (map) =>
          [...map.entries()]
            .map(([label, deducted]) => ({ label, deducted }))
            .sort((a, b) => b.deducted - a.deducted);

        setAgg({
          loading: false,
          error: '',
          byUser: toSorted(byUserMap),
          byService: toSorted(byServiceMap),
          byWorkspace: toSorted(byWorkspaceMap),
          usedInRange,
        });
      } catch (err) {
        if (err?.name === 'AbortError') return;
        setAgg({
          loading: false,
          error: err.message || 'Unable to load usage.',
          byUser: [],
          byService: [],
          byWorkspace: [],
          usedInRange: 0,
        });
      }
    })();

    return () => controller.abort();
  }, [range.from, range.to, preset, ownerId, ownerLabel]);

  const fallbackByUser = React.useMemo(() => {
    if (agg.byUser.length || agg.loading) return [];
    const rows = [];
    if (credits?.owner?.deducted) {
      rows.push({ label: `${ownerLabel} (owner)`, deducted: credits.owner.deducted });
    }
    for (const b of credits?.bySubAccount || []) {
      rows.push({ label: b.name || b.email || 'Sub-account', deducted: b.deducted || 0 });
    }
    return rows.sort((a, b) => b.deducted - a.deducted);
  }, [agg.byUser.length, agg.loading, credits, ownerLabel]);

  const fallbackByService = React.useMemo(() => {
    if (agg.byService.length || agg.loading) return [];
    return (credits?.byFeature || []).map((f) => ({
      label: prettyServiceLabel(f.key),
      deducted: f.deducted || 0,
    }));
  }, [agg.byService.length, agg.loading, credits]);

  const byUser = agg.byUser.length ? agg.byUser : fallbackByUser;
  const byService = agg.byService.length ? agg.byService : fallbackByService;

  const forecast = React.useMemo(
    () =>
      buildCreditForecast({
        usedSoFar: totalDeducted,
        trailingUsed: trailing.used,
        trailingWindowDays: trailing.days,
        balance,
        allocation,
        nextResetAt,
        resetCycle,
      }),
    [totalDeducted, trailing.used, trailing.days, balance, allocation, nextResetAt, resetCycle],
  );

  const exportCsv = () => {
    const lines = [['Dimension', 'Name', 'Credits used'].map(csvEscape).join(',')];
    for (const row of byUser) {
      lines.push(['User', row.label, row.deducted].map(csvEscape).join(','));
    }
    for (const row of byService) {
      lines.push(['Service', row.label, row.deducted].map(csvEscape).join(','));
    }
    for (const row of agg.byWorkspace) {
      lines.push(['Workspace', row.label, row.deducted].map(csvEscape).join(','));
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eijent-usage-${range.from || 'all'}-${range.to || 'all'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="credits-usage">
      <div className="dash-summary" aria-label="Credit summary">
        <div className="dash-summary__item">
          <span className="dash-summary__label">Current balance</span>
          <span className="dash-summary__value">
            {balance != null ? balance.toLocaleString() : '—'}
          </span>
        </div>
        <div className="dash-summary__item">
          <span className="dash-summary__label">Plan grant</span>
          <span className="dash-summary__value">
            {allocation != null ? allocation.toLocaleString() : '—'}
          </span>
          {prettyCycle(resetCycle) ? (
            <span className="dash-summary__hint">{prettyCycle(resetCycle)}</span>
          ) : null}
        </div>
        <div className="dash-summary__item">
          <span className="dash-summary__label">Used this cycle</span>
          <span className="dash-summary__value">
            {totalDeducted != null ? totalDeducted.toLocaleString() : '—'}
          </span>
          {nextResetAt ? (
            <span className="dash-summary__hint">Resets {formatDate(nextResetAt)}</span>
          ) : null}
        </div>
        <div className="dash-summary__item">
          <span className="dash-summary__label">Used in range</span>
          <span className="dash-summary__value">
            {agg.loading ? '…' : agg.usedInRange.toLocaleString()}
          </span>
        </div>
      </div>

      <section className={`dash-card forecast-card${forecast.ready ? '' : ' dash-card--muted'}`}>
        <div className="dash-card__head">
          <h2 className="dash-card__title">Forecasted usage</h2>
          {forecast.ready ? (
            <span className={`dash-badge ${forecastStatusTone(forecast.status)}`}>
              {forecastStatusLabel(forecast.status)}
            </span>
          ) : null}
        </div>
        {!forecast.ready ? (
          <p className="dash-empty">{forecast.message}</p>
        ) : trailing.loading ? (
          <p className="dash-empty">Calculating 7-day pace…</p>
        ) : (
          <>
            <div className="forecast-grid" aria-label="Usage forecast">
              <div className="forecast-stat">
                <span className="forecast-stat__label">Projected cycle total</span>
                <span className="forecast-stat__value">
                  {forecast.projectedTotal.toLocaleString()}
                </span>
                <span className="forecast-stat__hint">
                  {forecast.method === 'trailing'
                    ? `${forecast.trailingWindowDays}-day pace`
                    : 'cycle average pace'}
                </span>
              </div>
              <div className="forecast-stat">
                <span className="forecast-stat__label">Daily burn</span>
                <span className="forecast-stat__value">
                  {forecast.dailyRate < 10
                    ? forecast.dailyRate.toFixed(1)
                    : Math.round(forecast.dailyRate).toLocaleString()}
                </span>
                <span className="forecast-stat__hint">
                  {forecast.method === 'trailing'
                    ? `avg last ${forecast.trailingWindowDays}d`
                    : 'credits / day'}
                </span>
              </div>
              <div className="forecast-stat">
                <span className="forecast-stat__label">Days left</span>
                <span className="forecast-stat__value">
                  {forecast.daysRemaining.toLocaleString()}
                </span>
                <span className="forecast-stat__hint">
                  {nextResetAt ? `resets ${formatDate(nextResetAt)}` : prettyCycle(resetCycle) || 'in cycle'}
                </span>
              </div>
              <div className="forecast-stat">
                <span className="forecast-stat__label">Still expected</span>
                <span className="forecast-stat__value">
                  {forecast.projectedRemainingSpend.toLocaleString()}
                </span>
                <span className="forecast-stat__hint">
                  {balance != null
                    ? `${balance.toLocaleString()} available now`
                    : 'before reset'}
                </span>
              </div>
            </div>
            <div className="forecast-meter" aria-hidden="true">
              <div className="forecast-meter__track">
                <span
                  className={`forecast-meter__fill is-${forecast.status}`}
                  style={{ width: `${Math.max(forecast.pctOfProjection, forecast.usedSoFar ? 4 : 0)}%` }}
                />
              </div>
              <div className="forecast-meter__labels">
                <span>
                  {forecast.usedSoFar.toLocaleString()} used · day {forecast.daysElapsed} of{' '}
                  {forecast.daysInCycle}
                  {forecast.trailingUsed != null
                    ? ` · ${forecast.trailingUsed.toLocaleString()} in last ${forecast.trailingWindowDays}d`
                    : ''}
                </span>
                <span>{forecast.pctOfProjection}% of projection</span>
              </div>
            </div>
            <p className="forecast-note">{forecast.message}</p>
          </>
        )}
      </section>

      <div className="usage-toolbar">
        <div className="usage-presets" role="group" aria-label="Date range">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`usage-preset${preset === p.id ? ' is-active' : ''}`}
              onClick={() => setPreset(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
        {preset === 'custom' ? (
          <div className="usage-custom-dates" role="group" aria-label="Custom date range">
            <label className="usage-date-field">
              <span>From</span>
              <LedgerDateField
                aria-label="From date"
                value={customFrom}
                onChange={setCustomFrom}
                maxDate={customTo || undefined}
              />
            </label>
            <span className="usage-date-sep" aria-hidden="true">
              –
            </span>
            <label className="usage-date-field">
              <span>To</span>
              <LedgerDateField
                aria-label="To date"
                value={customTo}
                onChange={setCustomTo}
                minDate={customFrom || undefined}
              />
            </label>
          </div>
        ) : null}
        <button
          type="button"
          className="dash-link-btn dash-link-btn--ghost"
          onClick={exportCsv}
          disabled={agg.loading || (!byUser.length && !byService.length && !agg.byWorkspace.length)}
        >
          Export CSV
        </button>
      </div>

      {agg.error ? (
        <div className="dash-error" role="alert">
          <p>{agg.error}</p>
        </div>
      ) : null}

      <div className="usage-grid">
        <UsageTable
          key={`user-${range.from}-${range.to}`}
          title="Usage by user"
          empty="No usage in this range."
          loading={agg.loading}
          rows={byUser}
          linkForRow={(row) => {
            const sub = (data?.subAccounts || []).find(
              (a) =>
                `${a.firstName || ''} ${a.lastName || ''}`.trim() === row.label ||
                a.email === row.label,
            );
            if (sub?.id) return `/dashboard/credits?tab=ledger&user=${encodeURIComponent(sub.id)}`;
            if (row.label.includes('(owner)') || row.label === ownerLabel) {
              return '/dashboard/credits?tab=ledger&user=owner';
            }
            return null;
          }}
        />
        <UsageTable
          key={`service-${range.from}-${range.to}`}
          title="Usage by service"
          empty="No service usage in this range."
          loading={agg.loading}
          rows={byService}
        />
        <UsageTable
          key={`workspace-${range.from}-${range.to}`}
          title="Usage by workspace"
          empty="No workspace attribution in this range yet."
          loading={agg.loading}
          rows={agg.byWorkspace}
        />
      </div>
    </div>
  );
}

function forecastStatusLabel(status) {
  if (status === 'at_risk') return 'May run out';
  if (status === 'above_grant') return 'Above grant';
  if (status === 'early' || status === 'quiet') return 'Early';
  if (status === 'cycle_end') return 'Reset due';
  return 'On track';
}

function forecastStatusTone(status) {
  if (status === 'at_risk') return 'is-bad';
  if (status === 'above_grant') return 'is-warn';
  if (status === 'early' || status === 'quiet') return 'is-soon';
  return 'is-good';
}

function UsageTable({ title, empty, loading, rows, linkForRow }) {
  const PREVIEW = 8;
  const [expanded, setExpanded] = React.useState(false);
  const hasMore = rows.length > PREVIEW;
  const visible = expanded || !hasMore ? rows : rows.slice(0, PREVIEW);

  return (
    <section className="dash-card usage-table-card">
      <div className="dash-card__head">
        <h2 className="dash-card__title">{title}</h2>
        <span className="dash-count">{rows.length}</span>
      </div>
      {loading ? (
        <p className="dash-empty">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="dash-empty">{empty}</p>
      ) : (
        <>
          <div
            className={`usage-table-wrap${expanded && hasMore ? ' is-scrollable' : ''}`}
          >
            <table className="usage-table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Credits</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((row) => {
                  const href = linkForRow?.(row);
                  return (
                    <tr key={row.label}>
                      <td>
                        {href ? (
                          <a href={href} className="usage-table__link">
                            {row.label}
                          </a>
                        ) : (
                          row.label
                        )}
                      </td>
                      <td>{row.deducted.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {hasMore ? (
            <button
              type="button"
              className="usage-table-more"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded
                ? 'Show less'
                : `Show all ${rows.length} (${rows.length - PREVIEW} more)`}
            </button>
          ) : null}
        </>
      )}
    </section>
  );
}
