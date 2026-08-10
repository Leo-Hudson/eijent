import { redirect } from 'next/navigation';
import BillingPage from '@/components/member/BillingPage';
import { readSessionToken } from '@/lib/session';

export const metadata = {
  title: 'Billing — Eijent',
  description: 'Billing summary for your Eijent subscription.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/dashboard/billing' },
};

export default async function BillingRoute() {
  const token = await readSessionToken();
  if (!token) {
    redirect('/login?next=/dashboard/billing');
  }

  return (
    <div className="dash-page">
      <div className="dash-page__glow" aria-hidden="true" />
      <div className="dash-shell dash-shell--member">
        <BillingPage />
      </div>
    </div>
  );
}
