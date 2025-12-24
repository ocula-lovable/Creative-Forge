import { Button, Card } from "@/components/ui-components";
import { Sparkles } from "lucide-react";

export default function AuthPage() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 w-full max-w-md p-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-2xl shadow-indigo-500/30 mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-display font-bold text-white mb-2">Lumina Studio</h1>
          <p className="text-muted-foreground">The AI-powered creative suite for modern teams.</p>
        </div>

        <Card className="p-8 backdrop-blur-xl bg-slate-900/50 border-white/10 shadow-2xl">
          <div className="space-y-4">
            <Button 
              variant="gradient" 
              size="lg" 
              className="w-full text-lg"
              onClick={handleLogin}
            >
              Sign In with Replit
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
