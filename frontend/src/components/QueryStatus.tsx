import React from 'react';

/**
 * Loading spinner component for query states
 */
export const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
  </div>
);

/**
 * Error message display component
 */
export const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="mb-4 rounded-md bg-red-100 px-4 py-2 text-red-700">
    {message}
  </div>
);

/**
 * Empty state display component
 */
export const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="text-center text-gray-600 py-12">
    {message}
  </div>
);

