import React, { useCallback } from 'react';
import axios from 'axios';
import { PaginatedResponse, Source } from '../../types';
import ImageCard from '../ImageCard/ImageCard';
import PaginatedPage from '../PaginatedPage';

const Sources: React.FC = () => {
  const fetchSourcesPage = useCallback(async (page: number): Promise<PaginatedResponse<Source>> => {
    const response = await axios.get<PaginatedResponse<Source>>('/api/sources', {
      params: { page },
    });
    return response.data;
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">NASA Space Images</h1>
      
      <PaginatedPage<Source>
        fetchPage={fetchSourcesPage}
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