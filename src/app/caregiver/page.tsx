import React from 'react';
import { GenAIChat } from '@/components/chat/GenAIChat';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function CaregiverPortal() {
  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--accent)' }}>Caregiver Support Portal</h1>
        <Link href="/">
          <Button variant="secondary" size="sm">Back to Home</Button>
        </Link>
      </div>
      
      <div className="animate-fade-in">
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Welcome. We&apos;re here to support you. Chat below for help with burnout prevention, boundary setting, and crisis de-escalation scripts.
        </p>
        
        <GenAIChat userRole="caregiver" />
      </div>
    </div>
  );
}
