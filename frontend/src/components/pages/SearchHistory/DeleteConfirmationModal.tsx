import React from 'react';
import { SearchHistory as SearchHistoryType } from '../../../types';

interface DeleteConfirmationModalProps {
  deleteCandidate: SearchHistoryType | null;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  deleteCandidate,
  onConfirm,
  onCancel,
  isDeleting = false,
}) => {
  if (!deleteCandidate) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Confirm deletion</h2>
        <p className="text-gray-600">
          Are you sure you want to delete this history?
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Yes, delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
