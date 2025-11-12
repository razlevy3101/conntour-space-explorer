from typing import List
import logging

from data.db import SpaceDB
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import Source, SearchResult
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


@app.get("/api/sources", response_model=List[Source])
def get_sources():
    sources = db.get_all_sources()
    logger.info("Fetched %d sources", len(sources))
    return sources

@app.get("/api/search", response_model=List[SearchResult])
def search(query: str):
    logger.info("Received search request: %s", query)
    results = perform_search(query, db)
    logger.info("Search completed for '%s' with %d result(s)", query, len(results))
    return results
