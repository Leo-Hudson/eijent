'use client';

import React from 'react';
import MemberShell from '@/components/member/MemberShell';
import MemberErrorState from '@/components/member/MemberErrorState';
import LedgerSelect from '@/components/ledger/LedgerSelect';
import { useMemberDashboard } from '@/hooks/useMemberDashboard';
import { displayName, STATUS_TONE } from '@/lib/memberDisplay';

const PAGE_SIZE = 10;

const STATUS_FILTERS = [
  { value: '', label: 'All statuses' },
  { value: 'Active', label: 'Active' },
  { value: 'Disabled', label: 'Disabled' },
  { value: 'Pending', label: 'Pending' },
];

const SORT_OPTIONS = [
  { value: 'name', label: 'Name A–Z' },
  { value: 'spend', label: 'Highest spend' },
];

function Loading() {
  return (
    <div className="dash-loading" aria-busy="true">
      <div className="dash-skeleton dash-skeleton--head" />
      <div className="dash-skeleton" />
    </div>
  );
}

function statusTone(status) {
  return (
    STATUS_TONE[status] ||
    (status === 'Active'
      ? 'is-good'
      : status === 'Disabled'
        ? 'is-bad'
        : 'is-warn')
  );
}

function creditsHref(userKey) {
  const params = new URLSearchParams();
  params.set('tab', 'ledger');
  if (userKey) params.set('user', userKey);
  return `/dashboard/credits?${params.toString()}`;
}

function buildPeople({ member, subAccounts, credits, q, status, sort }) {
  const ownerName = displayName(member, 'Owner');
  const spendById = new Map(
    (credits?.bySubAccount || []).map((u) => [String(u.subAccountId), Number(u.deducted) || 0]),
  );

  const rows = [
    {
      key: 'owner',
      userKey: 'owner',
      name: ownerName,
      email: member?.email || '',
      status: member?.status || 'Active',
      isOwner: true,
      deducted: Number(credits?.owner?.deducted) || 0,
    },
    ...subAccounts.map((acc) => {
      const name = displayName(acc, acc.email);
      return {
        key: String(acc.id),
        userKey: String(acc.id),
        name,
        email: acc.email || '',
        status: acc.status || 'Pending',
        isOwner: false,
        deducted: spendById.get(String(acc.id)) || 0,
      };
    }),
  ];

  const needle = q.trim().toLowerCase();
  let filtered = rows.filter((row) => {
    if (status && String(row.status) !== status) return false;
    if (!needle) return true;
    return (
      row.name.toLowerCase().includes(needle) ||
      row.email.toLowerCase().includes(needle)
    );
  });

  filtered = [...filtered].sort((a, b) => {
    if (sort === 'spend') {
      if (b.deducted !== a.deducted) return b.deducted - a.deducted;
    }
    return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
  });

  return filtered;
}

export default function TeamPage() {
  const { loading, error, errorCode, data, reload } = useMemberDashboard();
  const [q, setQ] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [sort, setSort] = React.useState('name');
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    setPage(1);
  }, [q, status, sort]);

  if (loading) {
    return (
      <MemberShell active="team" member={null}>
        <Loading />
      </MemberShell>
    );
  }

  if (error) {
    return (
      <MemberShell active="team" member={data?.member || null} offline={errorCode === 'core_unavailable'}>
        <MemberErrorState message={error} code={errorCode} onRetry={reload} />
      </MemberShell>
    );
  }

  const { member, subAccounts = [], credits = null } = data || {};
  const ownerName = displayName(member, 'Owner');
  const ownerTone = STATUS_TONE[member?.status] || 'is-warn';
  const people = buildPeople({ member, subAccounts, credits, q, status, sort });

  const totalPages = Math.max(1, Math.ceil(people.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageRows = people.slice(start, start + PAGE_SIZE);
  const rangeEnd = people.length === 0 ? 0 : Math.min(start + PAGE_SIZE, people.length);

  return (
    <MemberShell active="team" member={member}>
      <div className="dash">
        <header className="section-page-head">
          <h1 className="section-page-title">Team</h1>
          <p className="section-page-sub">
            Organization owner and sub-accounts. Credits are spent from the owner wallet.
          </p>
        </header>

        <section className="dash-card team-owner">
          <div className="team-owner__row">
            <div className="team-owner__who">
              <span className="dash-account__avatar" aria-hidden="true">
                {(ownerName[0] || '?').toUpperCase()}
              </span>
              <div>
                <p className="team-owner__name">
                  {ownerName}
                  <span className="dash-usage__tag">Owner</span>
                </p>
                <p className="team-owner__email mono">{member?.email || '—'}</p>
              </div>
            </div>
            <span className={`dash-badge ${ownerTone}`}>{member?.status || 'Active'}</span>
          </div>
          <dl className="team-owner__meta">
            <div>
              <dt>Company</dt>
              <dd>{member?.companyName || '—'}</dd>
            </div>
            <div>
              <dt>Account</dt>
              <dd>{member?.accountName || '—'}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{member?.phone || '—'}</dd>
            </div>
            <div>
              <dt>Team size</dt>
              <dd>
                {1 + subAccounts.length}{' '}
                {1 + subAccounts.length === 1 ? 'person' : 'people'}
              </dd>
            </div>
          </dl>
        </section>

        <section className="dash-card">
          <div className="dash-card__head">
            <h2 className="dash-card__title">People</h2>
            <span className="dash-count">{1 + subAccounts.length}</span>
          </div>

          <div className="team-controls">
            <label className="team-controls__search">
              <span className="visually-hidden">Search people</span>
              <input
                type="search"
                placeholder="Search name or email"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </label>
            <label>
              <span className="visually-hidden">Status</span>
              <LedgerSelect
                aria-label="Status"
                value={status}
                onValueChange={setStatus}
                options={STATUS_FILTERS}
                placeholder="All statuses"
              />
            </label>
            <label>
              <span className="visually-hidden">Sort</span>
              <LedgerSelect
                aria-label="Sort"
                value={sort}
                onValueChange={setSort}
                options={SORT_OPTIONS}
                placeholder="Sort"
              />
            </label>
          </div>

          {people.length === 0 ? (
            <p className="dash-empty">
              {q.trim() || status
                ? 'No people match your filters.'
                : 'No teammates yet. Invites will appear here once you add them.'}
            </p>
          ) : (
            <>
              <div className="team-table-wrap team-table-wrap--desktop">
                <table className="team-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Credits used</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((row) => (
                      <tr key={row.key}>
                        <td>
                          <span className="team-table__name">
                            {row.name}
                            {row.isOwner ? (
                              <span className="dash-usage__tag">Owner</span>
                            ) : null}
                          </span>
                        </td>
                        <td className="mono">{row.email || '—'}</td>
                        <td>
                          <span className={`dash-badge ${statusTone(row.status)}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="team-table__spend">
                          {row.deducted.toLocaleString()}
                        </td>
                        <td>
                          <a
                            href={creditsHref(row.userKey)}
                            className="team-table__link"
                          >
                            View in Credits
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <ul className="team-cards team-cards--mobile">
                {pageRows.map((row) => (
                  <li key={row.key} className="team-card">
                    <div className="team-card__top">
                      <div>
                        <span className="team-card__name">
                          {row.name}
                          {row.isOwner ? (
                            <span className="dash-usage__tag">Owner</span>
                          ) : null}
                        </span>
                        <span className="team-card__email mono">{row.email || '—'}</span>
                      </div>
                      <span className={`dash-badge ${statusTone(row.status)}`}>
                        {row.status}
                      </span>
                    </div>
                    <div className="team-card__foot">
                      <span>{row.deducted.toLocaleString()} credits used</span>
                      <a href={creditsHref(row.userKey)} className="team-table__link">
                        View in Credits
                      </a>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="team-pager">
                <span>
                  Showing {start + 1}–{rangeEnd} of {people.length}
                </span>
                <div className="team-pager__btns">
                  <button
                    type="button"
                    className="dash-link-btn dash-link-btn--ghost"
                    disabled={safePage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="dash-link-btn dash-link-btn--ghost"
                    disabled={safePage >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </MemberShell>
  );
}
