import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get('aegis_session')?.value;

  if (token) {
    const session = verifyToken(token);
    if (session) {
      if (session.role === 'Patient') redirect('/patient');
      if (session.role === 'Caregiver') redirect('/caregiver');
      if (session.role === 'Clinician') redirect('/clinician');
    }
  }

  return (
    <div className="container" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', minHeight: '100vh' }}>
      <div className="animate-fade-in" style={{ maxWidth: '800px', width: '100%' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>Aegis-Recovery</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>
          Multi-Modal GenAI Recovery & Prevention Web Platform.
          Evidence-based craving management, caregiver support, and real-time clinical monitoring.
        </p>

        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginBottom: '3rem' }}>
          <Link href="/login">
            <Button size="lg">Sign In</Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="secondary">Create Account</Button>
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <Card className="onboarding-card">
            <h2 style={{ color: 'var(--secondary)' }}>For Patients</h2>
            <p style={{ color: 'var(--text-muted)' }}>
              Craving Urge Surfing, grounding techniques, withdrawal monitoring, and zero-typing voice companion.
            </p>
          </Card>

          <Card className="onboarding-card">
            <h2 style={{ color: 'var(--accent)' }}>For Caregivers</h2>
            <p style={{ color: 'var(--text-muted)' }}>
              Burnout prevention prompts, loving boundaries tracker, self-care pivot routines, and crisis de-escalation scripts.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
