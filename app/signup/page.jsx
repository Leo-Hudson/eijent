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
        <SignupForm />
      </div>
    </div>
  );
}
