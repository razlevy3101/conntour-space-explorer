import React from 'react';
import { SearchHistory as SearchHistoryType } from '../../../types';
import SearchHistoryRow from './SearchHistoryRow';

interface SearchHistoryTableProps {
  historyItems: SearchHistoryType[];
  onViewHistory: (historyId: number) => void;
  onDeleteHistory: (entry: SearchHistoryType) => void;
}

const SearchHistoryTable: React.FC<SearchHistoryTableProps> = ({
  historyItems,
  onViewHistory,
  onDeleteHistory,
}) => {

  const hederLine = (label: string) => <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">{label}</th>
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {hederLine('Timestamp')}
            {hederLine('Search Query')}
            {hederLine('Results')}
            {hederLine('Actions')}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {historyItems.map((entry) => (
            <SearchHistoryRow
              key={entry.id}
              entry={entry}
              onView={onViewHistory}
              onDelete={onDeleteHistory}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SearchHistoryTable;
