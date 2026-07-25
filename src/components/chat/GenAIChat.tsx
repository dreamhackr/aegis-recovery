'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Use functional state update to avoid stale closure over `messages`
  const handleSend = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    const userMessage: Message = { role: 'user', content: text };
    
    // Use functional updater to get latest messages without stale closure
    let newMessages: Message[] = [];
    setMessages(prev => {
      newMessages = [...prev, userMessage];
      return newMessages;
    });
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
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
        
        if (data.riskScore !== undefined && data.riskScore > 80) {
          setShowEmergencyModal(true);
        }
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  }, [userRole]);

  const handleVoiceTranscript = useCallback((text: string) => {
    handleSend(text);
  }, [handleSend]);

  return (
    <>
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

      {showEmergencyModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '2rem',
          backdropFilter: 'blur(8px)'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '500px',
            width: '100%',
            border: '2px solid var(--danger)',
            textAlign: 'center',
            padding: '3rem 2rem'
          }}>
            <span style={{ fontSize: '4rem' }}>🚨</span>
            <h2 style={{ color: 'var(--danger)', marginTop: '1rem' }}>Critical Risk Detected</h2>
            <p style={{ color: 'var(--text-main)', margin: '1.5rem 0' }}>
              Your safety is our top priority. The system has detected a high-risk situation. 
              Please reach out for professional help immediately.
            </p>
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
              <strong style={{ fontSize: '1.25rem', color: 'var(--danger)' }}>Call or Text: 988</strong>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>National Suicide & Crisis Lifeline (Available 24/7)</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Button onClick={() => setShowEmergencyModal(false)} variant="secondary" size="sm">
                Close Alert
              </Button>
              <a href="tel:988">
                <Button variant="danger" size="sm">
                  Call 988 Now
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
