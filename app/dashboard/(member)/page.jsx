import { redirect } from 'next/navigation';
import OverviewPage from '@/components/member/OverviewPage';
import { readSessionToken } from '@/lib/session';

export const metadata = {
  title: 'Dashboard — Eijent',
  description: 'Your Eijent account overview.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/dashboard' },
};

export default async function DashboardPage() {
  const token = await readSessionToken();
  if (!token) {
    redirect('/login?next=/dashboard');
  }

  return (
    <div className="dash-page">
      <div className="dash-page__glow" aria-hidden="true" />
      <div className="dash-shell dash-shell--member">
        <OverviewPage />
      </div>
    </div>
  );
}
