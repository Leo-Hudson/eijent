import SignupForm from '@/components/SignupForm';

export const metadata = {
  title: 'Create your company account — Eijent',
  description: 'Sign up as the main member for your company on Eijent.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/signup' },
};

export default function SignupPage() {
  return (
    <div className="signup-page">
      <div className="signup-page__glow" aria-hidden="true" />
      <div className="signup-shell">
        <header className="signup-brand">
          <img src="/assets/mark-static.png" alt="Eijent" className="signup-brand__mark" width={56} height={56} />
          <p className="signup-brand__name">Eijent</p>
          <h1 className="signup-brand__title">Choose a plan &amp; create your account</h1>
          <p className="signup-brand__sub">
            Pick a plan, set up your company, and you&rsquo;ll invite sub-accounts once you&rsquo;re in.
          </p>
        </header>
        <SignupForm />
      </div>
    </div>
  );
}
