import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { messages, userRole } = await request.json();
    
    // Create the system instruction based on the user role (Patient or Caregiver)
    let systemInstruction = '';
    
    let schemaInstruction = '';
    if (userRole === 'patient') {
      systemInstruction = `You are the Aegis-Recovery AI, a high-engagement, satisfying, and rewarding recovery assistant for individuals navigating substance use disorders (SUD). Your goal is to prevent app fatigue by providing engaging micro-learning, interactive activities, and medical recovery methods. Validate their feelings, offer emotional stabilization, and help track withdrawal symptoms. Rotate your conversation styles and keep responses concise but deeply empathetic.`;
      schemaInstruction = `\n\nIMPORTANT: You must respond in valid JSON format ONLY, using the following structure: {"response": "your conversational response to the user", "riskScore": integer between 0 and 100 representing the user's current risk of relapse or psychological distress based on their latest message}`;
    } else if (userRole === 'caregiver') {
      systemInstruction = `You are the Aegis-Recovery AI, a supportive assistant for family caregivers of individuals with substance use disorders (SUD). Your focus is on burnout prevention, boundary setting, self-care, and providing crisis de-escalation scripts. Be deeply empathetic, practical, and highly engaging.`;
      schemaInstruction = `\n\nIMPORTANT: You must respond in valid JSON format ONLY, using the following structure: {"response": "your conversational response to the user", "riskScore": integer between 0 and 100 representing caregiver burnout or stress risk}`;
    } else {
      systemInstruction = `You are the Aegis-Recovery AI.`;
      schemaInstruction = `\n\nIMPORTANT: You must respond in valid JSON format ONLY, using the following structure: {"response": "your conversational response to the user", "riskScore": 0}`;
    }

    const lastMessage = messages[messages.length - 1].content;
    const previousMessages = messages.slice(0, -1).map((msg: { role: string, content: string }) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...previousMessages,
        {
          role: 'user',
          parts: [{ text: lastMessage }],
        }
      ],
      config: {
        systemInstruction: systemInstruction + schemaInstruction,
        temperature: 0.7,
        responseMimeType: 'application/json',
      },
    });

    let aiResponseText = "Sorry, I couldn't process that.";
    let riskScore = 0;
    
    try {
      if (response.text) {
        const parsed = JSON.parse(response.text);
        aiResponseText = parsed.response;
        riskScore = parsed.riskScore;
      }
    } catch (error) {
      console.error("Failed to parse JSON response from Gemini", error);
      aiResponseText = response.text || "Error processing response.";
    }

    return NextResponse.json({ 
      role: 'assistant',
      content: aiResponseText,
      riskScore: riskScore
    });

  } catch (error: unknown) {
    console.error("GenAI Error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
