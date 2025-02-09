import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const devices = pgTable("devices", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // "light", "thermostat", "switch"
  room: text("room").notNull(),
  state: boolean("state").notNull().default(false),
  value: integer("value"), // For devices with numerical values like thermostats
});

export const scenes = pgTable("scenes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  devices: text("devices").array().notNull(), // Array of device IDs
  states: boolean("states").array().notNull(), // Array of states matching devices
});

export const insertDeviceSchema = createInsertSchema(devices).omit({ id: true });
export const insertSceneSchema = createInsertSchema(scenes).omit({ id: true });

export type Device = typeof devices.$inferSelect;
export type Scene = typeof scenes.$inferSelect;
export type InsertDevice = z.infer<typeof insertDeviceSchema>;
export type InsertScene = z.infer<typeof insertSceneSchema>;
