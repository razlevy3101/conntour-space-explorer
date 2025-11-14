import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
import { PaginatedResponse, SearchResult } from '../types';
import { QUERY_KEYS } from '../consts';

const fetchSearchResults = async (
  query: string,
  page: number,
  size: number
): Promise<PaginatedResponse<SearchResult>> => {
  const response = await axios.get<PaginatedResponse<SearchResult>>('/api/search', {
    params: { query, page, size },
  });
  return response.data;
};

export const useSearch = (
  query: string,
  page: number,
  size: number = 10,
  enabled: boolean = true
) => {
  const queryClient = useQueryClient();

  const queryResult = useQuery({
    queryKey: [QUERY_KEYS.SEARCH_RESULTS, query, page, size],
    queryFn: () => fetchSearchResults(query, page, size),
    enabled: enabled && !!query.trim(),
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    if (queryResult.data && enabled && query.trim()) {
      // If this is page 1 and search was successful, invalidate search history
      // because the backend creates a new history entry on page 1
      if (page === 1 && queryResult.isSuccess) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SEARCH_HISTORY] });
      }

      if (page < queryResult.data.pages) {
        queryClient.prefetchQuery({
          queryKey: [QUERY_KEYS.SEARCH_RESULTS, query, page + 1, size],
          queryFn: () => fetchSearchResults(query, page + 1, size),
        });
      }

      if (page > 1) {
        queryClient.prefetchQuery({
          queryKey: [QUERY_KEYS.SEARCH_RESULTS, query, page - 1, size],
          queryFn: () => fetchSearchResults(query, page - 1, size),
        });
      }
    }
  }, [query, page, size, queryResult.data, queryClient, enabled, queryResult.isSuccess]);

  return queryResult;
};

