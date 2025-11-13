import logging
from datetime import datetime
from typing import Dict, List, Optional

from models import SearchHistory, SearchResult

logger = logging.getLogger(__name__)


class SearchHistoryDB:
    def __init__(self) -> None:
        self._history: Dict[int, SearchHistory] = {}
        self._next_id: int = 1

    def list_all(self) -> List[SearchHistory]:
        logger.debug(f"Retrieving {len(self._history)} search history record(s)")
        return list(self._history.values())

    def add(
        self,
        query: str,
        results: List[SearchResult],
        search_timestamp: Optional[datetime] = None,
    ) -> SearchHistory:
        timestamp = search_timestamp or datetime.now()
        history = SearchHistory(
            id=self._next_id,
            query=query,
            search_timestamp=timestamp,
            results=[result.copy(deep=True) for result in results],
        )
        self._history[history.id] = history
        self._next_id += 1

        logger.debug(f"Stored search history id={history.id} for query={query}")
        return history

    def delete(self, history_id: int) -> bool:
        if history_id in self._history:
            del self._history[history_id]
            logger.debug(f"Deleted search history id={history_id}")
            return True

        logger.debug(f"Attempted to delete missing search history id={history_id}")
        return False

    def get(self, history_id: int) -> Optional[SearchHistory]:
        return self._history.get(history_id)


