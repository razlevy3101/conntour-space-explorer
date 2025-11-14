import React from 'react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}) => {
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <div className="mt-6 flex justify-center gap-4 items-center">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPreviousPage || isLoading}
        className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        Previous
      </button>
      <span className="self-center text-sm text-gray-600">
        Page {currentPage} of {totalPages}
        {isLoading && (
          <span className="ml-2 text-blue-500">(Loading...)</span>
        )}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage || isLoading}
        className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </div>
  );
};

