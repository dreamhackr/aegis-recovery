import { NextResponse } from 'next/server';
import { readDb } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  try {
    // Verify the caller is an authenticated Clinician
    const cookieStore = await cookies();
    const token = cookieStore.get('aegis_session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = verifyToken(token);
    if (!session || session.role !== 'Clinician') {
      return NextResponse.json({ error: 'Forbidden: Clinician access only' }, { status: 403 });
    }

    const data = readDb();
    // Return ONLY session monitoring data — never expose users/passwords
    return NextResponse.json(data.sessions);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
