import React from 'react';
import { SearchHistory as SearchHistoryType } from '../../../types';
import { eyeIcon, trashIcon } from '../../../icons';

interface SearchHistoryRowProps {
  entry: SearchHistoryType;
  onView: (historyId: number) => void;
  onDelete: (entry: SearchHistoryType) => void;
}

const SearchHistoryRow: React.FC<SearchHistoryRowProps> = ({
  entry,
  onView,
  onDelete,
}) => {
  return (
    <tr key={entry.id}>
      <td className="px-4 py-3 text-sm text-gray-700">
        {new Date(entry.search_timestamp).toLocaleString()}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">{entry.query}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{entry.results.length}</td>
      <td className="px-4 py-3">
        <div className="flex justify-start gap-3">
          <button
            type="button"
            onClick={() => onView(entry.id)}
            className="text-blue-600 hover:text-blue-800"
            aria-label="View search results"
          >
            {eyeIcon}
          </button>
          <button
            type="button"
            onClick={() => onDelete(entry)}
            className="text-red-600 hover:text-red-800"
            aria-label="Delete search history entry"
          >
            {trashIcon}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default SearchHistoryRow;
