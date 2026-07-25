'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface PatientRecord {
  id: number;
  name: string;
  type: 'Patient' | 'Caregiver';
  riskScore: number;
  status: 'Stable' | 'Monitor' | 'Critical Alert';
  lastUpdated: string;
}

export default function ClinicianDashboard() {
  const router = useRouter();
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  const updateScores = useCallback(async () => {
    try {
      const res = await fetch('/api/clinician/patients');
      if (res.ok) {
        const data: PatientRecord[] = await res.json();
        if (Array.isArray(data)) {
          setPatients(data);
          setLastRefreshed(new Date().toLocaleTimeString());
        }
      } else if (res.status === 401 || res.status === 403) {
        router.push('/login');
      }
    } catch (error) {
      console.error("Failed to fetch patients data", error);
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch {
      console.error("Logout failed");
    }
  };

  useEffect(() => {
    // Initial fetch on mount — setState inside effect is intentional for data loading
    // eslint-disable-next-line react-hooks/set-state-in-effect
    updateScores();
    const interval = setInterval(updateScores, 5000);
    return () => clearInterval(interval);
  }, [updateScores]);

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: 'var(--danger)' }}>Medical Practitioner Dashboard</h1>
          {lastRefreshed && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
              Live refresh: {lastRefreshed}
            </p>
          )}
        </div>
        <Button onClick={handleLogout} variant="secondary" size="sm">Logout</Button>
      </div>

      <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <Card title="Active Patients & Caregivers">
          {patients.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', padding: '2rem 0', textAlign: 'center' }}>
              No patient records found. Users will appear here after they register and interact with the AI.
            </p>
          ) : (
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                  <th style={{ padding: '1rem 0' }}>Name</th>
                  <th style={{ padding: '1rem 0' }}>Role</th>
                  <th style={{ padding: '1rem 0' }}>Risk Score</th>
                  <th style={{ padding: '1rem 0' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {patients.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <td style={{ padding: '1rem 0' }}>{p.name}</td>
                    <td style={{ padding: '1rem 0' }}>{p.type}</td>
                    <td style={{ padding: '1rem 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ 
                          width: '100%', 
                          height: '8px', 
                          background: 'var(--bg-darker)', 
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{ 
                            width: `${p.riskScore}%`, 
                            height: '100%', 
                            background: p.riskScore > 75 ? 'var(--danger)' : p.riskScore > 50 ? 'orange' : 'var(--secondary)',
                            transition: 'width 0.5s ease'
                          }}></div>
                        </div>
                        <span style={{ fontSize: '0.875rem', minWidth: '2rem' }}>{p.riskScore}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 0', color: p.status === 'Critical Alert' ? 'var(--danger)' : p.status === 'Monitor' ? 'orange' : 'var(--secondary)', fontWeight: 'bold' }}>
                      {p.status}
                      {p.status === 'Critical Alert' && <span style={{ marginLeft: '0.5rem' }}>🚨</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        <Card title="GenAI Parameter Tuning (Global)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Empathy Engine Override</label>
              <input type="range" min="1" max="100" defaultValue="80" style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Crisis Routing Threshold</label>
              <input type="range" min="1" max="100" defaultValue="75" style={{ width: '100%' }} />
            </div>
            <Button fullWidth style={{ marginTop: '1rem' }}>Apply New Parameters</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
