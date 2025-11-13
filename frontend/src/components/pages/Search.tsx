import React, { useCallback, useState } from 'react';
import axios from 'axios';
import ImageCard from '../ImageCard/ImageCard';
import PaginatedPage from '../PaginatedPage';
import { PaginatedResponse, SearchResult } from '../../types';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTrigger, setSearchTrigger] = useState(0);

  const fetchResults = useCallback(async (page: number): Promise<PaginatedResponse<SearchResult>> => {
    if (!activeQuery) {
      throw new Error('No search query provided.');
    }

    const response = await axios.get<PaginatedResponse<SearchResult>>('/api/search', {
      params: { query: activeQuery, page },
    });
    return response.data;
  }, [activeQuery]);

  const handleSearch = () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setError('Please enter a search query.');
      setHasSearched(false);
      setActiveQuery('');
      return;
    }

    setError(null);
    setHasSearched(true);
    setActiveQuery(trimmedQuery);
    // Increment trigger to force PaginatedPage component to refetch
    setSearchTrigger(prev => prev + 1);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

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
        {error && <div className="mb-4 rounded-md bg-red-100 px-4 py-2 text-red-700">{error}</div>}
      </div>

      <div className="mt-6">
        {hasSearched && activeQuery && (
          <PaginatedPage<SearchResult>
            fetchPage={fetchResults}
            deps={[searchTrigger]}
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

