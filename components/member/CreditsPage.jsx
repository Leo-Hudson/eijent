'use client';

import React from 'react';
import MemberShell from '@/components/member/MemberShell';
import CreditLedger from '@/components/CreditLedger';
import { useMemberDashboard } from '@/hooks/useMemberDashboard';

export default function CreditsPage() {
  const { loading, error, data } = useMemberDashboard();

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
      <MemberShell active="credits" member={null}>
        <div className="dash-error" role="alert">
          <p>{error}</p>
        </div>
      </MemberShell>
    );
  }

  return (
    <MemberShell active="credits" member={data?.member}>
      <CreditLedger embedded />
    </MemberShell>
  );
}
