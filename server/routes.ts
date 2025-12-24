import type { Express } from "express";
import type { Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

// Mock AI Generators since we might not have keys immediately
async function mockGenerate(type: string, prompt: string): Promise<{ url: string, duration?: number }> {
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  if (type === 'image') {
    return { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000' };
  } else if (type === 'video') {
    return { url: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4', duration: 5 };
  } else if (type === 'avatar') {
    return { url: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-video-call-4246-large.mp4', duration: 10 };
  }
  return { url: '' };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth
  setupAuth(app);

  // Projects
  app.get(api.projects.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const projects = await storage.getProjects(req.user.id);
    res.json(projects);
  });

  app.post(api.projects.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const input = api.projects.create.input.parse(req.body);
      const project = await storage.createProject({ ...input, userId: req.user.id });
      res.status(201).json(project);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.get(api.projects.get.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const project = await storage.getProject(Number(req.params.id));
    if (!project) return res.sendStatus(404);
    if (project.userId !== req.user.id) return res.sendStatus(403);
    res.json(project);
  });

  // Assets
  app.get(api.assets.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const projectId = req.query.projectId ? Number(req.query.projectId) : undefined;
    const assets = await storage.getAssets(req.user.id, projectId);
    res.json(assets);
  });

  // Generate Asset
  app.post(api.assets.generate.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const input = api.assets.generate.input.parse(req.body);
      
      // Check credits (Mock check)
      if (req.user.credits < 5) {
        return res.status(402).json({ message: "Insufficient credits" });
      }

      // Create 'pending' asset
      const asset = await storage.createAsset({
        userId: req.user.id,
        projectId: input.projectId,
        type: input.type,
        prompt: input.prompt,
        status: "processing",
        url: "",
      });

      // Deduct credits
      await storage.updateUserCredits(req.user.id, req.user.credits - 5);

      // Start generation (Async - normally would be a job queue)
      mockGenerate(input.type, input.prompt).then(async (result) => {
        await storage.updateAssetStatus(asset.id, "completed", result.url);
      }).catch(async () => {
        await storage.updateAssetStatus(asset.id, "failed");
      });

      // Return the pending asset immediately
      res.status(202).json(asset);

    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.get(api.auth.me.path, (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });

  return httpServer;
}
