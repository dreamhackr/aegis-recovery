import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DB_PATH = process.env.NODE_ENV === 'production' 
  ? '/tmp/aegis_db.json' 
  : path.join(process.cwd(), 'aegis_db.json');

export interface User {
  id: number;
  username: string;
  passwordHash: string;
  salt: string;
  role: 'Patient' | 'Caregiver' | 'Clinician';
}

export interface UserSession {
  id: number;
  name: string;
  type: 'Patient' | 'Caregiver';
  riskScore: number;
  status: 'Stable' | 'Monitor' | 'Critical Alert';
  lastUpdated: string;
}

export interface DbSchema {
  users: User[];
  sessions: UserSession[];
}

// Generate secure salt and hash password using Node's native crypto
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const secureSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, secureSalt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt: secureSalt };
}

// Seed data
const defaultSaltPatient = crypto.randomBytes(16).toString('hex');
const defaultSaltCaregiver = crypto.randomBytes(16).toString('hex');
const defaultSaltClinician = crypto.randomBytes(16).toString('hex');

const defaultDb: DbSchema = {
  users: [
    { 
      id: 1, 
      username: 'patient', 
      passwordHash: crypto.pbkdf2Sync('password123', defaultSaltPatient, 1000, 64, 'sha512').toString('hex'), 
      salt: defaultSaltPatient, 
      role: 'Patient' 
    },
    { 
      id: 2, 
      username: 'caregiver', 
      passwordHash: crypto.pbkdf2Sync('password123', defaultSaltCaregiver, 1000, 64, 'sha512').toString('hex'), 
      salt: defaultSaltCaregiver, 
      role: 'Caregiver' 
    },
    { 
      id: 3, 
      username: 'clinician', 
      passwordHash: crypto.pbkdf2Sync('password123', defaultSaltClinician, 1000, 64, 'sha512').toString('hex'), 
      salt: defaultSaltClinician, 
      role: 'Clinician' 
    }
  ],
  sessions: [
    { id: 1, name: 'patient', type: 'Patient', riskScore: 10, status: 'Stable', lastUpdated: new Date().toISOString() },
    { id: 2, name: 'caregiver', type: 'Caregiver', riskScore: 15, status: 'Stable', lastUpdated: new Date().toISOString() },
  ]
};

function initDb() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultDb, null, 2));
  }
}

export function readDb(): DbSchema {
  initDb();
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read database file", error);
    return defaultDb;
  }
}

export function writeDb(data: DbSchema) {
  initDb();
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Failed to write to database file", error);
  }
}

export function updateRiskScore(username: string, riskScore: number) {
  const db = readDb();
  
  const updatedSessions = db.sessions.map(sess => {
    if (sess.name === username) {
      const status: "Stable" | "Monitor" | "Critical Alert" = riskScore > 80 ? 'Critical Alert' : riskScore > 50 ? 'Monitor' : 'Stable';
      return {
        ...sess,
        riskScore,
        status,
        lastUpdated: new Date().toISOString()
      };
    }
    return sess;
  });
  
  writeDb({
    ...db,
    sessions: updatedSessions
  });
}
