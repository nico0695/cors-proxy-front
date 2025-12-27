import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  ProxyEndpoint,
  CreateProxyEndpointDto,
  UpdateProxyEndpointDto,
} from "@/lib/types";

// Query keys
export const proxyEndpointKeys = {
  all: ["proxy-endpoints"] as const,
  lists: () => [...proxyEndpointKeys.all, "list"] as const,
  list: (filters?: string) => [...proxyEndpointKeys.lists(), filters] as const,
  details: () => [...proxyEndpointKeys.all, "detail"] as const,
  detail: (id: string) => [...proxyEndpointKeys.details(), id] as const,
};

export const proxyStatsKeys = {
  all: ["proxy-stats"] as const,
};

// Hooks for querying
export function useProxyEndpoints() {
  return useQuery({
    queryKey: proxyEndpointKeys.lists(),
    queryFn: api.getProxyEndpoints,
  });
}

export function useProxyEndpoint(id: string) {
  return useQuery({
    queryKey: proxyEndpointKeys.detail(id),
    queryFn: () => api.getProxyEndpoint(id),
    enabled: !!id,
  });
}

export function useProxyStats() {
  return useQuery({
    queryKey: proxyStatsKeys.all,
    queryFn: api.getProxyStats,
  });
}

// Hooks for mutations
export function useCreateProxyEndpoint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProxyEndpointDto) => api.createProxyEndpoint(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: proxyEndpointKeys.lists() });
      queryClient.invalidateQueries({ queryKey: proxyStatsKeys.all });
    },
  });
}

export function useUpdateProxyEndpoint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProxyEndpointDto }) =>
      api.updateProxyEndpoint(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: proxyEndpointKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: proxyEndpointKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: proxyStatsKeys.all });
    },
  });
}

export function useDeleteProxyEndpoint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.deleteProxyEndpoint(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: proxyEndpointKeys.lists() });
      queryClient.invalidateQueries({ queryKey: proxyStatsKeys.all });
    },
  });
}
