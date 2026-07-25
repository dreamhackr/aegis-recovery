'use client';

import React from 'react';
import { GenAIChat } from '@/components/chat/GenAIChat';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function CaregiverPortal() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch {
      console.error("Logout failed");
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--accent)' }}>Caregiver Support Portal</h1>
        <Button onClick={handleLogout} variant="secondary" size="sm">Logout</Button>
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
