export interface Source {
  id: number;
  name: string;
  description: string;
  launch_date: string;
  image_url?: string;
  type: string;
  status: string;
}

export interface SearchResult extends Source {
  confidence_score: number;
}

export interface SearchHistory {
  id: number;
  query: string;
  search_timestamp: string;
  results: SearchResult[];
}

