import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Bot } from 'lucide-react';
import { useVoiceControl } from '@/hooks/useVoiceControl';
import { useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const commands = [
    'luna',
    'turn on lights',
    'turn off lights',
    'set temperature',
    'show devices',
    'show scenes',
    'go to home'
  ];

  const handleCommand = async (command: string) => {
    const commandLower = command.toLowerCase();

    // Check for wake word
    if (!commandLower.includes('luna')) {
      return;
    }

    // Provide feedback that we heard the command
    toast({
      title: 'Voice Command Received',
      description: command,
      duration: 2000,
    });

    try {
      setIsAssistantSpeaking(true);

      // Navigation commands
      if (commandLower.includes('show devices')) {
        setLocation('/devices');
        return;
      }
      if (commandLower.includes('show scenes')) {
        setLocation('/scenes');
        return;
      }
      if (commandLower.includes('go to home')) {
        setLocation('/');
        return;
      }

      // Device control commands
      if (commandLower.includes('turn on lights')) {
        const result = await apiRequest('PATCH', '/api/devices/1', { state: true });
        if (result.ok) {
          toast({
            title: 'Success',
            description: 'Lights turned on',
            duration: 2000,
          });
          queryClient.invalidateQueries({ queryKey: ['/api/devices'] });
        }
      }

      if (commandLower.includes('turn off lights')) {
        const result = await apiRequest('PATCH', '/api/devices/1', { state: false });
        if (result.ok) {
          toast({
            title: 'Success',
            description: 'Lights turned off',
            duration: 2000,
          });
          queryClient.invalidateQueries({ queryKey: ['/api/devices'] });
        }
      }

      // Temperature control
      if (commandLower.includes('set temperature')) {
        // Extract number from command if present
        const match = command.match(/\d+/);
        if (match) {
          const temperature = parseInt(match[0]);
          const result = await apiRequest('PATCH', '/api/devices/3', { 
            state: true,
            value: temperature 
          });
          if (result.ok) {
            toast({
              title: 'Success',
              description: `Temperature set to ${temperature}°F`,
              duration: 2000,
            });
            queryClient.invalidateQueries({ queryKey: ['/api/devices'] });
          }
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to execute command',
        duration: 2000,
      });
    } finally {
      setIsAssistantSpeaking(false);
    }
  };

  const { isListening, toggleListening } = useVoiceControl({
    onCommand: handleCommand,
    commands,
  });

  return (
    <>
      {/* Voice Recognition Animation */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <img 
              src="/attached_assets/listen.gif" 
              alt="Listening"
              className="w-32 h-32 pointer-events-none"
            />
          </motion.div>
        )}
        {isAssistantSpeaking && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <img 
              src="/attached_assets/speak.gif" 
              alt="Speaking"
              className="w-32 h-32 pointer-events-none"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Assistant Button */}
      <motion.div 
        className="fixed bottom-20 right-4 md:bottom-4 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
      >
        <motion.button
          className={`
            w-12 h-12 rounded-full flex items-center justify-center
            ${isOpen ? 'bg-primary text-primary-foreground' : 'bg-primary/10 hover:bg-primary/20'}
            transition-colors shadow-lg backdrop-blur-sm
          `}
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.95 }}
        >
          <Bot className="w-6 h-6" />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute bottom-full mb-4 right-0 w-64 p-4 rounded-lg bg-black/30 backdrop-blur-lg border border-primary/20"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">AI Assistant</h3>
                  <button
                    className={`p-2 rounded-full ${isListening ? 'bg-primary text-white' : 'bg-primary/10 hover:bg-primary/20'}`}
                    onClick={toggleListening}
                  >
                    {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </button>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>Say "Luna" followed by:</p>
                  <ul className="list-disc list-inside mt-2">
                    {commands.filter(cmd => cmd !== 'luna').map((cmd) => (
                      <li key={cmd}>{cmd}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}