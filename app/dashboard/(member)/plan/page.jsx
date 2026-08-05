import { redirect } from 'next/navigation';
import PlanPage from '@/components/member/PlanPage';
import { readSessionToken } from '@/lib/session';

export const metadata = {
  title: 'Plan — Eijent',
  description: 'Your Eijent subscription, modules, and limits.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/dashboard/plan' },
};

export default async function PlanRoute() {
  const token = await readSessionToken();
  if (!token) {
    redirect('/login?next=/dashboard/plan');
  }

  return (
    <div className="dash-page">
      <div className="dash-page__glow" aria-hidden="true" />
      <div className="dash-shell dash-shell--member">
        <PlanPage />
      </div>
    </div>
  );
}
