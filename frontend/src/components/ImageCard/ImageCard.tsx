import React, { useState } from 'react';
import { Tooltip } from 'react-tooltip';
import { Source, SearchResult } from '../../types';
import { DescriptionModal } from './DescriptionModal';
import DataBadges from './DataBadges';

type ImageCardItem = Source | SearchResult;

interface ImageCardProps {
  image: ImageCardItem;
}

const isSearchResult = (item: ImageCardItem): item is SearchResult => {
  return 'confidence_score' in item;
};

const ImageCard: React.FC<ImageCardProps> = ({ image }) => {
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const description = image.description ?? '';
  const hasDescription = description.trim().length > 0;
  const tooltipId = `tooltip-${image.id}`;

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
        <h2 
          className="text-xl font-semibold mb-2 cursor-help line-clamp-3"
          data-tooltip-id={tooltipId}
          data-tooltip-content={image.name}
        >
          {image.name}
        </h2>
        <Tooltip 
          id={tooltipId} 
          place="top"
          style={{ 
            backgroundColor: '#1f2937', 
            color: '#fff',
            maxWidth: '300px',
            wordWrap: 'break-word',
            zIndex: 50
          }}
        />
        {isSearchResult(image) && (
          <span className="text-sm font-medium text-blue-600">
            {image.confidence_score.toFixed(1)}% match
          </span>
        )}
        {hasDescription && (
          <>
            <button
              type="button"
              className="w-full text-left text-gray-600 mb-2 line-clamp-3 focus:outline-none hover:text-gray-800 cursor-pointer"
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
        <div className="space-y-2">
          <DataBadges type={image.type} status={image.status} />
          <p className="text-sm text-gray-500">
            {image.launch_date && new Date(image.launch_date).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageCard; 