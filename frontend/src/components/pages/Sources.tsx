import React from 'react';
import ImageCard from '../ImageCard/ImageCard';
import PaginatedPage from '../PaginatedPage';
import { useSources } from '../../hooks/useSources';
import { Source } from '../../types';

const Sources: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">NASA Space Images</h1>
      
      <PaginatedPage<Source>
        useQueryHook={useSources}
        pageSize={10}
        noResultsMessage="No sources available."
      >
        {(sources) => (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sources.map((image) => (
              <ImageCard key={image.id} image={image} />
            ))}
          </div>
        )}
      </PaginatedPage>
    </div>
  );
};

export default Sources; 