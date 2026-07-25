import { NextResponse } from 'next/server';
import { readDb } from '@/lib/db';

export async function GET() {
  try {
    const data = readDb();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
