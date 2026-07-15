import { redirect } from 'next/navigation';
import Dashboard from '@/components/Dashboard';
import { readSessionToken } from '@/lib/session';

export const metadata = {
  title: 'Dashboard — Eijent',
  description: 'Your Eijent account, plan, and sub-accounts.',
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
      <div className="dash-shell">
        <Dashboard />
      </div>
    </div>
  );
}
