import React, { useState } from 'react';
import Search from './components/Search';
import Sources from './components/Sources';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<'search' | 'sources'>('search');

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <nav className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-blue-600">Conntour Explorer</h1>
        </div>
        <ul className="p-4 space-y-2">
          <li>
            <button
              type="button"
              onClick={() => setActivePage('search')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activePage === 'search'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-blue-50'
              }`}
            >
              Search
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => setActivePage('sources')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activePage === 'sources'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-blue-50'
              }`}
            >
              All Sources
            </button>
          </li>
        </ul>
      </nav>
      <main className="flex-1 p-8">
        {activePage === 'search' ? <Search /> : <Sources />}
      </main>
    </div>
  );
};

export default App; 