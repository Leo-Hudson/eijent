import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Credit Ledger — Eijent',
  robots: { index: false, follow: false },
};

/** Legacy path: ledger now lives under Credits. */
export default function LegacyLedgerRedirect() {
  redirect('/dashboard/credits');
}
