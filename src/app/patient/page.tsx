import React from 'react';
import { GenAIChat } from '@/components/chat/GenAIChat';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function PatientPortal() {
  // Simple rotating content based on the day of the year
  const activities = [
    { title: "Mindfulness Breathing", description: "Take 5 minutes to focus on deep, rhythmic breathing to center yourself." },
    { title: "Gratitude Journaling", description: "Write down three things you are grateful for today, no matter how small." },
    { title: "Physical Grounding", description: "Practice the 5-4-3-2-1 grounding technique to reconnect with the present moment." },
    { title: "Creative Expression", description: "Spend 10 minutes drawing, writing, or listening to music that reflects your mood." },
    { title: "Gentle Stretching", description: "Perform light stretches to release physical tension built up from cravings." }
  ];
  
  // Calculate a consistent index for the day
  const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const dailyActivity = activities[dayOfYear % activities.length];

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--secondary)' }}>Patient Recovery Portal</h1>
        <Link href="/">
          <Button variant="secondary" size="sm">Back to Home</Button>
        </Link>
      </div>
      
      <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        <div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Welcome. Your AI companion is here to support you with craving management, emotional stabilization, and guided activities. Speak freely—you are safe here.
          </p>
          <GenAIChat userRole="patient" />
        </div>
        
        <Card title={`🌟 Today's Guided Activity: ${dailyActivity.title}`}>
          <p style={{ color: 'var(--text-muted)' }}>{dailyActivity.description}</p>
        </Card>
      </div>
    </div>
  );
}
