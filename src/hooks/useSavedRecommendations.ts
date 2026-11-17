import { useEffect, useMemo, useState } from "react";
import type { SavedRecommendation } from "../types";
import { SAVED_RECOMMENDATIONS_KEY } from "../config/constants";
import { safelyReadSavedRecommendations } from "../pages/ai-assistance/lib/savedRecommendationsStorage";

export function useSavedRecommendations() {
  const [savedRecommendations, setSavedRecommendations] = useState<SavedRecommendation[]>(
    () => safelyReadSavedRecommendations(),
  );
  const [savedSearch, setSavedSearch] = useState("");

  useEffect(() => {
    localStorage.setItem(SAVED_RECOMMENDATIONS_KEY, JSON.stringify(savedRecommendations));
  }, [savedRecommendations]);

  const filteredSavedRecommendations = useMemo(() => {
    const query = savedSearch.trim().toLowerCase();
    if (!query) return savedRecommendations;
    return savedRecommendations.filter((item) => {
      const recommendationText = item.recommendations
        .map((movie) => `${movie.title} ${movie.release_date} ${movie.reason}`)
        .join(" ")
        .toLowerCase();
      return item.prompt.toLowerCase().includes(query) || item.content.toLowerCase().includes(query) || recommendationText.includes(query);
    });
  }, [savedRecommendations, savedSearch]);

  return { savedRecommendations, setSavedRecommendations, savedSearch, setSavedSearch, filteredSavedRecommendations };
}
