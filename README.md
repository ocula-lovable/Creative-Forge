# Creative Forge - AI Content Generation Platform

A complete, production-ready AI-powered content generation platform for creating UGC videos, ads, images, avatars, and more.

**Live Demo**: [Creative Forge](https://creative-forge.lovable.app)
**API Docs**: [API Reference](https://api.creative-forge.render.com/docs)

## 🎯 Features

### Core Generation Features
- **AI UGC Video Generator** - Generate videos from text prompts (1-60 minutes)
- **AI Ad Generator** - Platform-specific ads for TikTok, Instagram, YouTube, Facebook
- **AI Image Generator** - Text-to-image for ads, posters, thumbnails
- **AI Avatar & Talking Head Videos** - Create speaking videos with AI avatars
- **Text-to-Speech & Voiceovers** - Multi-language speech synthesis
- **Video Editor** - Professional timeline-based video editing
- **Template Library** - Reusable templates for quick content creation
- **Project Management** - Organize and manage all your content
- **Analytics & History** - Track your generation usage
- **Subscription Plans** - Credit-based system with tiered pricing

## 🛠 Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for bundling
- Tailwind CSS for styling
- React Router for navigation
- Axios for HTTP requests

### Backend
- FastAPI with Python 3.11
- PostgreSQL for persistent data
- Redis for caching & job queues
- Supabase for cloud storage
- Stripe for payments

### External Services
- Replicate (video generation)
- OpenAI (scripts & content)
- HeyGen (avatars)
- ElevenLabs (text-to-speech)
- Stability AI (images)
- Stripe (payments)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Docker & Docker Compose (optional)
- Git

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env. local
# Update .env.local with your API URL
npm run dev