'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  isListening: boolean;
  setIsListening: (val: boolean) => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, isListening, setIsListening }) => {
  const [supportVoice, setSupportVoice] = useState(true);
  const recognitionRef = useRef<unknown>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as unknown as { SpeechRecognition: unknown }).SpeechRecognition || (window as unknown as { webkitSpeechRecognition: unknown }).webkitSpeechRecognition;
      if (SpeechRecognition) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognitionRef.current = new (SpeechRecognition as any)();
        (recognitionRef.current as { continuous: boolean }).continuous = false;
        (recognitionRef.current as { interimResults: boolean }).interimResults = false;
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (recognitionRef.current as any).onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          onTranscript(transcript);
          setIsListening(false);
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (recognitionRef.current as any).onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (recognitionRef.current as any).onend = () => {
          setIsListening(false);
        };
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSupportVoice(false);
      }
    }
  }, [onTranscript, setIsListening]);

  useEffect(() => {
    if (recognitionRef.current) {
      if (isListening) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (recognitionRef.current as any).start();
        } catch {
          console.log("Already listening");
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (recognitionRef.current as any).stop();
      }
    }
  }, [isListening]);

  if (!supportVoice) {
    return <div style={{ color: 'var(--text-muted)' }}>Voice input not supported in this browser.</div>;
  }

  return (
    <Button 
      variant={isListening ? 'danger' : 'primary'} 
      onClick={() => setIsListening(!isListening)}
      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '50px', padding: '1rem' }}
    >
      <svg 
        width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" x2="12" y1="19" y2="22" />
      </svg>
      {isListening ? 'Listening...' : 'Tap to Speak'}
    </Button>
  );
};
