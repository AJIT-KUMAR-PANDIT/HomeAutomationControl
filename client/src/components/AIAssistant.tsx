import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Bot } from 'lucide-react';
import { useVoiceControl } from '@/hooks/useVoiceControl';
import { useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const commands = [
    'turn on lights',
    'turn off lights',
    'set temperature',
    'show devices',
    'show scenes',
  ];

  const handleCommand = async (command: string) => {
    toast({
      title: 'Voice Command Received',
      description: command,
      duration: 2000,
    });

    // Example command handling
    if (command.includes('turn on lights')) {
      await apiRequest('PATCH', '/api/devices/1', { state: true });
      queryClient.invalidateQueries({ queryKey: ['/api/devices'] });
    }
  };

  const { isListening, toggleListening } = useVoiceControl({
    onCommand: handleCommand,
    commands,
  });

  return (
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
                <p>Available commands:</p>
                <ul className="list-disc list-inside mt-2">
                  {commands.map((cmd) => (
                    <li key={cmd}>{cmd}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
