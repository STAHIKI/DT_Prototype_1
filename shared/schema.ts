import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const digitalTwins = pgTable("digital_twins", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // 'architecture', 'industrial', 'agriculture'
  userId: integer("user_id").references(() => users.id),
  status: text("status").notNull().default("active"), // 'active', 'inactive', 'processing'
  properties: jsonb("properties"), // dimensions, materials, etc.
  modelPath: text("model_path"), // path to 3D model file
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const iotDevices = pgTable("iot_devices", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'temperature', 'humidity', 'power', 'vibration'
  location: text("location").notNull(),
  twinId: integer("twin_id").references(() => digitalTwins.id),
  status: text("status").notNull().default("connected"), // 'connected', 'disconnected'
  lastValue: real("last_value"),
  unit: text("unit"), // '°C', '%', 'kW', etc.
  lastUpdate: timestamp("last_update").defaultNow(),
});

export const workflowTemplates = pgTable("workflow_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  price: real("price").notNull().default(0),
  rating: real("rating").notNull().default(0),
  downloads: integer("downloads").notNull().default(0),
  imagePath: text("image_path"),
  template: jsonb("template"), // workflow configuration
  createdAt: timestamp("created_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  userId: integer("user_id").references(() => users.id),
  twinId: integer("twin_id").references(() => digitalTwins.id),
  progress: integer("progress").notNull().default(0),
  status: text("status").notNull().default("active"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  role: true,
});

export const insertDigitalTwinSchema = createInsertSchema(digitalTwins).pick({
  name: true,
  description: true,
  type: true,
  userId: true,
  properties: true,
});

export const insertIotDeviceSchema = createInsertSchema(iotDevices).pick({
  name: true,
  type: true,
  location: true,
  twinId: true,
  unit: true,
});

export const insertWorkflowTemplateSchema = createInsertSchema(workflowTemplates).pick({
  name: true,
  category: true,
  description: true,
  price: true,
  template: true,
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  name: true,
  type: true,
  userId: true,
  twinId: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type DigitalTwin = typeof digitalTwins.$inferSelect;
export type InsertDigitalTwin = z.infer<typeof insertDigitalTwinSchema>;

export type IotDevice = typeof iotDevices.$inferSelect;
export type InsertIotDevice = z.infer<typeof insertIotDeviceSchema>;

export type WorkflowTemplate = typeof workflowTemplates.$inferSelect;
export type InsertWorkflowTemplate = z.infer<typeof insertWorkflowTemplateSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
