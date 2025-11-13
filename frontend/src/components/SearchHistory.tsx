import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { SearchHistory as SearchHistoryType } from '../types';
import SearchHistoryDetail from './SearchHistoryDetail';

const trashIcon = (
  <svg
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M6 7h12m-1 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V7m3 0V5a2 2 0 012-2h0a2 2 0 012 2v2"
    />
  </svg>
);

const eyeIcon = (
  <svg
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const SearchHistory: React.FC = () => {
  const [history, setHistory] = useState<SearchHistoryType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<SearchHistoryType | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [detailHistory, setDetailHistory] = useState<SearchHistoryType | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get<SearchHistoryType[]>('/api/search-history');
      const sortedHistory = [...response.data].sort(
        (a, b) =>
          new Date(b.search_timestamp).getTime() - new Date(a.search_timestamp).getTime()
      );
      setHistory(sortedHistory);
      setError(null);
    } catch (err) {
      setError('Failed to load search history.');
    } finally {
      setLoading(false);
    }
  }, []);

  const confirmDelete = async () => {
    if (!deleteCandidate) {
      return;
    }
    try {
      await axios.delete(`/api/search-history/${deleteCandidate.id}`);
      setHistory((prevHistory) => prevHistory.filter((entry) => entry.id !== deleteCandidate.id));
      setError(null);
      setDeleteCandidate(null);
    } catch (err) {
      setError('Failed to delete search history entry.');
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

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Search History</h1>
          <button
            type="button"
            onClick={fetchHistory}
            className="self-start md:self-auto rounded-md border border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-yellow-100 px-4 py-2 text-yellow-800">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : history.length === 0 ? (
          <div className="text-gray-600">No search history yet. Run a search to see it here.</div>
        ) : (
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
                {history.map((entry) => (
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



