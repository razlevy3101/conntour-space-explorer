import React, { useState } from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import { PaginatedResponse } from '../types';
import { LoadingSpinner, ErrorMessage, EmptyState } from './QueryStatus';
import { PaginationControls } from './PaginationControls';

type PaginatedHook<T> = (page: number, size: number) => UseQueryResult<PaginatedResponse<T>>;

interface PaginatedPageProps<T> {
  useQueryHook: PaginatedHook<T>;
  pageSize?: number;
  children: (data: T[]) => React.ReactNode;
  initialPage?: number;
  noResultsMessage?: string;
}

function PaginatedPage<T>({
  useQueryHook,
  pageSize = 10,
  children,
  initialPage = 1,
  noResultsMessage = 'No results found.',
}: PaginatedPageProps<T>) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  
  const { data: pageData, isLoading, error, isFetching } = useQueryHook(currentPage, pageSize);

  return (
    <div>
      {isLoading && <LoadingSpinner />}

      {!isLoading && error && (
        <ErrorMessage message={error instanceof Error ? error.message : 'Failed to load data.'} />
      )}

      {!isLoading && pageData && pageData.items.length === 0 && (
        <EmptyState message={noResultsMessage} />
      )}

      {!isLoading && pageData && pageData.items.length > 0 && (
        <>
          {children(pageData.items)}
          
          <PaginationControls
            currentPage={currentPage}
            totalPages={pageData.pages}
            onPageChange={setCurrentPage}
            isLoading={isFetching}
          />
        </>
      )}
    </div>
  );
}

export default PaginatedPage;

