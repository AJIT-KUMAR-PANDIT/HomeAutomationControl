import { useState, useEffect, useCallback } from 'react';

interface VoiceControlOptions {
  onCommand: (command: string) => void;
  commands: string[];
}

export function useVoiceControl({ onCommand, commands }: VoiceControlOptions) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const processCommand = useCallback((text: string) => {
    const lowerText = text.toLowerCase();
    for (const command of commands) {
      if (lowerText.includes(command.toLowerCase())) {
        onCommand(command);
        return;
      }
    }
  }, [commands, onCommand]);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return;
    }

    // @ts-ignore - WebkitSpeechRecognition is not in TypeScript's lib
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const text = event.results[last][0].transcript;
      setTranscript(text);
      processCommand(text);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    if (isListening) {
      recognition.start();
    }

    return () => {
      recognition.stop();
    };
  }, [isListening, processCommand]);

  return {
    isListening,
    transcript,
    startListening: () => setIsListening(true),
    stopListening: () => setIsListening(false),
    toggleListening: () => setIsListening(prev => !prev)
  };
}
