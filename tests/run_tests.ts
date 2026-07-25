import { strict as assert } from 'assert';
import { hashPassword } from '../src/lib/db';
import { signToken, verifyToken } from '../src/lib/auth';
import { retrieveProtocols } from '../src/lib/medicalProtocols';

console.log("=== STARTING UNIT TESTS ===");

// 1. Test Authentication token generation and validation
function testAuthTokens() {
  console.log("Running Auth Token tests...");
  const mockSession = { id: 99, username: 'testuser', role: 'Patient' as const };
  const token = signToken(mockSession);
  assert(token.includes('.'), 'Token should contain payload and signature separated by dot');
  
  const verified = verifyToken(token);
  assert(verified !== null, 'Verified token should not be null');
  assert(verified?.username === 'testuser', 'Username should match original session');
  assert(verified?.id === 99, 'ID should match');
  
  const invalidToken = token + 'tamper';
  assert(verifyToken(invalidToken) === null, 'Tampered token must fail validation');
  console.log("✅ Auth Token tests passed.");
}

// 2. Test Medical Protocols RAG Engine
function testMedicalProtocols() {
  console.log("Running Medical Protocol tests...");
  
  const anxiousMessage = "I am feeling extremely anxious and having a panic attack";
  const anxiousRAG = retrieveProtocols(anxiousMessage);
  assert(anxiousRAG.includes('5-4-3-2-1 Technique'), 'Must retrieve grounding protocol for anxiety');
  
  const cravingMessage = "I have a strong urge and craving to use right now";
  const cravingRAG = retrieveProtocols(cravingMessage);
  assert(cravingRAG.includes('Urge Surfing'), 'Must retrieve urge surfing protocol for craving');
  
  const safeMessage = "I had a great day today!";
  const safeRAG = retrieveProtocols(safeMessage);
  assert(safeRAG === '', 'Must not retrieve protocols for non-triggering messages');
  console.log("✅ Medical Protocol tests passed.");
}

// 3. Test Password Hashing Utility
function testPasswordHashing() {
  console.log("Running Password Hashing tests...");
  const p1 = hashPassword('securepassword123');
  const p2 = hashPassword('securepassword123', p1.salt); // Reuse salt to verify same hash
  
  assert(p1.hash === p2.hash, 'Hashes should match if salts match');
  assert(p1.hash !== hashPassword('differentpassword', p1.salt).hash, 'Different passwords must yield different hashes');
  console.log("✅ Password Hashing tests passed.");
}

try {
  testAuthTokens();
  testMedicalProtocols();
  testPasswordHashing();
  console.log("🎉 ALL TESTS PASSED!");
} catch (error) {
  console.error("❌ TEST FAILED:", error);
  process.exit(1);
}
