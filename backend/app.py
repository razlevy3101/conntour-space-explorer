import logging
from datetime import datetime
from typing import List

from data.db import SpaceDB
from data.search_history_db import SearchHistoryDB
from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from models import SearchHistory, SearchResult, Source
from search import perform_search

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db = SpaceDB()
search_history_db = SearchHistoryDB()


@app.get("/api/sources", response_model=List[Source])
def get_sources():
    sources = db.get_all_sources()
    logger.info(f"Fetched {len(sources)} sources")
    return sources

@app.get("/api/search", response_model=List[SearchResult])
def search(query: str):
    logger.info(f"Received search request: {query}")
    results = perform_search(query, db)
    logger.info(f"Search completed for '{query}' with {len(results)} result(s)")
    search_history_db.add(
        query=query,
        results=results,
        search_timestamp=datetime.now(),
    )
    return results


@app.get("/api/search-history", response_model=List[SearchHistory])
def get_search_history():
    history = search_history_db.list_all()
    logger.info(f"Fetched {len(history)} search history record(s)")
    return history


@app.get("/api/search-history/{history_id}", response_model=SearchHistory)
def get_search_history_item(history_id: int):
    history = search_history_db.get(history_id)
    if not history:
        raise HTTPException(status_code=404, detail="Search history not found")
    return history


@app.delete("/api/search-history/{history_id}", status_code=204)
def delete_search_history(history_id: int):
    if not search_history_db.delete(history_id):
        raise HTTPException(status_code=404, detail="Search history not found")
    return Response(status_code=204)
