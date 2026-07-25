import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ClinicianDashboard() {
  // Mock Data
  const patients = [
    { id: 1, name: 'Alex Johnson', type: 'Patient', riskScore: 85, status: 'High Risk' },
    { id: 2, name: 'Sarah Smith', type: 'Caregiver', riskScore: 40, status: 'Stable' },
  ];

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--danger)' }}>Medical Practitioner Dashboard</h1>
        <Link href="/">
          <Button variant="secondary" size="sm">Logout</Button>
        </Link>
      </div>

      <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <Card title="Active Patients & Caregivers">
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
                          background: p.riskScore > 75 ? 'var(--danger)' : 'var(--secondary)'
                        }}></div>
                      </div>
                      <span style={{ fontSize: '0.875rem' }}>{p.riskScore}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 0', color: p.status === 'High Risk' ? 'var(--danger)' : 'var(--secondary)' }}>
                    {p.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
