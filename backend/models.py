from datetime import datetime
from typing import List, Optional, TypedDict

from pydantic import BaseModel, Field


class Source(BaseModel):
    id: int
    name: str
    type: str
    launch_date: str
    description: str
    image_url: Optional[str]
    status: str

class SearchResult(Source):
    confidence_score: float


class SearchHistory(BaseModel):
    id: int
    query: str
    search_timestamp: datetime
    results: List[SearchResult] = Field(default_factory=list)


class DbSearchResult(TypedDict):
    """Type for search results returned from the database layer."""
    id: int
    name: str
    type: str
    launch_date: str
    description: str
    image_url: Optional[str]
    status: str
    name_matches: int
    description_matches: int