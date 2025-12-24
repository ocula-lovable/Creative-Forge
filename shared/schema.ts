import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email"),
  credits: integer("credits").default(100), // Default 100 credits
  tier: text("tier").default("starter"), // free, starter, pro
  createdAt: timestamp("created_at").defaultNow(),
});

// Projects
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Assets (Videos, Images, Audio, Scripts)
export const assets = pgTable("assets", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id), // Can be null if not in a project yet
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // 'video', 'image', 'audio', 'script', 'avatar'
  url: text("url"), // Storage URL or External URL
  prompt: text("prompt"), // The prompt used to generate it
  status: text("status").default("pending"), // pending, processing, completed, failed
  providerId: text("provider_id"), // ID from Replicate/OpenAI
  metadata: jsonb("metadata"), // Extra data (resolution, duration, etc.)
  createdAt: timestamp("created_at").defaultNow(),
});

// Templates
export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // 'fitness', 'saas', etc.
  structure: jsonb("structure").notNull(), // The template JSON structure
  thumbnailUrl: text("thumbnail_url"),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  assets: many(assets),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  assets: many(assets),
}));

export const assetsRelations = relations(assets, ({ one }) => ({
  project: one(projects, {
    fields: [assets.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [assets.userId],
    references: [users.id],
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, credits: true, tier: true });
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true, userId: true });
export const insertAssetSchema = createInsertSchema(assets).omit({ id: true, createdAt: true, status: true, providerId: true, userId: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Asset = typeof assets.$inferSelect;
export type InsertAsset = z.infer<typeof insertAssetSchema>;

// API Types
export type GenerateAssetRequest = {
  projectId?: number;
  type: 'video' | 'image' | 'text' | 'avatar';
  prompt: string;
  style?: string;
  duration?: number; // for video
  aspectRatio?: string;
};

export type AssetResponse = Asset;
