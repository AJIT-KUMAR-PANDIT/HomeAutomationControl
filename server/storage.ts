import { type Device, type InsertDevice, type Scene, type InsertScene } from "@shared/schema";

interface DeviceHistory {
  id: number;
  deviceId: number;
  deviceName: string;
  action: string;
  timestamp: Date;
}

export interface IStorage {
  // Device operations
  getDevices(): Promise<Device[]>;
  getDevice(id: number): Promise<Device | undefined>;
  createDevice(device: InsertDevice): Promise<Device>;
  updateDevice(id: number, state: boolean, value?: number): Promise<Device>;
  getDeviceHistory(): Promise<DeviceHistory[]>;
  
  // Scene operations
  getScenes(): Promise<Scene[]>;
  getScene(id: number): Promise<Scene | undefined>;
  createScene(scene: InsertScene): Promise<Scene>;
  activateScene(id: number): Promise<Device[]>;
}

export class MemStorage implements IStorage {
  private devices: Map<number, Device>;
  private deviceHistory: DeviceHistory[];
  private deviceId: number;

  constructor() {
    this.devices = new Map();
    this.deviceHistory = [
      {
        id: 1,
        deviceId: 1,
        deviceName: "Living Room Light",
        action: "Turned Off",
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        id: 2,
        deviceId: 2,
        deviceName: "Kitchen Light",
        action: "Turned On",
        timestamp: new Date(Date.now() - 7200000)
      }
    ];
    this.deviceId = 1;
    
    // Add some sample devices
    this.createDevice({ name: "Living Room Light", type: "light", room: "Living Room", state: false });
    this.createDevice({ name: "Kitchen Light", type: "light", room: "Kitchen", state: false });
    this.createDevice({ name: "Bedroom Thermostat", type: "thermostat", room: "Bedroom", state: true, value: 72 });
  }

  async getDevices(): Promise<Device[]> {
    return Array.from(this.devices.values());
  }

  async getDevice(id: number): Promise<Device | undefined> {
    return this.devices.get(id);
  }

  async createDevice(insertDevice: InsertDevice): Promise<Device> {
    const id = this.deviceId++;
    const device: Device = { ...insertDevice, id };
    this.devices.set(id, device);
    return device;
  }

  async updateDevice(id: number, state: boolean, value?: number): Promise<Device> {
    const device = await this.getDevice(id);
    if (!device) throw new Error("Device not found");
    
    const updatedDevice = { ...device, state, value: value ?? device.value };
    this.devices.set(id, updatedDevice);
    
    this.deviceHistory.push({
      id: this.deviceHistory.length + 1,
      deviceId: id,
      deviceName: device.name,
      action: state ? "Turned On" : "Turned Off",
      timestamp: new Date()
    });
    
    return updatedDevice;
  }

  async getScenes(): Promise<Scene[]> {
    return Array.from(this.scenes.values());
  }

  async getScene(id: number): Promise<Scene | undefined> {
    return this.scenes.get(id);
  }

  async createScene(insertScene: InsertScene): Promise<Scene> {
    const id = this.sceneId++;
    const scene: Scene = { ...insertScene, id };
    this.scenes.set(id, scene);
    return scene;
  }

  async getDeviceHistory(): Promise<DeviceHistory[]> {
    return this.deviceHistory.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async activateScene(id: number): Promise<Device[]> {
    const scene = await this.getScene(id);
    if (!scene) throw new Error("Scene not found");
    
    const updatedDevices: Device[] = [];
    for (let i = 0; i < scene.devices.length; i++) {
      const deviceId = parseInt(scene.devices[i]);
      const state = scene.states[i];
      const device = await this.updateDevice(deviceId, state);
      updatedDevices.push(device);
    }
    
    return updatedDevices;
  }
}

export const storage = new MemStorage();
