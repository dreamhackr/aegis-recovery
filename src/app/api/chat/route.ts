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
    
    if (userRole === 'patient') {
      systemInstruction = `You are the Aegis-Recovery AI, a high-engagement, satisfying, and rewarding recovery assistant for individuals navigating substance use disorders (SUD). Your goal is to prevent app fatigue by providing engaging micro-learning, interactive activities, and medical recovery methods. Validate their feelings, offer emotional stabilization, and help track withdrawal symptoms. Rotate your conversation styles and keep responses concise but deeply empathetic.`;
    } else if (userRole === 'caregiver') {
      systemInstruction = `You are the Aegis-Recovery AI, a supportive assistant for family caregivers of individuals with substance use disorders (SUD). Your focus is on burnout prevention, boundary setting, self-care, and providing crisis de-escalation scripts. Be deeply empathetic, practical, and highly engaging.`;
    } else {
      systemInstruction = `You are the Aegis-Recovery AI.`;
    }

    const lastMessage = messages[messages.length - 1].content;
    const previousMessages = messages.slice(0, -1).map((msg: any) => ({
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
        systemInstruction,
        temperature: 0.7,
      },
    });

    return NextResponse.json({ 
      role: 'assistant',
      content: response.text 
    });

  } catch (error: any) {
    console.error("GenAI Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
