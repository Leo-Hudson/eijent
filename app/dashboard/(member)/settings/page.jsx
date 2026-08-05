import { redirect } from 'next/navigation';
import SettingsPage from '@/components/member/SettingsPage';
import { readSessionToken } from '@/lib/session';

export const metadata = {
  title: 'Settings — Eijent',
  description: 'Manage your Eijent profile and password.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/dashboard/settings' },
};

export default async function SettingsRoute() {
  const token = await readSessionToken();
  if (!token) {
    redirect('/login?next=/dashboard/settings');
  }

  return (
    <div className="dash-page">
      <div className="dash-page__glow" aria-hidden="true" />
      <div className="dash-shell dash-shell--member">
        <SettingsPage />
      </div>
    </div>
  );
}
