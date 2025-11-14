import axios from 'axios';
import { PaginatedResponse, SearchHistory } from '../types';
import { usePaginatedQuery } from './usePaginatedQuery';
import { QUERY_KEYS, DEFAULT_PAGE_SIZE } from '../consts';

const fetchSearchHistory = async (
  page: number,
  size: number
): Promise<PaginatedResponse<SearchHistory>> => {
  const response = await axios.get<PaginatedResponse<SearchHistory>>('/api/search-history', {
    params: { page, size },
  });
  return response.data;
};

export const useSearchHistory = (page: number, size: number = DEFAULT_PAGE_SIZE) =>
  usePaginatedQuery({
    queryKey: QUERY_KEYS.SEARCH_HISTORY,
    fetchFn: fetchSearchHistory,
    page,
    size,
  });

