import logging
from typing import List

from data.consts import NATURAL_WORDS
from data.db import SpaceDB
from models import DbSearchResult, SearchResult

logger = logging.getLogger(__name__)

NAME_WEIGHT = 2.0
DESCRIPTION_WEIGHT = 1.0


"""
Possible additions: if search has the word 'image' look for the type of the db obj and match score
"""
# def _score_source(keywords: List[str], source: DbSearchResult) -> float:
#     """Score by giving points for each keyword match in name and description, while name is more important"""
#     score = 0.0
#     score += source.get("name_matches", 0) * NAME_WEIGHT
#     score += source.get("description_matches", 0) * DESCRIPTION_WEIGHT
#     logger.debug(f"Score: {score} for source: {source.get('name', '')}")
#     return score


def _score_source(keywords: List[str], source: DbSearchResult) -> float:
    """Score by checking how many keywords are in the source data, return by percentage"""
    if " ".join(keywords).lower() == source.get("name", "").lower():
        return 99.9
    if " ".join(keywords).lower() == source.get("description", "").lower():
        return 99.9

    total_data = source.get("name", "").split() + source.get("description", "").split()
    total_data_length = len([word for word in total_data if word and word not in NATURAL_WORDS])
    matches = source.get("name_matches", 0) + source.get("description_matches", 0)
    score = matches * 100 / total_data_length
    logger.debug(f"Matches: {matches}, Total length: {total_data_length}, Score: {score}")
    return score


def score_sources(keywords: List[str], sources: List[DbSearchResult]) -> List[SearchResult]:
    if not keywords:
        logger.debug("score_sources called with no keywords")
        return []

    scored_results: List[SearchResult] = []

    for source in sources:
        score = _score_source(keywords, source)
        if score > 0:
            # Exclude name_matches and description_matches when creating SearchResult
            source_data = {k: v for k, v in source.items() if k not in ("name_matches", "description_matches")}
            scored_results.append(
                SearchResult(
                    **source_data,
                    confidence_score=score,
                )
            )

    scored_results.sort(key=lambda item: item.confidence_score, reverse=True)
    logger.debug(
        f"Scored {len(scored_results)} source(s) using keywords: {', '.join(keywords)}"
    )
    return scored_results


def perform_search(query: str, db: SpaceDB) -> List[SearchResult]:
    keywords = [keyword for keyword in query.lower().split() if keyword and keyword not in NATURAL_WORDS]
    logger.info(f"Processing search query with keywords: {', '.join(keywords)}")
    if not keywords:
        logger.debug("perform_search called with no keywords")
        return []

    matched_sources = db.search(keywords)
    logger.debug(f"Database returned {len(matched_sources)} candidate source(s)")
    return score_sources(keywords, matched_sources)