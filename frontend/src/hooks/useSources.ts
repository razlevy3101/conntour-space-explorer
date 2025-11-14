import axios from 'axios';
import { PaginatedResponse, Source } from '../types';
import { usePaginatedQuery } from './usePaginatedQuery';
import { QUERY_KEYS } from '../consts';

const fetchSources = async (page: number, size: number): Promise<PaginatedResponse<Source>> => {
  const response = await axios.get<PaginatedResponse<Source>>('/api/sources', {
    params: { page, size },
  });
  return response.data;
};

export const useSources = (page: number, size: number = 10) =>
  usePaginatedQuery({
    queryKey: QUERY_KEYS.SOURCES,
    fetchFn: fetchSources,
    page,
    size,
  });

