import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDeviceSchema, insertSceneSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  // Device routes
  app.get("/api/devices", async (_req, res) => {
    const devices = await storage.getDevices();
    res.json(devices);
  });

  app.get("/api/devices/:id", async (req, res) => {
    const device = await storage.getDevice(parseInt(req.params.id));
    if (!device) return res.status(404).json({ message: "Device not found" });
    res.json(device);
  });

  app.post("/api/devices", async (req, res) => {
    const result = insertDeviceSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid device data" });
    }
    const device = await storage.createDevice(result.data);
    res.json(device);
  });

  app.patch("/api/devices/:id", async (req, res) => {
    const { state, value } = req.body;
    try {
      const device = await storage.updateDevice(parseInt(req.params.id), state, value);
      res.json(device);

      // Mock MQTT publish
      console.log(`[MQTT] Publishing state change: ${device.name} -> ${state}`);
    } catch (error) {
      res.status(404).json({ message: "Device not found" });
    }
  });

  // History routes
  app.get("/api/history", async (_req, res) => {
    const history = await storage.getDeviceHistory();
    res.json(history);
  });

  app.post("/api/scenes", async (req, res) => {
    const result = insertSceneSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid scene data" });
    }
    const scene = await storage.createScene(result.data);
    res.json(scene);
  });

  app.post("/api/scenes/:id/activate", async (req, res) => {
    try {
      const devices = await storage.activateScene(parseInt(req.params.id));
      res.json(devices);
    } catch (error) {
      res.status(404).json({ message: "Scene not found" });
    }
  });

  app.get('/api/ping', (_, res) => res.send('pong')); // Added ping endpoint

  const httpServer = createServer(app);
  return httpServer;
}