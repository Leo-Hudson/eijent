import ResetPasswordForm from '@/components/ResetPasswordForm';

export const metadata = {
  title: 'Set a new password — Eijent',
  description: 'Choose a new password for your Eijent account.',
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage({ params }) {
  const { token } = await params;

  return (
    <div className="signup-page">
      <div className="signup-page__glow" aria-hidden="true" />
      <div className="signup-shell">
        <header className="signup-brand">
          <img
            src="/assets/mark-static.png"
            alt="Eijent"
            className="signup-brand__mark"
            width={56}
            height={56}
          />
          <p className="signup-brand__name">Eijent</p>
          <h1 className="signup-brand__title">Set a new password</h1>
          <p className="signup-brand__sub">
            Choose a password you have not used before. You will sign in with it right after.
          </p>
        </header>
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}
