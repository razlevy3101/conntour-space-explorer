import logging
from datetime import datetime
from typing import List

from data.db import SpaceDB
from data.search_history_db import SearchHistoryDB
from fastapi import FastAPI, HTTPException, Response, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi_pagination import Page, Params, add_pagination, paginate
from models import SearchHistory, SearchResult, Source
from search import perform_search

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI()
add_pagination(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db = SpaceDB()
search_history_db = SearchHistoryDB()


# TODO: handle when client sents size > max_size
# Custom Params with default size
def pagination_params(
    page: int = 1,
    size: int = 10,
    max_size: int = 50,
) -> Params:
    return Params(page=page, size=size, max_size=max_size)


@app.get("/api/sources", response_model=Page[Source])
def get_sources(params: Params = Depends(pagination_params)):
    # return paginate([], params)
    # import time; time.sleep(1)
    sources = db.get_all_sources()
    logger.info(f"Fetched {len(sources)} sources - Page: {params.page}, Size: {params.size}")
    return paginate(sources, params)


@app.get("/api/search", response_model=Page[SearchResult])
def search(query: str, params: Params = Depends(pagination_params)):
    logger.info(f"Received search request: {query} - Page: {params.page}, Size: {params.size}")
    results = perform_search(query, db)
    logger.info(f"Search completed for '{query}' with {len(results)} result(s)")
    
    # Only save to search history if:
    # 1. This is the first page of results (page == 1)
    # 2. The same query wasn't searched within the last minute
    if params.page == 1 and search_history_db.should_create_new_history(query):
        search_history_db.add(
            query=query,
            results=results,
            search_timestamp=datetime.now(),
        )
        logger.info(f"Saved search history for query: '{query}'")
    
    return paginate(results, params)


@app.get("/api/search-history", response_model=Page[SearchHistory])
def get_search_history(params: Params = Depends(pagination_params)):
    history = sorted(
        search_history_db.list_all(),
        key=lambda item: item.search_timestamp,
        reverse=True,
    )
    logger.info(f"Fetched {len(history)} search history record(s) - Page: {params.page}, Size: {params.size}")
    return paginate(history, params)


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
