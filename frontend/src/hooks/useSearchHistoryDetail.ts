import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { SearchHistory } from '../types';
import { QUERY_KEYS } from '../consts';

const fetchSearchHistoryDetail = async (historyId: number): Promise<SearchHistory> => {
  const response = await axios.get<SearchHistory>(`/api/search-history/${historyId}`);
  return response.data;
};

export const useSearchHistoryDetail = (historyId: number | null, enabled: boolean = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_HISTORY_DETAIL, historyId],
    queryFn: () => fetchSearchHistoryDetail(historyId!),
    enabled: enabled && historyId !== null,
  });
};

