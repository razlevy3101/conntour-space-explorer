import React, { useState } from 'react';
import { SearchHistory as SearchHistoryType } from '../../../types';
import PaginatedPage from '../../PaginatedPage';
import SearchHistoryDetail from './SearchHistoryDetail';
import SearchHistoryTable from './SearchHistoryTable';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { useSearchHistory } from '../../../hooks/useSearchHistory';
import { useDeleteSearchHistory } from '../../../hooks/useSearchHistoryMutations';
import { useSearchHistoryDetail } from '../../../hooks/useSearchHistoryDetail';
import { DEFAULT_PAGE_SIZE } from '../../../consts';

const SearchHistory: React.FC = () => {
  const [deleteCandidate, setDeleteCandidate] = useState<SearchHistoryType | null>(null);
  const [selectedHistoryId, setSelectedHistoryId] = useState<number | null>(null);

  const deleteMutation = useDeleteSearchHistory();
  
  // Fetch detail only when a history is selected
  const { 
    data: detailHistory, 
    isLoading: detailLoading, 
    error: detailError 
  } = useSearchHistoryDetail(selectedHistoryId, selectedHistoryId !== null);

  const confirmDelete = async () => {
    if (!deleteCandidate) {
      return;
    }
    
    deleteMutation.mutate(deleteCandidate.id, {
      onSuccess: () => {
        setDeleteCandidate(null);
      },
    });
  };

  const openHistoryDetail = (historyId: number) => {
    setSelectedHistoryId(historyId);
  };

  const closeHistoryDetail = () => {
    setSelectedHistoryId(null);
  };

  return (
    <>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Search History</h1>
        </div>

        {deleteMutation.isError && (
          <div className="mb-4 rounded-md bg-yellow-100 px-4 py-2 text-yellow-800">
            Failed to delete search history entry.
          </div>
        )}

        <PaginatedPage<SearchHistoryType>
          useQueryHook={useSearchHistory}
          pageSize={DEFAULT_PAGE_SIZE}
          noResultsMessage="No search history yet. Run a search to see it here."
        >
          {(historyItems) => (
            <SearchHistoryTable
              historyItems={historyItems}
              onViewHistory={openHistoryDetail}
              onDeleteHistory={setDeleteCandidate}
            />
          )}
        </PaginatedPage>
      </div>

      <DeleteConfirmationModal
        deleteCandidate={deleteCandidate}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteCandidate(null)}
        isDeleting={deleteMutation.isPending}
      />

      <SearchHistoryDetail
        isOpen={selectedHistoryId !== null}
        isLoading={detailLoading}
        history={detailHistory || null}
        error={detailError ? (detailError as Error).message : null}
        onClose={closeHistoryDetail}
      />
    </>
  );
};

export default SearchHistory;



