'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Patient' | 'Caregiver' | 'Clinician'>('Patient');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !role) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role })
      });

      const data = await res.json();
      if (res.ok) {
        if (role === 'Patient') router.push('/patient');
        else if (role === 'Caregiver') router.push('/caregiver');
        else if (role === 'Clinician') router.push('/clinician');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('Connection failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="animate-fade-in" style={{ maxWidth: '450px', width: '100%' }}>
        <Card title="Create Aegis Account">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {error && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '1rem', borderRadius: '8px', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}
            <div>
              <label htmlFor="username" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Username</label>
              <input 
                id="username"
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose username"
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--card-border)',
                  background: 'var(--bg-darker)',
                  color: 'var(--text-main)',
                  outline: 'none'
                }}
              />
            </div>
            <div>
              <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Password</label>
              <input 
                id="password"
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose password"
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--card-border)',
                  background: 'var(--bg-darker)',
                  color: 'var(--text-main)',
                  outline: 'none'
                }}
              />
            </div>
            <div>
              <label htmlFor="role" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Role</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as 'Patient' | 'Caregiver' | 'Clinician')}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--card-border)',
                  background: 'var(--bg-darker)',
                  color: 'var(--text-main)',
                  outline: 'none'
                }}
              >
                <option value="Patient">Patient in Recovery</option>
                <option value="Caregiver">Family Caregiver</option>
                <option value="Clinician">Clinician / Medical Practitioner</option>
              </select>
            </div>
            <Button type="submit" fullWidth disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Register'}
            </Button>
            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
              Already have an account? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Sign In here</Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
