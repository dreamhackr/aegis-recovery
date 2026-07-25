'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { VoiceInput } from '../ui/VoiceInput';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface GenAIChatProps {
  userRole: 'patient' | 'caregiver';
}

export const GenAIChat: React.FC<GenAIChatProps> = ({ userRole }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Hello! I'm your Aegis-Recovery companion. How are you feeling today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, userRole })
      });
      
      const data = await res.json();
      
      if (data.error) {
        setMessages([...newMessages, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
      } else {
        setMessages([...newMessages, { role: 'assistant', content: data.content }]);
        
        // Mock sending the risk score to the backend/clinician dashboard
        if (data.riskScore !== undefined) {
          try {
            // We use localStorage to mock a database for the clinician dashboard
            const key = userRole === 'patient' ? 'mockPatientRisk' : 'mockCaregiverRisk';
            localStorage.setItem(key, data.riskScore.toString());
            
            // Dispatch a custom event so the dashboard can update in real-time if open in same browser
            window.dispatchEvent(new Event('storage'));
          } catch {
            console.error("Could not save mock risk score");
          }
        }
      }
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'Connection error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceTranscript = (text: string) => {
    handleSend(text);
  };

  return (
    <Card className="chat-container" style={{ display: 'flex', flexDirection: 'column', height: '600px', padding: '0' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.role === 'user' ? 'var(--primary)' : 'var(--card-bg)',
              border: msg.role === 'user' ? 'none' : '1px solid var(--card-border)',
              padding: '1rem 1.5rem',
              borderRadius: '20px',
              borderBottomRightRadius: msg.role === 'user' ? '0' : '20px',
              borderBottomLeftRadius: msg.role === 'assistant' ? '0' : '20px',
              maxWidth: '80%',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}
          >
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div style={{ alignSelf: 'flex-start', padding: '1rem', color: 'var(--text-muted)' }}>
            Typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: '1.5rem', borderTop: '1px solid var(--card-border)', display: 'flex', gap: '1rem', background: 'rgba(0,0,0,0.2)', borderBottomLeftRadius: 'var(--radius)', borderBottomRightRadius: 'var(--radius)' }}>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
          placeholder="Type or speak your message..."
          style={{
            flex: 1,
            padding: '1rem 1.5rem',
            borderRadius: '50px',
            border: '1px solid var(--card-border)',
            background: 'var(--bg-darker)',
            color: 'var(--text-main)',
            outline: 'none',
            fontSize: '1rem'
          }}
        />
        <VoiceInput onTranscript={handleVoiceTranscript} isListening={isListening} setIsListening={setIsListening} />
        <Button onClick={() => handleSend(input)} style={{ borderRadius: '50px' }}>
          Send
        </Button>
      </div>
    </Card>
  );
};
