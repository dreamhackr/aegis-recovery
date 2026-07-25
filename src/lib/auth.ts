import crypto from 'crypto';

const SECRET_KEY = process.env.SESSION_SECRET || 'aegis-recovery-super-secret-key-12345';

export interface SessionData {
  id: number;
  username: string;
  role: 'Patient' | 'Caregiver' | 'Clinician';
}

export function signToken(data: SessionData): string {
  const payload = Buffer.from(JSON.stringify(data)).toString('base64');
  const signature = crypto.createHmac('sha256', SECRET_KEY).update(payload).digest('hex');
  return `${payload}.${signature}`;
}

export function verifyToken(token: string): SessionData | null {
  try {
    const [payload, signature] = token.split('.');
    if (!payload || !signature) return null;
    
    const expectedSignature = crypto.createHmac('sha256', SECRET_KEY).update(payload).digest('hex');
    if (signature !== expectedSignature) return null;
    
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
    return decoded as SessionData;
  } catch (error) {
    console.error("Token verification failed", error);
    return null;
  }
}
