import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SECRET_KEY = process.env.SESSION_SECRET || 'aegis-recovery-hmac-secret-key-prod-v1-2026';

// HMAC-SHA256 verification using Web Crypto API (Edge Runtime compatible)
async function verifyTokenEdge(token: string): Promise<{ id: number; username: string; role: string } | null> {
  try {
    const [payloadBase64, signature] = token.split('.');
    if (!payloadBase64 || !signature) return null;

    // Import key for HMAC
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(SECRET_KEY),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    // Sign the payload and compare
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(payloadBase64));
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    if (signature !== expectedSignature) return null;

    const decodedStr = atob(payloadBase64);
    return JSON.parse(decodedStr);
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('aegis_session')?.value;
  const url = request.nextUrl.clone();

  if (!token) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  const session = await verifyTokenEdge(token);
  if (!session) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Role-based route protection
  if (url.pathname.startsWith('/patient') && session.role !== 'Patient') {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
  if (url.pathname.startsWith('/caregiver') && session.role !== 'Caregiver') {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
  if (url.pathname.startsWith('/clinician') && session.role !== 'Clinician') {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/patient', '/caregiver', '/clinician'],
};
