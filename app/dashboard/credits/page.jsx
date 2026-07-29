import { redirect } from 'next/navigation';
import CreditsPage from '@/components/member/CreditsPage';
import { readSessionToken } from '@/lib/session';

export const metadata = {
  title: 'Credits — Eijent',
  description: 'Available credits and credit ledger.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/dashboard/credits' },
};

export default async function CreditsRoute() {
  const token = await readSessionToken();
  if (!token) {
    redirect('/login?next=/dashboard/credits');
  }

  return (
    <div className="dash-page">
      <div className="dash-page__glow" aria-hidden="true" />
      <div className="dash-shell dash-shell--member">
        <CreditsPage />
      </div>
    </div>
  );
}
