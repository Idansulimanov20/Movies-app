import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMovieContext } from "../contexts/useMovieContext";
import { createInitialMessages } from "../pages/ai-assistance/lib/mockRecommendation";
import type { AssistantMessage } from "../types";

export function useMovieAssistantState() {
  const { isFavorite, favorites } = useMovieContext();
  const [messages, setMessages] = useState<AssistantMessage[]>(createInitialMessages);
  const [prompt, setPrompt] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [savingFavoriteId, setSavingFavoriteId] = useState(null);
  const [tmdbIdByMockKey, setTmdbIdByMockKey] = useState<Record<number, number>>({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isThinking]);

  const isRecommendationFavorite = useCallback(
    (movie) => {
      const mapped = tmdbIdByMockKey[movie.id];
      if (mapped != null) return isFavorite(mapped);
      return favorites.some(
        (favorite) => favorite.title?.toLowerCase() === movie.title?.toLowerCase(),
      );
    },
    [favorites, isFavorite, tmdbIdByMockKey],
  );

  return {
    messages,
    setMessages,
    prompt,
    setPrompt,
    isThinking,
    setIsThinking,
    activeTab,
    setActiveTab,
    savingFavoriteId,
    setSavingFavoriteId,
    tmdbIdByMockKey,
    setTmdbIdByMockKey,
    messagesEndRef,
    isRecommendationFavorite,
  };
}
