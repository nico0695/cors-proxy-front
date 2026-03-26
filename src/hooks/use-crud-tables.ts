import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type {
  CreateCrudTableDto,
  UpdateCrudTableDto,
  CreateCrudEntryDto,
  UpdateCrudEntryDto,
} from '@/lib/types';

// Query keys
export const crudTableKeys = {
  all: ['crud-tables'] as const,
  lists: () => [...crudTableKeys.all, 'list'] as const,
  details: () => [...crudTableKeys.all, 'detail'] as const,
  detail: (id: string) => [...crudTableKeys.details(), id] as const,
};

export const crudStatsKeys = {
  all: ['crud-stats'] as const,
};

export const crudEntryKeys = {
  all: (basePath: string) => ['crud-entries', basePath] as const,
  lists: (basePath: string) =>
    [...crudEntryKeys.all(basePath), 'list'] as const,
};

// Table query hooks
export function useCrudTables() {
  return useQuery({
    queryKey: crudTableKeys.lists(),
    queryFn: api.getCrudTables,
  });
}

export function useCrudTable(id: string) {
  return useQuery({
    queryKey: crudTableKeys.detail(id),
    queryFn: () => api.getCrudTable(id),
    enabled: !!id,
  });
}

export function useCrudStats() {
  return useQuery({
    queryKey: crudStatsKeys.all,
    queryFn: api.getCrudStats,
  });
}

// Table mutation hooks
export function useCreateCrudTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCrudTableDto) => api.createCrudTable(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: crudTableKeys.lists() });
      queryClient.invalidateQueries({ queryKey: crudStatsKeys.all });
    },
  });
}

export function useUpdateCrudTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCrudTableDto }) =>
      api.updateCrudTable(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: crudTableKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: crudTableKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: crudStatsKeys.all });
    },
  });
}

export function useDeleteCrudTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.deleteCrudTable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: crudTableKeys.lists() });
      queryClient.invalidateQueries({ queryKey: crudStatsKeys.all });
    },
  });
}

// Entry query hooks
export function useCrudEntries(basePath: string) {
  return useQuery({
    queryKey: crudEntryKeys.lists(basePath),
    queryFn: () => api.getCrudEntries(basePath),
    enabled: !!basePath,
  });
}

// Entry mutation hooks
export function useCreateCrudEntry(basePath: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCrudEntryDto) =>
      api.createCrudEntry(basePath, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: crudEntryKeys.lists(basePath),
      });
    },
  });
}

export function useUpdateCrudEntry(basePath: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      entryId,
      data,
    }: {
      entryId: string;
      data: UpdateCrudEntryDto;
    }) => api.updateCrudEntry(basePath, entryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: crudEntryKeys.lists(basePath),
      });
    },
  });
}

export function useDeleteCrudEntry(basePath: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entryId: string) => api.deleteCrudEntry(basePath, entryId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: crudEntryKeys.lists(basePath),
      });
    },
  });
}
