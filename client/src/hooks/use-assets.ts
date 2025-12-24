import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { GenerateAssetRequest } from "@shared/schema";

export function useAssets(projectId?: number, type?: string) {
  return useQuery({
    queryKey: [api.assets.list.path, projectId, type],
    queryFn: async () => {
      let url = api.assets.list.path;
      const params = new URLSearchParams();
      if (projectId) params.append("projectId", projectId.toString());
      if (type) params.append("type", type);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch assets");
      return api.assets.list.responses[200].parse(await res.json());
    },
  });
}

export function useAsset(id: number) {
  return useQuery({
    queryKey: [api.assets.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.assets.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch asset");
      return api.assets.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
    refetchInterval: (query) => {
      const data = query.state.data;
      // Poll if status is pending or processing
      if (data && (data.status === 'pending' || data.status === 'processing')) {
        return 2000;
      }
      return false;
    }
  });
}

export function useGenerateAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: GenerateAssetRequest) => {
      const validated = api.assets.generate.input.parse(data);
      const res = await fetch(api.assets.generate.path, {
        method: api.assets.generate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 402) {
          throw new Error("Insufficient credits");
        }
        if (res.status === 400) {
          throw new Error("Invalid generation parameters");
        }
        throw new Error("Generation failed to start");
      }
      
      return api.assets.generate.responses[202].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.assets.list.path] });
      // Also invalidate user credits if we had that query
      queryClient.invalidateQueries({ queryKey: [api.auth.me.path] });
    },
  });
}
