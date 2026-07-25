import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="container" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', minHeight: '100vh' }}>
      <div className="animate-fade-in" style={{ maxWidth: '800px', width: '100%' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--primary)' }}>Welcome to Aegis-Recovery</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>
          A secure, supportive space for both individuals in recovery and their caregivers.
          Please select your path to begin.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <Card interactive={true} className="onboarding-card">
            <h2 style={{ color: 'var(--secondary)' }}>Patient in Recovery</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', flex: 1 }}>
              Focus on craving management, emotional stabilization, withdrawal tracking, and guided activities.
            </p>
            <Link href="/patient" style={{ display: 'block' }}>
              <Button fullWidth style={{ backgroundColor: 'var(--secondary)' }}>Enter Patient Portal</Button>
            </Link>
          </Card>

          <Card interactive={true} className="onboarding-card">
            <h2 style={{ color: 'var(--accent)' }}>Family Caregiver</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', flex: 1 }}>
              Access tools for burnout prevention, boundary setting, self-care tracking, and crisis de-escalation.
            </p>
            <Link href="/caregiver" style={{ display: 'block' }}>
              <Button fullWidth style={{ backgroundColor: 'var(--accent)' }}>Enter Caregiver Portal</Button>
            </Link>
          </Card>
        </div>
        
        <div style={{ marginTop: '4rem' }}>
          <Link href="/clinician">
            <Button variant="secondary" size="sm">Clinician Access</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
