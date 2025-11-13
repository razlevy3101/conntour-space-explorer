import React from 'react';
import { SearchHistory } from '../types';
import ImageCard from './ImageCard';

interface SearchHistoryDetailProps {
  isOpen: boolean;
  isLoading: boolean;
  history: SearchHistory | null;
  error: string | null;
  onClose: () => void;
}

const SearchHistoryDetail: React.FC<SearchHistoryDetailProps> = ({
  isOpen,
  isLoading,
  history,
  error,
  onClose,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40 px-4">
      <div className="relative w-full max-w-4xl rounded-lg bg-white p-6 shadow-lg max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
        >
          Close
        </button>

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
          <>
            {history.results.length === 0 ? (
              <div className="text-gray-600">This search did not return any results.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {history.results.map((result) => (
                  <ImageCard key={result.id} image={result} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchHistoryDetail;



