import React, { useCallback, useEffect, useState } from 'react';
import { PaginatedResponse } from '../types';

interface PaginatedPageProps<T> {
  // Function to fetch data for a specific page
  fetchPage: (page: number) => Promise<PaginatedResponse<T>>;
  // Children render function that receives the current page data
  children: (data: T[]) => React.ReactNode;
  // Optional: Initial page to start with
  initialPage?: number;
  // Optional: Show no results message
  noResultsMessage?: string;
  // Optional: Additional dependencies to trigger refetch
  deps?: React.DependencyList;
}

function PaginatedPage<T>({
  fetchPage,
  children,
  initialPage = 1,
  noResultsMessage = 'No results found.',
  deps = [],
}: PaginatedPageProps<T>) {
  const [pageData, setPageData] = useState<PaginatedResponse<T> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const loadPage = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchPage(page);
      setPageData(data);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data.');
      setPageData(null);
    } finally {
      setLoading(false);
    }
  }, [fetchPage]);

  // Load initial page or reload when dependencies change
  useEffect(() => {
    void loadPage(initialPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadPage, ...deps]);

  const handlePageChange = async (direction: 'prev' | 'next') => {
    if (!pageData || loading) {
      return;
    }

    const targetPage = direction === 'next' ? currentPage + 1 : currentPage - 1;
    
    if (targetPage < 1 || targetPage > pageData.pages) {
      return;
    }

    await loadPage(targetPage);
  };

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = pageData ? currentPage < pageData.pages : false;

  return (
    <div>
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="mb-4 rounded-md bg-red-100 px-4 py-2 text-red-700">
          {error}
        </div>
      )}

      {/* No Results State */}
      {!loading && pageData && pageData.items.length === 0 && (
        <div className="text-center text-gray-600 py-12">
          {noResultsMessage}
        </div>
      )}

      {/* Content */}
      {!loading && pageData && pageData.items.length > 0 && (
        <>
          {children(pageData.items)}
          
          {/* Pagination Controls */}
          <div className="mt-6 flex justify-center gap-4">
            <button
              type="button"
              onClick={() => handlePageChange('prev')}
              disabled={!hasPreviousPage || loading}
              className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="self-center text-sm text-gray-600">
              Page {currentPage} of {pageData.pages}
            </span>
            <button
              type="button"
              onClick={() => handlePageChange('next')}
              disabled={!hasNextPage || loading}
              className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default PaginatedPage;

