import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { type Device } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { LightbulbIcon, ThermometerIcon, Mic } from "lucide-react";
import { motion } from "framer-motion";

interface DeviceCardProps {
  device: Device;
}

export default function DeviceCard({ device }: DeviceCardProps) {
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);
  const [isListening, setIsListening] = useState(false);

  async function updateDevice(state: boolean, value?: number) {
    setIsPending(true);
    try {
      await apiRequest("PATCH", `/api/devices/${device.id}`, { state, value });
      queryClient.invalidateQueries({ queryKey: ["/api/devices"] });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="backdrop-blur-lg bg-black/30 border-primary/20 hover:border-primary/40 transition-all">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                {device.type === "light" ? (
                  <LightbulbIcon className={`h-5 w-5 ${device.state ? "text-yellow-500" : "text-gray-400"}`} />
                ) : (
                  <ThermometerIcon className="h-5 w-5 text-blue-500" />
                )}
              </div>
              <div>
                <h3 className="font-medium text-lg">{device.name}</h3>
                <p className="text-sm text-muted-foreground">{device.room}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                className={`p-2 rounded-full transition-colors ${isListening ? 'bg-primary text-white' : 'bg-primary/10 hover:bg-primary/20'}`}
                onClick={() => setIsListening(!isListening)}
              >
                <Mic className="h-4 w-4" />
              </button>
              <Switch
                checked={device.state}
                disabled={isPending}
                onCheckedChange={(state) => updateDevice(state, device.value)}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>

          {device.type === "thermostat" && (
            <motion.div 
              className="mt-4"
              initial={false}
              animate={{ opacity: device.state ? 1 : 0.5 }}
            >
              <Slider
                disabled={isPending || !device.state}
                min={60}
                max={80}
                step={1}
                value={[device.value ?? 72]}
                onValueChange={([value]) => updateDevice(device.state, value)}
                className="bg-primary/10"
              />
              <div className="text-center mt-2 font-mono">
                {device.value}°F
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}