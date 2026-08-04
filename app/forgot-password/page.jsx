import ForgotPasswordForm from '@/components/ForgotPasswordForm';

export const metadata = {
  title: 'Reset your password — Eijent',
  description: 'Request a link to reset your Eijent password.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/forgot-password' },
};

export default function ForgotPasswordPage() {
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
          <h1 className="signup-brand__title">Reset your password</h1>
          <p className="signup-brand__sub">
            Enter the email on your account and we will send you a link to set a new password.
          </p>
        </header>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
