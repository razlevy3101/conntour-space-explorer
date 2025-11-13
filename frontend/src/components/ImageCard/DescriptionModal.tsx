import React from 'react';
import { closeIcon } from '../../icons';

interface DescriptionModalProps {
  description: string;
  onClose: () => void;
}

export const DescriptionModal: React.FC<DescriptionModalProps> = ({
  description,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="max-w-lg w-full rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Description</h3>
          <button
            type="button"
            className="rounded-full p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={onClose}
            aria-label="Close description modal"
          >
            {closeIcon}
          </button>
        </div>
        <p className="text-gray-700 whitespace-pre-line">{description}</p>
      </div>
    </div>
  );
};
