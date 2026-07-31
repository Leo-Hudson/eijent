'use client';

import React from 'react';
import MemberShell from '@/components/member/MemberShell';
import MemberErrorState from '@/components/member/MemberErrorState';
import MemberSoftActions from '@/components/member/MemberSoftActions';
import CreditsUsagePanel from '@/components/member/CreditsUsagePanel';
import CreditLedger from '@/components/CreditLedger';
import { useMemberDashboard } from '@/hooks/useMemberDashboard';

function readTab() {
  if (typeof window === 'undefined') return 'usage';
  const params = new URLSearchParams(window.location.search);
  const t = params.get('tab');
  if (t === 'ledger') return 'ledger';
  // Deep-link from Team "View in Credits" should open the ledger with user filter.
  if (params.get('user') || params.get('subAccountId')) return 'ledger';
  return 'usage';
}

export default function CreditsPage() {
  const { loading, error, errorCode, data, reload } = useMemberDashboard();
  const [tab, setTab] = React.useState(readTab);

  React.useEffect(() => {
    const onPop = () => setTab(readTab());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const selectTab = (next) => {
    setTab(next);
    const url = new URL(window.location.href);
    if (next === 'ledger') url.searchParams.set('tab', 'ledger');
    else url.searchParams.delete('tab');
    window.history.replaceState({}, '', url.pathname + url.search);
  };

  if (loading) {
    return (
      <MemberShell active="credits" member={null}>
        <div className="dash-loading" aria-busy="true">
          <div className="dash-skeleton dash-skeleton--head" />
          <div className="dash-skeleton" />
        </div>
      </MemberShell>
    );
  }

  if (error) {
    return (
      <MemberShell active="credits" member={data?.member || null} offline={errorCode === 'core_unavailable'}>
        <MemberErrorState message={error} code={errorCode} onRetry={reload} />
      </MemberShell>
    );
  }

  return (
    <MemberShell active="credits" member={data?.member}>
      <div className="dash credits-page">
        <header className="section-page-head">
          <h1 className="section-page-title">Credits</h1>
          <p className="section-page-sub">
            Usage analytics and the full credit ledger for your organization.
          </p>
        </header>

        <MemberSoftActions showCredits={false} />

        <div className="credits-tabs" role="tablist" aria-label="Credits sections">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'usage'}
            className={`credits-tab${tab === 'usage' ? ' is-active' : ''}`}
            onClick={() => selectTab('usage')}
          >
            Usage
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'ledger'}
            className={`credits-tab${tab === 'ledger' ? ' is-active' : ''}`}
            onClick={() => selectTab('ledger')}
          >
            Ledger
          </button>
        </div>

        {tab === 'usage' ? (
          <CreditsUsagePanel data={data} />
        ) : (
          <CreditLedger embedded />
        )}
      </div>
    </MemberShell>
  );
}
