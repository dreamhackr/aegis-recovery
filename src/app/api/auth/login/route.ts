import { NextResponse } from 'next/server';
import { readDb, hashPassword } from '@/lib/db';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    if (!username || !password) {
      return NextResponse.json({ error: "Missing username or password" }, { status: 400 });
    }

    const db = readDb();
    const user = db.users.find(u => u.username.toLowerCase() === username.toLowerCase());
    
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const { hash } = hashPassword(password, user.salt);
    if (hash !== user.passwordHash) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken({
      id: user.id,
      username: user.username,
      role: user.role
    });

    const response = NextResponse.json({ success: true, role: user.role });
    
    // Set HTTP-Only Cookie
    response.cookies.set('aegis_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/'
    });

    return response;

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
