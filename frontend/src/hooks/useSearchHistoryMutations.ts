import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { QUERY_KEYS } from '../consts';

export const useDeleteSearchHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (historyId: number) => {
      await axios.delete(`/api/search-history/${historyId}`);
    },
    onSuccess: (_, historyId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SEARCH_HISTORY] });
      queryClient.removeQueries({ queryKey: [QUERY_KEYS.SEARCH_HISTORY_DETAIL, historyId] });
    },
  });
};

