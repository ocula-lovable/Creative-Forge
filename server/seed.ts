import { db } from "./db";
import { users, projects, assets, templates } from "@shared/schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Seeding database...");

  // Check if we have users, if not create a demo user
  const demoUserEmail = "demo@example.com";
  let [user] = await db.select().from(users).where(eq(users.email, demoUserEmail));

  if (!user) {
    console.log("Creating demo user...");
    [user] = await db.insert(users).values({
      username: "demo_user",
      email: demoUserEmail,
      firstName: "Demo",
      lastName: "User",
      credits: 500,
      tier: "pro",
    }).returning();
  }

  // Create a sample project
  const [project] = await db.insert(projects).values({
    userId: user.id,
    name: "Summer Campaign 2024",
    description: "Marketing assets for the upcoming summer sale",
  }).returning();

  // Create some sample assets
  await db.insert(assets).values([
    {
      userId: user.id,
      projectId: project.id,
      type: "video",
      status: "completed",
      url: "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4",
      prompt: "Cinematic shot of ocean waves crashing on a beach at sunset",
      duration: 15,
      aspectRatio: "16:9",
    },
    {
      userId: user.id,
      projectId: project.id,
      type: "image",
      status: "completed",
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000",
      prompt: "Abstract digital art with neon colors",
      aspectRatio: "1:1",
    },
    {
      userId: user.id,
      projectId: project.id,
      type: "avatar",
      status: "processing",
      prompt: "Professional spokesperson explaining the new product features",
      aspectRatio: "9:16",
    }
  ]);

  // Create templates
  await db.insert(templates).values([
    {
      name: "SaaS Explainer",
      category: "saas",
      structure: { scenes: 5, style: "minimalist", duration: 60 },
      thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=500",
    },
    {
      name: "Fitness Promo",
      category: "fitness",
      structure: { scenes: 8, style: "energetic", duration: 30 },
      thumbnailUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=500",
    },
    {
      name: "Product Showcase",
      category: "ecommerce",
      structure: { scenes: 4, style: "clean", duration: 15 },
      thumbnailUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=500",
    }
  ]);

  console.log("Database seeded successfully!");
}

seed().catch((err) => {
  console.error("Error seeding database:", err);
  process.exit(1);
});
