import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

const isAuthorized = (authHeader) => authHeader && authHeader === process.env.REVALIDATE_TOKEN;

export async function GET(req) {
  const authHeader = req.headers.get('authorization');

  if (!isAuthorized(authHeader)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await revalidatePath('/', 'layout');

    return NextResponse.json({ message: "Site Invalidation successful" });
  } catch (error) {
    return NextResponse.json({ message: 'Error revalidating', error: error.message }, { status: 500 });
  }
}
