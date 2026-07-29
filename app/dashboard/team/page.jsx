import { redirect } from 'next/navigation';
import TeamPage from '@/components/member/TeamPage';
import { readSessionToken } from '@/lib/session';

export const metadata = {
  title: 'Team — Eijent',
  description: 'Your Eijent team and sub-accounts.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/dashboard/team' },
};

export default async function TeamRoute() {
  const token = await readSessionToken();
  if (!token) {
    redirect('/login?next=/dashboard/team');
  }

  return (
    <div className="dash-page">
      <div className="dash-page__glow" aria-hidden="true" />
      <div className="dash-shell dash-shell--member">
        <TeamPage />
      </div>
    </div>
  );
}
