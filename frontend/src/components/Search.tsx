import React, { useState } from 'react';
import axios from 'axios';
import ImageCard from './ImageCard';
import { SearchResult } from '../types';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const handleSearch = async () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setError('Please enter a search query.');
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await axios.get<SearchResult[]>('/api/search', {
        params: { query: trimmedQuery },
      });
      setResults(response.data);
    } catch (err) {
      setError('Failed to fetch search results.');
      setResults([]);
    } finally {
      setLoading(false);
    }
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
            className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 transition-colors disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        {error && <div className="mb-4 rounded-md bg-red-100 px-4 py-2 text-red-700">{error}</div>}
      </div>

      <div className="mt-6">
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {!loading && hasSearched && results.length === 0 && !error && (
          <div className="text-center text-gray-600 py-12">
            No results found. Try different keywords.
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((result) => (
              <ImageCard key={result.id} image={result} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Search;

