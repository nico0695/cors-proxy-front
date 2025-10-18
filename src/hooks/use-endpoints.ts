import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  MockEndpoint,
  CreateMockEndpointDto,
  UpdateMockEndpointDto,
} from "@/lib/types";

// Query keys
export const endpointKeys = {
  all: ["endpoints"] as const,
  lists: () => [...endpointKeys.all, "list"] as const,
  list: (filters?: string) => [...endpointKeys.lists(), filters] as const,
  details: () => [...endpointKeys.all, "detail"] as const,
  detail: (id: string) => [...endpointKeys.details(), id] as const,
};

export const statsKeys = {
  all: ["stats"] as const,
};

// Hooks for querying
export function useEndpoints() {
  return useQuery({
    queryKey: endpointKeys.lists(),
    queryFn: api.getEndpoints,
  });
}

export function useEndpoint(id: string) {
  return useQuery({
    queryKey: endpointKeys.detail(id),
    queryFn: () => api.getEndpoint(id),
    enabled: !!id,
  });
}

export function useStats() {
  return useQuery({
    queryKey: statsKeys.all,
    queryFn: api.getStats,
  });
}

// Hooks for mutations
export function useCreateEndpoint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMockEndpointDto) => api.createEndpoint(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: endpointKeys.lists() });
      queryClient.invalidateQueries({ queryKey: statsKeys.all });
    },
  });
}

export function useUpdateEndpoint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMockEndpointDto }) =>
      api.updateEndpoint(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: endpointKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: endpointKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: statsKeys.all });
    },
  });
}

export function useDeleteEndpoint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.deleteEndpoint(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: endpointKeys.lists() });
      queryClient.invalidateQueries({ queryKey: statsKeys.all });
    },
  });
}
