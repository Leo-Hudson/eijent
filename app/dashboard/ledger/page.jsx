import { redirect } from 'next/navigation';
import CreditLedger from '@/components/CreditLedger';
import { readSessionToken } from '@/lib/session';

export const metadata = {
  title: 'Credit Ledger — Eijent',
  description: 'Audit every credit movement across your organization.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/dashboard/ledger' },
};

export default async function CreditLedgerPage() {
  const token = await readSessionToken();
  if (!token) {
    redirect('/login?next=/dashboard/ledger');
  }

  return (
    <div className="dash-page">
      <div className="dash-page__glow" aria-hidden="true" />
      <div className="dash-shell dash-shell--wide">
        <CreditLedger />
      </div>
    </div>
  );
}
