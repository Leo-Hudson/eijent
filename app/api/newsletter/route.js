import { NextResponse } from 'next/server';

const CORE_API_BASE_URL = process.env.CORE_API_BASE_URL || '';
const CORE_API_KEY = process.env.CORE_API_KEY || '';
const FORM_ID = process.env.EIJENT_NEWSLETTER_FORM_ID || '';

const isValidEmail = (email) =>
  typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const POST = async (req) => {
  try {
    if (!CORE_API_BASE_URL || !CORE_API_KEY || !FORM_ID) {
      throw new Error('Newsletter is not configured (missing CORE_API_BASE_URL, CORE_API_KEY or EIJENT_NEWSLETTER_FORM_ID).');
    }

    const { email } = await req.json();
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const response = await fetch(`${CORE_API_BASE_URL}/api/form-submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${CORE_API_KEY}`,
      },
      body: JSON.stringify({
        form: FORM_ID,
        submissionData: [{ field: 'email', value: String(email).trim() }],
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`bps-core form-submissions error ${response.status}: ${detail}`);
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (process.env.DEBUG_LOGS === '1') console.error('[newsletter]', error);
    return NextResponse.json({ error: 'Failed to join the waitlist. Please try again.' }, { status: 500 });
  }
};
