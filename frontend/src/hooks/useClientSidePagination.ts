import { useMemo } from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import { PaginatedResponse } from '../types';

// this hook returns the same interface as server-side pagination hooks for consistency
export function useClientSidePagination<T>(
  data: T[] | null | undefined,
  page: number,
  size: number,
  isLoading: boolean = false,
  error: Error | null = null
): UseQueryResult<PaginatedResponse<T>> {
  const paginatedData = useMemo(() => {
    if (!data) return null;

    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    const items = data.slice(startIndex, endIndex);
    const totalPages = Math.ceil(data.length / size);

    return {
      items,
      total: data.length,
      page,
      size,
      pages: totalPages,
    };
  }, [data, page, size]);

  return {
    data: paginatedData,
    isLoading,
    error,
    isFetching: false, // Client-side pagination doesn't fetch
    isError: !!error,
    isSuccess: !isLoading && !error && !!paginatedData,
    status: isLoading ? 'pending' : error ? 'error' : 'success',
  } as UseQueryResult<PaginatedResponse<T>>;
}
