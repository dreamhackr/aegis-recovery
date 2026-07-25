import { GoogleGenAI } from '@google/genai';
import { retrieveProtocols } from '../src/lib/medicalProtocols';

async function verifyAI() {
  console.log("=== VERIFYING GenAI END-TO-END INTERACTION ===");

  if (!process.env.GEMINI_API_KEY) {
    console.error("❌ ERROR: GEMINI_API_KEY is missing in .env.local");
    process.exit(1);
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const testMessage = "I am having a really hard time today, I feel overwhelmed and anxious.";
  console.log(`\nUser Input: "${testMessage}"`);

  // 1. Verify RAG protocol retrieval
  const retrievedContext = retrieveProtocols(testMessage);
  if (retrievedContext) {
    console.log(`✅ RAG successfully retrieved Medical Protocols based on keywords:\n${retrievedContext.trim().split('\n')[0]}...`);
  } else {
    console.log(`⚠️ RAG did not find matching protocols. (Expected for non-trigger phrases)`);
  }

  // 2. Build the System Instruction
  let systemInstruction = '';
  if (retrievedContext) {
    systemInstruction += `\n\n=== RELEVANT MEDICAL PROTOCOLS (USE THESE TO GUIDE YOUR RESPONSE) ===\n${retrievedContext}\n=================================================================\n\n`;
  }
  
  systemInstruction += `You are the Aegis-Recovery AI, a high-engagement, satisfying, and rewarding recovery assistant for individuals navigating substance use disorders (SUD). Your goal is to prevent app fatigue by providing engaging micro-learning, interactive activities, and medical recovery methods. Validate their feelings, offer emotional stabilization, and help track withdrawal symptoms. Rotate your conversation styles and keep responses concise but deeply empathetic.`;
  const schemaInstruction = `\n\nIMPORTANT: You must respond in valid JSON format ONLY, using the following structure: {"response": "your conversational response to the user", "riskScore": integer between 0 and 100 representing the user's current risk of relapse or psychological distress based on their latest message}`;

  console.log("\nSending prompt to Gemini API with JSON schema enforcement...");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: [
        {
          role: 'user',
          parts: [{ text: testMessage }],
        }
      ],
      config: {
        systemInstruction: systemInstruction + schemaInstruction,
        temperature: 0.7,
        responseMimeType: 'application/json',
      },
    });

    const rawResponse = response.text || "";
    console.log(`\nRaw GenAI Output:\n${rawResponse}`);
    
    // 3. Verify JSON Parsing and Structure
    const parsed = JSON.parse(rawResponse);
    
    if (parsed.response && typeof parsed.riskScore === 'number') {
      console.log(`\n✅ SUCCESS: GenAI successfully returned structured JSON.`);
      console.log(`- Parsed AI Response: "${parsed.response}"`);
      console.log(`- Calculated Risk Score: ${parsed.riskScore}/100`);
      
      if (parsed.riskScore > 50) {
        console.log(`- Alert System: This score would successfully trigger the Clinician dashboard warning.`);
      }
    } else {
      console.error("\n❌ ERROR: JSON was parsed but is missing required fields ('response', 'riskScore').");
      process.exit(1);
    }
    
    console.log("\n🎉 ALL AI SYSTEMS FUNCTIONAL!");

  } catch (error) {
    console.error("\n❌ FATAL ERROR interacting with Gemini:", error);
    process.exit(1);
  }
}

verifyAI();
