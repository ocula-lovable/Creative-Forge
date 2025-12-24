import { Layout } from "@/components/layout";
import { Button, Input, Card } from "@/components/ui-components";
import { useState } from "react";
import { useGenerateAsset } from "@/hooks/use-assets";
import { useProjects } from "@/hooks/use-projects";
import { Video, Image as ImageIcon, Type, User, Sparkles, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Generators() {
  const [activeTab, setActiveTab] = useState<'video' | 'image' | 'text' | 'avatar'>('video');
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("cinematic");
  const [projectId, setProjectId] = useState<number | undefined>(undefined);
  
  const { mutate: generate, isPending } = useGenerateAsset();
  const { data: projects } = useProjects();
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!prompt) {
      toast({
        title: "Prompt required",
        description: "Please enter a prompt to generate content.",
        variant: "destructive",
      });
      return;
    }

    generate({
      type: activeTab,
      prompt,
      style,
      projectId: projectId || (projects?.[0]?.id), // Default to first project if none selected
      aspectRatio: activeTab === 'video' ? '16:9' : '1:1',
    }, {
      onSuccess: () => {
        toast({
          title: "Generation started",
          description: "Your asset is being created. Check the library shortly.",
        });
        setPrompt("");
      },
      onError: (err) => {
        toast({
          title: "Failed to start",
          description: err.message,
          variant: "destructive",
        });
      }
    });
  };

  const tabs = [
    { id: 'video', label: 'Video', icon: Video, color: 'text-blue-400' },
    { id: 'image', label: 'Image', icon: ImageIcon, color: 'text-pink-400' },
    { id: 'text', label: 'Ad Copy', icon: Type, color: 'text-green-400' },
    { id: 'avatar', label: 'Avatar', icon: User, color: 'text-yellow-400' },
  ] as const;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-white">
            What would you like to create?
          </h1>
          <p className="text-muted-foreground text-lg">AI-powered creation studio for your next big idea.</p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex flex-col items-center gap-2 p-4 rounded-2xl w-24 md:w-32 transition-all duration-300 border
                ${activeTab === tab.id 
                  ? "bg-slate-800 border-primary/50 shadow-lg shadow-primary/20 scale-105" 
                  : "bg-slate-900/50 border-white/5 hover:bg-slate-800 hover:border-white/10"
                }
              `}
            >
              <div className={`p-2 rounded-full ${activeTab === tab.id ? 'bg-primary/20' : 'bg-slate-800'} transition-colors`}>
                <tab.icon className={`w-6 h-6 ${tab.color}`} />
              </div>
              <span className={`text-sm font-medium ${activeTab === tab.id ? 'text-white' : 'text-muted-foreground'}`}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-6 md:p-8 space-y-6 bg-slate-900/50 backdrop-blur-xl border-white/10 relative overflow-hidden">
              {/* Decorative background glow */}
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="space-y-4 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Project</label>
                    <select 
                      className="w-full h-11 rounded-xl bg-background border border-input px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      value={projectId}
                      onChange={(e) => setProjectId(Number(e.target.value))}
                    >
                      <option value="">Select a project...</option>
                      {projects?.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Style Preset</label>
                    <select 
                      className="w-full h-11 rounded-xl bg-background border border-input px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                    >
                      <option value="cinematic">Cinematic</option>
                      <option value="anime">Anime / 2D</option>
                      <option value="photorealistic">Photorealistic</option>
                      <option value="3d-render">3D Render</option>
                      <option value="cyberpunk">Cyberpunk</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Prompt</label>
                  <div className="relative">
                    <textarea
                      className="w-full min-h-[120px] rounded-xl bg-background border border-input p-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      placeholder={`Describe your ${activeTab} in detail...`}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="absolute bottom-3 right-3 text-xs text-muted-foreground hover:text-primary gap-1"
                      onClick={() => setPrompt("A futuristic city with flying cars at sunset, neon lights reflecting on wet streets, cinematic lighting, 8k resolution")}
                    >
                      <Wand2 className="w-3 h-3" />
                      Inspire me
                    </Button>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button 
                    variant="gradient" 
                    size="lg" 
                    className="w-full md:w-auto min-w-[200px]"
                    onClick={handleGenerate}
                    isLoading={isPending}
                  >
                    {!isPending && <Sparkles className="w-4 h-4 mr-2" />}
                    {isPending ? "Generating Magic..." : "Generate"}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="text-center text-sm text-muted-foreground">
          Generations cost <span className="text-primary font-bold">10 credits</span>. You have {useGenerateAsset ? 'sufficient' : 'insufficient'} credits.
        </div>
      </div>
    </Layout>
  );
}
