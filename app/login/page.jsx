import LoginForm from '@/components/LoginForm';

export const metadata = {
  title: 'Sign in — Eijent',
  description: 'Sign in to your Eijent account.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/login' },
};

export default function LoginPage() {
  return (
    <div className="signup-page">
      <div className="signup-page__glow" aria-hidden="true" />
      <div className="signup-shell">
        <header className="signup-brand">
          <img src="/assets/mark-static.png" alt="Eijent" className="signup-brand__mark" width={56} height={56} />
          <p className="signup-brand__name">Eijent</p>
          <h1 className="signup-brand__title">Welcome back</h1>
          <p className="signup-brand__sub">Sign in to manage your plan and sub-accounts.</p>
        </header>
        <LoginForm />
      </div>
    </div>
  );
}
