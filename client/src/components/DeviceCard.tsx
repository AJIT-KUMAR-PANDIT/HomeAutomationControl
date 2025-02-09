import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { type Device } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { LightbulbIcon, ThermometerIcon } from "lucide-react";

interface DeviceCardProps {
  device: Device;
}

export default function DeviceCard({ device }: DeviceCardProps) {
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

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
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {device.type === "light" ? (
              <LightbulbIcon className={`h-5 w-5 ${device.state ? "text-yellow-500" : "text-gray-400"}`} />
            ) : (
              <ThermometerIcon className="h-5 w-5 text-blue-500" />
            )}
            <div>
              <h3 className="font-medium">{device.name}</h3>
              <p className="text-sm text-muted-foreground">{device.room}</p>
            </div>
          </div>
          
          <Switch
            checked={device.state}
            disabled={isPending}
            onCheckedChange={(state) => updateDevice(state, device.value)}
          />
        </div>

        {device.type === "thermostat" && (
          <div className="mt-4">
            <Slider
              disabled={isPending || !device.state}
              min={60}
              max={80}
              step={1}
              value={[device.value ?? 72]}
              onValueChange={([value]) => updateDevice(device.state, value)}
            />
            <div className="text-center mt-2">
              {device.value}°F
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
