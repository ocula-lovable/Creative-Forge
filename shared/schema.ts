import { sql } from "drizzle-orm";
import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (Mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// Users (Merged schema: Auth + App fields)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`), // Auth uses varchar IDs
  username: text("username").unique(), // Optional in Auth, but good to have
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  credits: integer("credits").default(100), // App specific
  tier: text("tier").default("starter"), // App specific
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Projects
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(), // Changed to varchar to match users.id
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Assets (Videos, Images, Audio, Scripts)
export const assets = pgTable("assets", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id), // Can be null if not in a project yet
  userId: varchar("user_id").references(() => users.id).notNull(), // Changed to varchar
  type: text("type").notNull(), // 'video', 'image', 'text', 'avatar'
  url: text("url"), // Storage URL or External URL
  prompt: text("prompt"), // The prompt used to generate it
  style: text("style"),
  duration: integer("duration"),
  aspectRatio: text("aspect_ratio"),
  status: text("status").default("pending"), // pending, processing, completed, failed
  providerId: text("provider_id"), // ID from Replicate/OpenAI
  metadata: jsonb("metadata"), // Extra data
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
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true, credits: true, tier: true });
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true, userId: true });
export const insertAssetSchema = createInsertSchema(assets).omit({ id: true, createdAt: true, status: true, providerId: true, userId: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = InsertUser; // Alias for Auth integration compatibility
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

// Chat models (from chat integration, adding here to consolidate)
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
