import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { PaginatedResponse } from '../types';

interface UsePaginatedQueryOptions<T> {
  queryKey: string;
  fetchFn: (page: number, size: number) => Promise<PaginatedResponse<T>>;
  page: number;
  size?: number;
  enabled?: boolean;
}

// this hook is a base hook for paginated queries with automatic prefetching
export function usePaginatedQuery<T>({
  queryKey,
  fetchFn,
  page,
  size = 10,
  enabled = true,
}: UsePaginatedQueryOptions<T>) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [queryKey, page, size],
    queryFn: () => fetchFn(page, size),
    placeholderData: (previousData) => previousData,
    enabled,
  });

  // Prefetch next page for instant navigation
  useEffect(() => {
    if (query.data && enabled && page < query.data.pages) {
      queryClient.prefetchQuery({
        queryKey: [queryKey, page + 1, size],
        queryFn: () => fetchFn(page + 1, size),
      });
    }
  }, [page, size, query.data, queryClient, enabled, queryKey, fetchFn]);

  return query;
}

