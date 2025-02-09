
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash } from "lucide-react";

export default function Settings() {
  const [command, setCommand] = useState('');
  const [devices, setDevices] = useState([
    { id: 1, name: 'Smart Light', type: 'light', room: 'Living Room' },
    { id: 2, name: 'Smart TV', type: 'tv', room: 'Living Room' },
  ]);

  const sendCommand = async () => {
    try {
      await fetch('/api/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
      });
      setCommand('');
    } catch (error) {
      console.error('Failed to send command:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Device Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add New Device
            </Button>
            
            <div className="space-y-2">
              {devices.map(device => (
                <div key={device.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <h3 className="font-medium">{device.name}</h3>
                    <p className="text-sm text-white/70">{device.room}</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Command Center</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Enter command..."
            />
            <Button onClick={sendCommand}>Send</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
