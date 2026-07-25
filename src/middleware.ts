import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('aegis_session')?.value;
  const url = request.nextUrl.clone();

  if (!token) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  try {
    const [payloadBase64] = token.split('.');
    if (!payloadBase64) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    
    // Use atob which is fully supported in Edge Runtime
    const decodedStr = atob(payloadBase64);
    const decoded = JSON.parse(decodedStr);

    if (url.pathname.startsWith('/patient') && decoded.role !== 'Patient') {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    if (url.pathname.startsWith('/caregiver') && decoded.role !== 'Caregiver') {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    if (url.pathname.startsWith('/clinician') && decoded.role !== 'Clinician') {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  } catch (error) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/patient', '/caregiver', '/clinician'],
};
