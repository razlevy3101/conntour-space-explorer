import React, { useState } from 'react';
import { Source, SearchResult } from '../types';
import { closeIcon } from './icons';

type ImageCardItem = Source | SearchResult;

interface ImageCardProps {
  image: ImageCardItem;
}

interface DescriptionModalProps {
  description: string;
  onClose: () => void;
}

const isSearchResult = (item: ImageCardItem): item is SearchResult => {
  return 'confidence_score' in item;
};

const DescriptionModal: React.FC<DescriptionModalProps> = ({
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

const ImageCard: React.FC<ImageCardProps> = ({ image }) => {
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const description = image.description ?? '';
  const hasDescription = description.trim().length > 0;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {image.image_url && (
        <a
          href={image.image_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <img
            src={image.image_url}
            alt={image.name}
            className="w-full h-48 object-cover cursor-pointer transition-transform duration-200 hover:scale-[1.01]"
          />
        </a>
      )}
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{image.name}</h2>
        {isSearchResult(image) && (
          <span className="text-sm font-medium text-blue-600">
            {image.confidence_score.toFixed(1)}% match
          </span>
        )}
        {hasDescription && (
          <>
            <button
              type="button"
              className="w-full text-left text-gray-600 mb-2 line-clamp-3 focus:outline-none hover:text-gray-800"
              onClick={() => setIsDescriptionModalOpen(true)}
              aria-label="View full description"
            >
              {description}
            </button>
            {isDescriptionModalOpen && (
              <DescriptionModal
                description={description}
                onClose={() => setIsDescriptionModalOpen(false)}
              />
            )}
          </>
        )}
        <p className="text-sm text-gray-500 mb-4">
          {image.launch_date && new Date(image.launch_date).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default ImageCard; 