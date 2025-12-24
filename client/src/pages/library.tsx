import { Layout } from "@/components/layout";
import { AssetCard } from "@/components/asset-card";
import { useAssets } from "@/hooks/use-assets";
import { Input, Button } from "@/components/ui-components";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Library() {
  const [filter, setFilter] = useState("");
  const { data: assets, isLoading } = useAssets();

  const filteredAssets = assets?.filter(asset => 
    asset.prompt?.toLowerCase().includes(filter.toLowerCase()) || 
    asset.type.includes(filter.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Asset Library</h1>
            <p className="text-muted-foreground">Manage and view all your generated content.</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search assets..." 
                className="pl-9"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-video rounded-2xl bg-slate-900/50 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredAssets?.map((asset, index) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <AssetCard asset={asset} />
              </motion.div>
            ))}
            {filteredAssets?.length === 0 && (
              <div className="col-span-full py-20 text-center text-muted-foreground">
                <p>No assets found matching your search.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
