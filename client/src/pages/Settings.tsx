
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { type Device } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash, ChevronDown, Pencil } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function Settings() {
  const [command, setCommand] = useState('');
  const { data: devices = [], isLoading } = useQuery<Device[]>({ 
    queryKey: ["/api/devices"]
  });
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [newDevice, setNewDevice] = useState({ name: '', type: '', room: '' });

  const queryClient = useQueryClient();
  
  const handleAddDevice = async () => {
    if (newDevice.name && newDevice.type && newDevice.room) {
      try {
        await apiRequest("POST", "/api/devices", newDevice);
        queryClient.invalidateQueries({ queryKey: ["/api/devices"] });
        setNewDevice({ name: '', type: '', room: '' });
      } catch (error) {
        console.error("Failed to add device:", error);
      }
    }
  };

  const handleUpdateDevice = async () => {
    if (editingDevice) {
      try {
        await apiRequest("PUT", `/api/devices/${editingDevice.id}`, editingDevice);
        queryClient.invalidateQueries({ queryKey: ["/api/devices"] });
        setEditingDevice(null);
      } catch (error) {
        console.error("Failed to update device:", error);
      }
    }
  };

  const handleDeleteDevice = async (id: number) => {
    try {
      await apiRequest("DELETE", `/api/devices/${id}`);
      queryClient.invalidateQueries({ queryKey: ["/api/devices"] });
    } catch (error) {
      console.error("Failed to delete device:", error);
    }
  };

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

  const faqs = [
    {
      question: "How do I add a new device?",
      answer: "Click the 'Add New Device' button and fill in the device details in the form that appears."
    },
    {
      question: "Can I control multiple devices at once?",
      answer: "Yes, you can create scenes or use voice commands to control multiple devices simultaneously."
    },
    {
      question: "How do I set up voice control?",
      answer: "Click the microphone icon in the bottom navigation and say 'Luna' followed by your command."
    },
    {
      question: "What should I do if a device is not responding?",
      answer: "Try refreshing the connection or removing and re-adding the device in the settings."
    }
  ];

  return (
    <div className="container mx-auto p-4 space-y-6 pb-20">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Device Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4">
              <Input 
                placeholder="Device Name"
                value={newDevice.name}
                onChange={(e) => setNewDevice({...newDevice, name: e.target.value})}
              />
              <Input 
                placeholder="Device Type"
                value={newDevice.type}
                onChange={(e) => setNewDevice({...newDevice, type: e.target.value})}
              />
              <Input 
                placeholder="Room"
                value={newDevice.room}
                onChange={(e) => setNewDevice({...newDevice, room: e.target.value})}
              />
              <Button onClick={handleAddDevice} className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add New Device
              </Button>
            </div>
            
            <div className="space-y-2">
              {devices.map(device => (
                <div key={device.id} className="flex items-center justify-between p-2 border rounded">
                  {editingDevice?.id === device.id ? (
                    <div className="flex-1 mr-2 space-y-2">
                      <Input
                        value={editingDevice.name}
                        onChange={(e) => setEditingDevice({...editingDevice, name: e.target.value})}
                        placeholder="Device Name"
                      />
                      <Input
                        value={editingDevice.type}
                        onChange={(e) => setEditingDevice({...editingDevice, type: e.target.value})}
                        placeholder="Device Type"
                      />
                      <Input
                        value={editingDevice.room}
                        onChange={(e) => setEditingDevice({...editingDevice, room: e.target.value})}
                        placeholder="Room"
                      />
                      <div className="flex gap-2">
                        <Button onClick={handleUpdateDevice}>Save</Button>
                        <Button variant="ghost" onClick={() => setEditingDevice(null)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <h3 className="font-medium">{device.name}</h3>
                        <p className="text-sm text-white/70">{device.room}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setEditingDevice(device)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteDevice(device.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
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

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
