import React, { useCallback, useMemo } from 'react';
import { PaginatedResponse, SearchHistory, SearchResult } from '../../types';
import ImageCard from '../ImageCard/ImageCard';
import PaginatedPage from '../PaginatedPage';
import { closeIcon } from '../../icons';

interface SearchHistoryDetailProps {
  isOpen: boolean;
  isLoading: boolean;
  history: SearchHistory | null;
  error: string | null;
  onClose: () => void;
}

const ITEMS_PER_PAGE = 6;

const SearchHistoryDetail: React.FC<SearchHistoryDetailProps> = ({
  isOpen,
  isLoading,
  history,
  error,
  onClose,
}) => {
  // Create a paginated fetch function from the in-memory results
  const fetchPage = useCallback(async (page: number): Promise<PaginatedResponse<SearchResult>> => {
    if (!history) {
      throw new Error('No history data available');
    }

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const items = history.results.slice(startIndex, endIndex);
    const totalPages = Math.ceil(history.results.length / ITEMS_PER_PAGE);

    return {
      items,
      total: history.results.length,
      page,
      size: ITEMS_PER_PAGE,
      pages: totalPages,
    };
  }, [history]);

  // Use a key to force re-render when history changes
  const paginationKey = useMemo(() => {
    return history ? `history-${history.id}` : 'no-history';
  }, [history]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40 px-4">
      <div className="relative w-full max-w-4xl rounded-lg bg-white p-6 shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 -mx-6 -mt-6 mb-2 flex justify-end bg-transparent px-6 pt-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white p-2 text-gray-500 shadow-sm hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Close search history detail"
          >
            {closeIcon}
          </button>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-1">Search History Detail</h1>
        {history && (
          <p className="text-sm text-gray-500 mb-6">
            {history.query} • {new Date(history.search_timestamp).toLocaleString()}
          </p>
        )}

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-100 px-4 py-2 text-red-700">
            {error}
          </div>
        )}

        {!isLoading && !error && history && (
          <PaginatedPage<SearchResult>
            key={paginationKey}
            fetchPage={fetchPage}
            noResultsMessage="This search did not return any results."
          >
            {(results) => (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map((result) => (
                  <ImageCard key={result.id} image={result} />
                ))}
              </div>
            )}
          </PaginatedPage>
        )}
      </div>
    </div>
  );
};

export default SearchHistoryDetail;



