import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface VoiceControlOptions {
  onCommand: (command: string) => void;
  commands: string[];
}

export function useVoiceControl({ onCommand, commands }: VoiceControlOptions) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const { toast } = useToast();

  const processCommand = useCallback((text: string) => {
    const lowerText = text.toLowerCase();
    for (const command of commands) {
      if (lowerText.includes(command.toLowerCase())) {
        onCommand(text);
        return;
      }
    }
  }, [commands, onCommand]);

  useEffect(() => {
    let recognition: any = null;

    if (!('webkitSpeechRecognition' in window)) {
      toast({
        title: "Not Supported",
        description: "Voice recognition is not supported in this browser",
        duration: 3000,
      });
      return;
    }

    const initializeRecognition = () => {
      // @ts-ignore - WebkitSpeechRecognition is not in TypeScript's lib
      recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        toast({
          title: "Listening",
          description: "Speak your command...",
          duration: 2000,
        });
      };

      recognition.onresult = (event: any) => {
        const last = event.results.length - 1;
        const text = event.results[last][0].transcript;
        setTranscript(text);

        if (event.results[last].isFinal) {
          processCommand(text);
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'aborted') {
          // This is an expected error when we stop listening
          return;
        }

        console.error('Speech recognition error', event.error);
        toast({
          title: "Error",
          description: "Failed to recognize speech",
          duration: 2000,
        });
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        recognition = null;
      };
    };

    if (isListening && !recognition) {
      initializeRecognition();
      try {
        recognition.start();
      } catch (error) {
        console.error('Failed to start recognition:', error);
        setIsListening(false);
      }
    }

    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (error) {
          console.error('Failed to stop recognition:', error);
        }
      }
    };
  }, [isListening, processCommand, toast]);

  return {
    isListening,
    transcript,
    startListening: () => setIsListening(true),
    stopListening: () => setIsListening(false),
    toggleListening: () => setIsListening(prev => !prev)
  };
}