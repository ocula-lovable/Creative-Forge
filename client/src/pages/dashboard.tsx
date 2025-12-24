import { useAuth } from "@/hooks/use-auth";
import { useProjects } from "@/hooks/use-projects";
import { useAssets } from "@/hooks/use-assets";
import { Layout } from "@/components/layout";
import { Card, Button } from "@/components/ui-components";
import { AssetCard } from "@/components/asset-card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Plus, ArrowRight, Video, Zap, Folder } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: projects } = useProjects();
  const { data: recentAssets, isLoading: assetsLoading } = useAssets();

  const stats = [
    { label: "Total Projects", value: projects?.length || 0, icon: Folder, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Generations", value: recentAssets?.length || 0, icon: Video, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Credits Left", value: user?.credits || 0, icon: Zap, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  ];

  // Mock data for the chart
  const data = [
    { name: 'Mon', generations: 4 },
    { name: 'Tue', generations: 3 },
    { name: 'Wed', generations: 7 },
    { name: 'Thu', generations: 5 },
    { name: 'Fri', generations: 9 },
    { name: 'Sat', generations: 2 },
    { name: 'Sun', generations: 4 },
  ];

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Welcome back, {user?.username}
          </h1>
          <p className="text-muted-foreground mt-1">Here's what's happening in your creative studio.</p>
        </div>
        <Link href="/generate">
          <Button variant="gradient" className="gap-2">
            <Plus className="w-4 h-4" />
            New Generation
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 flex items-center gap-4 hover:scale-[1.02] transition-transform cursor-default">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold font-display">{stat.value}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display">Recent Activity</h2>
            <Link href="/library" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          
          {assetsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-video rounded-2xl bg-slate-900/50 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentAssets?.slice(0, 4).map((asset) => (
                <AssetCard key={asset.id} asset={asset} />
              ))}
              {(!recentAssets || recentAssets.length === 0) && (
                <div className="col-span-2 h-48 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-muted-foreground gap-2">
                  <Video className="w-8 h-8 opacity-20" />
                  <p>No generations yet. Start creating!</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold font-display">Usage Trends</h2>
          <Card className="p-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#ffffff40" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#ffffff40" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff10', borderRadius: '8px' }}
                  cursor={{ fill: '#ffffff05' }}
                />
                <Bar 
                  dataKey="generations" 
                  fill="url(#colorGradient)" 
                  radius={[4, 4, 0, 0]} 
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-violet-900/50 to-indigo-900/50 border-violet-500/20">
            <h3 className="font-bold text-lg mb-2">Upgrade to Pro</h3>
            <p className="text-sm text-indigo-200 mb-4">Get 4K video generation, unlimited storage, and priority processing.</p>
            <Button className="w-full bg-white text-indigo-950 hover:bg-white/90">View Plans</Button>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
