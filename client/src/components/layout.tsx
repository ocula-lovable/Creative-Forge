import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, 
  Sparkles, 
  FolderOpen, 
  Library, 
  Settings, 
  LogOut, 
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui-components";

export function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/generate", label: "Generators", icon: Sparkles },
    { href: "/projects", label: "Projects", icon: FolderOpen },
    { href: "/library", label: "Asset Library", icon: Library },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="h-full flex flex-col bg-slate-950 border-r border-white/5 w-64">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">Lumina AI</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 py-4">
        {links.map((link) => {
          const isActive = location === link.href;
          return (
            <Link key={link.href} href={link.href}>
              <div
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group
                  ${isActive 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 font-medium" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  }
                `}
              >
                <link.icon className={`w-5 h-5 ${isActive ? "" : "group-hover:text-primary transition-colors"}`} />
                {link.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="bg-white/5 rounded-xl p-4 mb-4 backdrop-blur-sm">
          <p className="text-xs font-medium text-muted-foreground mb-1">Credits Available</p>
          <div className="flex items-end gap-1">
            <span className="text-2xl font-bold font-display text-white">{user?.credits || 0}</span>
            <span className="text-xs text-muted-foreground mb-1.5">/ 1000</span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
              style={{ width: `${Math.min(((user?.credits || 0) / 1000) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-xs font-bold border border-white/10">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.username}</p>
            <p className="text-xs text-muted-foreground truncate capitalize">{user?.tier || 'Free'} Plan</p>
          </div>
          <button 
            onClick={() => logout()}
            className="text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-out md:relative md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg">Lumina</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto max-w-7xl p-4 md:p-8 space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
