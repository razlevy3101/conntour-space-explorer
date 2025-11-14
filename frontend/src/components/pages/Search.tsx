import React, { useState } from 'react';
import ImageCard from '../ImageCard/ImageCard';
import { SearchResult } from '../../types';
import { useSearch } from '../../hooks/useSearch';
import { ErrorMessage } from '../QueryStatus';
import PaginatedPage from '../PaginatedPage';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [searchKey, setSearchKey] = useState(0);

  const handleSearch = () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setError('Please enter a search query.');
      setActiveQuery('');
      return;
    }

    setError(null);
    setActiveQuery(trimmedQuery);
    setSearchKey((prev) => prev + 1); // Force PaginatedPage to reset to page 1
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  // Create a hook wrapper that follows React Hooks rules
  const useSearchWithQuery = (page: number, size: number) =>
    useSearch(activeQuery, page, size, !!activeQuery);

  return (
    <div className="h-full">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4">Search</h1>
        <p className="text-gray-600 mb-6">
          Search in our database using a natural language
        </p>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="example text: images of Mars rovers"
            className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
        {error && <ErrorMessage message={error} />}
      </div>

      <div className="mt-6">
        {activeQuery && (
          <PaginatedPage<SearchResult>
            key={searchKey}
            useQueryHook={useSearchWithQuery}
            pageSize={10}
            noResultsMessage="No results found. Try different keywords."
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

export default Search;

