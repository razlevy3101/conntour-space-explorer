import React, { useCallback, useState } from 'react';
import axios from 'axios';
import { PaginatedResponse, SearchHistory as SearchHistoryType } from '../../types';
import { eyeIcon, trashIcon } from '../../icons';
import PaginatedPage from '../PaginatedPage';
import SearchHistoryDetail from './SearchHistoryDetail';

const SearchHistory: React.FC = () => {
  const [deleteCandidate, setDeleteCandidate] = useState<SearchHistoryType | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [detailHistory, setDetailHistory] = useState<SearchHistoryType | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchHistoryPage = useCallback(async (page: number): Promise<PaginatedResponse<SearchHistoryType>> => {
    const response = await axios.get<PaginatedResponse<SearchHistoryType>>('/api/search-history', {
      params: { page },
    });
    return response.data;
  }, []);

  const confirmDelete = async () => {
    if (!deleteCandidate) {
      return;
    }
    try {
      await axios.delete(`/api/search-history/${deleteCandidate.id}`);
      setDeleteError(null);
      setDeleteCandidate(null);
      // Trigger a refresh of the pagination component
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      setDeleteError('Failed to delete search history entry.');
    }
  };

  const openHistoryDetail = async (historyId: number) => {
    setIsDetailOpen(true);
    setDetailLoading(true);
    setDetailError(null);
    setDetailHistory(null);

    try {
      const response = await axios.get<SearchHistoryType>(`/api/search-history/${historyId}`);
      setDetailHistory(response.data);
    } catch (err) {
      setDetailError('Failed to load search history detail.');
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Search History</h1>
        </div>

        {deleteError && (
          <div className="mb-4 rounded-md bg-yellow-100 px-4 py-2 text-yellow-800">
            {deleteError}
          </div>
        )}

        <PaginatedPage<SearchHistoryType>
          fetchPage={fetchHistoryPage}
          deps={[refreshTrigger]}
          noResultsMessage="No search history yet. Run a search to see it here."
        >
          {(historyItems) => (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Timestamp</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Search Query</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Results</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {historyItems.map((entry) => (
                    <tr key={entry.id}>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {new Date(entry.search_timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{entry.query}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{entry.results.length}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => openHistoryDetail(entry.id)}
                            className="text-blue-600 hover:text-blue-800"
                            aria-label="View search results"
                          >
                            {eyeIcon}
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteCandidate(entry)}
                            className="text-red-600 hover:text-red-800"
                            aria-label="Delete search history entry"
                          >
                            {trashIcon}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </PaginatedPage>
      </div>

      {deleteCandidate && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40 px-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Confirm deletion</h2>
            <p className="text-gray-600">
              Are you sure you want to delete this history?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setDeleteCandidate(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                onClick={confirmDelete}
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}

      <SearchHistoryDetail
        isOpen={isDetailOpen}
        isLoading={detailLoading}
        history={detailHistory}
        error={detailError}
        onClose={() => {
          setIsDetailOpen(false);
          setDetailHistory(null);
          setDetailError(null);
        }}
      />
    </>
  );
};

export default SearchHistory;



