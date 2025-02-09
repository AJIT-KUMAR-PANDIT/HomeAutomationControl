import { type Device, type InsertDevice, type Scene, type InsertScene } from "@shared/schema";

export interface IStorage {
  // Device operations
  getDevices(): Promise<Device[]>;
  getDevice(id: number): Promise<Device | undefined>;
  createDevice(device: InsertDevice): Promise<Device>;
  updateDevice(id: number, state: boolean, value?: number): Promise<Device>;
  
  // Scene operations
  getScenes(): Promise<Scene[]>;
  getScene(id: number): Promise<Scene | undefined>;
  createScene(scene: InsertScene): Promise<Scene>;
  activateScene(id: number): Promise<Device[]>;
}

export class MemStorage implements IStorage {
  private devices: Map<number, Device>;
  private scenes: Map<number, Scene>;
  private deviceId: number;
  private sceneId: number;

  constructor() {
    this.devices = new Map();
    this.scenes = new Map();
    this.deviceId = 1;
    this.sceneId = 1;
    
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
