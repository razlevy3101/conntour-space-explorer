import json
import logging
import os
from typing import Dict, List

from models import DbSearchResult

logger = logging.getLogger(__name__)

class SpaceDB:
    def __init__(self):
        # Load and parse the JSON data
        data_path = os.path.join(os.path.dirname(__file__), "mock_data.json")
        with open(data_path, "r") as f:
            json_data = json.load(f)
        # Flatten and map the data to the expected format
        self._sources = []
        items = json_data.get("collection", {}).get("items", [])
        for idx, item in enumerate(items, start=1):
            data = item.get("data", [{}])[0]
            links = item.get("links", [])
            image_url = None
            for link in links:
                if link.get("render") == "image":
                    image_url = link.get("href")
                    break
            self._sources.append(
                {
                    "id": idx,
                    "name": data.get("title", f"NASA Item {idx}"),
                    "type": data.get("media_type", "unknown"),
                    "launch_date": data.get("date_created", ""),
                    "description": data.get("description", ""),
                    "image_url": image_url,
                    "status": "Active",
                }
            )
        self._next_id = len(self._sources) + 1

    def get_all_sources(self) -> List[Dict]:
        """Get all space sources."""
        return self._sources

    def search(self, keywords: List[str]) -> List[DbSearchResult]:
        """Return sources that contain any of the provided keywords."""

        if not keywords:
            logger.debug("DB search: no keywords provided")
            return []

        matches: List[DbSearchResult] = []

        for source in self._sources:
            name = source["name"].lower()
            description = source.get("description", "").lower()

            if any(keyword in name or keyword in description for keyword in keywords):
                matches.append({
                    **source,
                    "name_matches": len([keyword for keyword in keywords if keyword in name]),
                    "description_matches": len([keyword for keyword in keywords if keyword in description]),
                })

        logger.debug(
            f"Found {len(matches)} matching sources for keywords: {', '.join(keywords)}"
        )
        return matches
