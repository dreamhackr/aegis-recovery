import fs from 'fs';
import path from 'path';

const DB_PATH = process.env.NODE_ENV === 'production' 
  ? '/tmp/aegis_db.json' 
  : path.join(process.cwd(), 'aegis_db.json');

export interface UserSession {
  id: number;
  name: string;
  type: 'Patient' | 'Caregiver';
  riskScore: number;
  status: 'Stable' | 'Monitor' | 'Critical Alert';
  lastUpdated: string;
}

const defaultData: UserSession[] = [
  { id: 1, name: 'Alex Johnson', type: 'Patient', riskScore: 10, status: 'Stable', lastUpdated: new Date().toISOString() },
  { id: 2, name: 'Sarah Smith', type: 'Caregiver', riskScore: 15, status: 'Stable', lastUpdated: new Date().toISOString() },
];

function initDb() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2));
  }
}

export function readDb(): UserSession[] {
  initDb();
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read database file", error);
    return defaultData;
  }
}

export function writeDb(data: UserSession[]) {
  initDb();
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Failed to write to database file", error);
  }
}

export function updateRiskScore(userType: 'patient' | 'caregiver', riskScore: number) {
  const db = readDb();
  const targetType = userType === 'patient' ? 'Patient' : 'Caregiver';
  
  const updated = db.map(user => {
    if (user.type === targetType) {
      const status: "Stable" | "Monitor" | "Critical Alert" = riskScore > 80 ? 'Critical Alert' : riskScore > 50 ? 'Monitor' : 'Stable';
      return {
        ...user,
        riskScore,
        status,
        lastUpdated: new Date().toISOString()
      };
    }
    return user;
  });
  
  writeDb(updated);
}
