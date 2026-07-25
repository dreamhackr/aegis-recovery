import { NextResponse } from 'next/server';
import { readDb, writeDb, hashPassword } from '@/lib/db';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, password, role } = await request.json();
    if (!username || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!['Patient', 'Caregiver', 'Clinician'].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const db = readDb();
    const existing = db.users.find(u => u.username.toLowerCase() === username.toLowerCase());
    
    if (existing) {
      return NextResponse.json({ error: "Username already exists" }, { status: 400 });
    }

    const { hash, salt } = hashPassword(password);
    const newUserId = db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1;

    const newUser = {
      id: newUserId,
      username,
      passwordHash: hash,
      salt,
      role: role as 'Patient' | 'Caregiver' | 'Clinician'
    };

    db.users.push(newUser);

    // If Patient or Caregiver, also add to session records for clinician monitoring
    if (role === 'Patient' || role === 'Caregiver') {
      db.sessions.push({
        id: db.sessions.length > 0 ? Math.max(...db.sessions.map(s => s.id)) + 1 : 1,
        name: username,
        type: role as 'Patient' | 'Caregiver',
        riskScore: 10, // Initial default score
        status: 'Stable',
        lastUpdated: new Date().toISOString()
      });
    }

    writeDb(db);

    const token = signToken({
      id: newUserId,
      username,
      role: role as 'Patient' | 'Caregiver' | 'Clinician'
    });

    const response = NextResponse.json({ success: true, role });
    
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
