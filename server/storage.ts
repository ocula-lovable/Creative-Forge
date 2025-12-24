import { db } from "./db";
import {
  users, projects, assets, templates,
  type User, type InsertUser,
  type Project, type InsertProject,
  type Asset, type InsertAsset
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserCredits(id: number, credits: number): Promise<User>;

  // Projects
  getProjects(userId: number): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject & { userId: number }): Promise<Project>;

  // Assets
  getAssets(userId: number, projectId?: number): Promise<Asset[]>;
  getAsset(id: number): Promise<Asset | undefined>;
  createAsset(asset: InsertAsset & { userId: number }): Promise<Asset>;
  updateAssetStatus(id: number, status: string, url?: string): Promise<Asset>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserCredits(id: number, credits: number): Promise<User> {
    const [user] = await db.update(users)
      .set({ credits })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getProjects(userId: number): Promise<Project[]> {
    return await db.select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(desc(projects.createdAt));
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(project: InsertProject & { userId: number }): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async getAssets(userId: number, projectId?: number): Promise<Asset[]> {
    let query = db.select().from(assets).where(eq(assets.userId, userId));
    
    if (projectId) {
      query = db.select().from(assets).where(
        eq(assets.projectId, projectId)
      );
    }
    
    return await query.orderBy(desc(assets.createdAt));
  }

  async getAsset(id: number): Promise<Asset | undefined> {
    const [asset] = await db.select().from(assets).where(eq(assets.id, id));
    return asset;
  }

  async createAsset(asset: InsertAsset & { userId: number }): Promise<Asset> {
    const [newAsset] = await db.insert(assets).values(asset).returning();
    return newAsset;
  }

  async updateAssetStatus(id: number, status: string, url?: string): Promise<Asset> {
    const [updated] = await db.update(assets)
      .set({ status, url })
      .where(eq(assets.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
