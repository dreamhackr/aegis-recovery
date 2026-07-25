import React from 'react';
import { GenAIChat } from '@/components/chat/GenAIChat';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function PatientPortal() {
  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--secondary)' }}>Patient Recovery Portal</h1>
        <Link href="/">
          <Button variant="secondary" size="sm">Back to Home</Button>
        </Link>
      </div>
      
      <div className="animate-fade-in">
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Welcome. Your AI companion is here to support you with craving management, emotional stabilization, and guided activities. Speak freely—you are safe here.
        </p>
        
        <GenAIChat userRole="patient" />
      </div>
    </div>
  );
}
