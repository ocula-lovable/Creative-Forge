import { Asset } from "@shared/schema";
import { Card, Badge, Button } from "./ui-components";
import { format } from "date-fns";
import { Video, Image as ImageIcon, Type, User, Download, Play, MoreHorizontal } from "lucide-react";
import { useState } from "react";

interface AssetCardProps {
  asset: Asset;
  onClick?: () => void;
}

export function AssetCard({ asset, onClick }: AssetCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const getIcon = () => {
    switch (asset.type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'text': return <Type className="w-4 h-4" />;
      case 'avatar': return <User className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const getStatusColor = () => {
    switch (asset.status) {
      case 'completed': return 'success';
      case 'failed': return 'destructive';
      case 'processing': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Card className="group overflow-hidden bg-card/50 hover:bg-card hover:shadow-xl transition-all duration-300 border-white/5 hover:border-white/10 flex flex-col h-full">
      <div className="aspect-video relative bg-black/50 overflow-hidden">
        {asset.status === 'completed' && asset.url ? (
          asset.type === 'video' ? (
            <>
              <video 
                src={asset.url} 
                className="w-full h-full object-cover"
                onMouseEnter={(e) => e.currentTarget.play()}
                onMouseLeave={(e) => {
                  e.currentTarget.pause();
                  e.currentTarget.currentTime = 0;
                }}
                muted
                loop
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors pointer-events-none">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Play className="w-4 h-4 text-white fill-white" />
                </div>
              </div>
            </>
          ) : asset.type === 'image' ? (
            <img src={asset.url} alt={asset.prompt || "Generated Asset"} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-6 text-muted-foreground text-sm bg-slate-900">
              {asset.prompt}
            </div>
          )
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-slate-900/50">
            {asset.status === 'failed' ? (
              <span className="text-destructive font-medium">Generation Failed</span>
            ) : (
              <>
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <span className="text-xs text-muted-foreground font-medium animate-pulse">Generating...</span>
              </>
            )}
          </div>
        )}

        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
           <Button size="icon" className="h-8 w-8 rounded-full bg-black/50 backdrop-blur-md hover:bg-black/70 border-none">
             <MoreHorizontal className="w-4 h-4 text-white" />
           </Button>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <div className="flex items-center justify-between">
          <Badge variant={getStatusColor()} className="capitalize flex gap-1 items-center px-2 py-0.5">
            {getIcon()}
            {asset.type}
          </Badge>
          <span className="text-[10px] text-muted-foreground">
            {asset.createdAt ? format(new Date(asset.createdAt), "MMM d, h:mm a") : "Just now"}
          </span>
        </div>
        
        <p className="text-sm font-medium line-clamp-2 text-foreground/90 group-hover:text-primary transition-colors cursor-pointer" onClick={onClick}>
          {asset.prompt || "Untitled Asset"}
        </p>
      </div>
    </Card>
  );
}

import { Sparkles } from "lucide-react";
