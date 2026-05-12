import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import MovieAssistantChatWorkspace from "../../components/ai-assistance/MovieAssistantChatWorkspace";
import MovieAssistantIntroBanner from "../../components/ai-assistance/MovieAssistantIntroBanner";
import MovieAssistantQuickPromptsSidebar from "../../components/ai-assistance/MovieAssistantQuickPromptsSidebar";
import MovieAssistantSavedAnswersPanel from "../../components/ai-assistance/MovieAssistantSavedAnswersPanel";
import MovieAssistantWorkspaceTabs from "../../components/ai-assistance/MovieAssistantWorkspaceTabs";
import { useAuth } from "../../context/useAuth";
import { useMovieContext } from "../../context/useMovieContext";
import "../../css/AIAssistance.css";
import {
  resolveRecommendationToTmdbMovie,
  TmdbMatchError,
} from "../../services/tmdbMatch";
import { MAX_PROMPT_LENGTH, SAVED_RECOMMENDATIONS_KEY } from "./constants";
import {
  buildMockRecommendation,
  createInitialMessages,
  STARTER_PROMPTS,
} from "./mockRecommendation";
import { safelyReadSavedRecommendations } from "./savedRecommendationsStorage";

function MovieAssistantPage() {
  const { isAuthenticated } = useAuth();
  const { addToFavorites, isFavorite, favorites } = useMovieContext();
  const [messages, setMessages] = useState(createInitialMessages);
  const [prompt, setPrompt] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [savedRecommendations, setSavedRecommendations] = useState(() =>
    safelyReadSavedRecommendations(),
  );
  const [savedSearch, setSavedSearch] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const [savingFavoriteId, setSavingFavoriteId] = useState(null);
  const [tmdbIdByMockKey, setTmdbIdByMockKey] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(SAVED_RECOMMENDATIONS_KEY, JSON.stringify(savedRecommendations));
  }, [savedRecommendations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isThinking]);

  const savedIds = useMemo(
    () => new Set(savedRecommendations.map((item) => item.id)),
    [savedRecommendations],
  );

  const filteredSavedRecommendations = useMemo(() => {
    const query = savedSearch.trim().toLowerCase();
    if (!query) return savedRecommendations;

    return savedRecommendations.filter((item) => {
      const recommendationText = item.recommendations
        .map((movie) => `${movie.title} ${movie.release_date} ${movie.reason}`)
        .join(" ")
        .toLowerCase();
      return (
        item.prompt.toLowerCase().includes(query) ||
        item.content.toLowerCase().includes(query) ||
        recommendationText.includes(query)
      );
    });
  }, [savedRecommendations, savedSearch]);

  const isRecommendationFavorite = useCallback(
    (movie) => {
      const mapped = tmdbIdByMockKey[movie.id];
      if (mapped != null) return isFavorite(mapped);
      return favorites.some(
        (f) => f.title?.toLowerCase() === movie.title?.toLowerCase(),
      );
    },
    [favorites, isFavorite, tmdbIdByMockKey],
  );

  function saveAssistantMessage(message) {
    if (!message.recommendations?.length) return;

    if (savedIds.has(message.id)) {
      toast.info("This recommendation set is already saved.", {
        toastId: `already-saved-${message.id}`,
      });
      return;
    }

    const savedItem = {
      id: message.id,
      prompt: message.prompt || "Built-in recommendations",
      content: message.content,
      recommendations: message.recommendations,
      createdAt: new Date().toISOString(),
    };

    setSavedRecommendations((current) => [savedItem, ...current]);
    setMessages((current) =>
      current.map((item) =>
        item.id === message.id ? { ...item, saved: true } : item,
      ),
    );
    toast.success("Recommendation saved.");
  }

  function removeSavedRecommendation(savedId) {
    setSavedRecommendations((current) => current.filter((item) => item.id !== savedId));
  }

  function updateFeedback(messageId, feedback) {
    setMessages((current) =>
      current.map((message) =>
        message.id === messageId
          ? {
              ...message,
              feedback: message.feedback === feedback ? null : feedback,
            }
          : message,
      ),
    );
  }

  function updateFeedbackText(messageId, feedbackText) {
    setMessages((current) =>
      current.map((message) =>
        message.id === messageId ? { ...message, feedbackText } : message,
      ),
    );
  }

  async function saveMovieToFavorites(movie) {
    if (!isAuthenticated) {
      toast.info("Sign in to save AI picks to favorites.", {
        toastId: "ai-favorites-login",
      });
      return;
    }

    if (savingFavoriteId === movie.id) return;

    setSavingFavoriteId(movie.id);

    try {
      const tmdbMovie = await resolveRecommendationToTmdbMovie(movie);

      if (isFavorite(tmdbMovie.id)) {
        toast.info(`${tmdbMovie.title} is already in your favorites.`, {
          toastId: `favorite-exists-${tmdbMovie.id}`,
        });
        setTmdbIdByMockKey((prev) => ({ ...prev, [movie.id]: tmdbMovie.id }));
        return;
      }

      await addToFavorites(tmdbMovie);
      setTmdbIdByMockKey((prev) => ({ ...prev, [movie.id]: tmdbMovie.id }));
      toast.success(`${tmdbMovie.title} saved to favorites.`);
    } catch (error) {
      console.error(error);
      const msg =
        error instanceof TmdbMatchError && error.code === "NO_RESULTS"
          ? "Could not find this title in the movie catalog. Try again later."
          : "Could not load movie data from the catalog.";
      toast.error(msg, { toastId: "ai-tmdb-resolve-error" });
    } finally {
      setSavingFavoriteId(null);
    }
  }

  function submitPrompt(nextPrompt = prompt) {
    const trimmedPrompt = nextPrompt.trim();

    if (!trimmedPrompt) {
      toast.info("Ask for a mood, decade, genre, or movie-night idea first.", {
        toastId: "empty-ai-prompt",
      });
      return;
    }

    if (trimmedPrompt.length > MAX_PROMPT_LENGTH) {
      toast.error(`Keep the request under ${MAX_PROMPT_LENGTH} characters.`);
      return;
    }

    if (isThinking) return;

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmedPrompt,
    };

    setMessages((current) => [...current, userMessage]);
    setPrompt("");
    setIsThinking(true);

    window.setTimeout(() => {
      const response = buildMockRecommendation(trimmedPrompt);
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          prompt: trimmedPrompt,
          content: response.content,
          recommendations: response.recommendations,
          saved: false,
          feedback: null,
          feedbackText: "",
        },
      ]);
      setIsThinking(false);
    }, 520);
  }

  function handleSubmit(event) {
    event.preventDefault();
    submitPrompt();
  }

  function handleStarterPrompt(starterPrompt) {
    setActiveTab("chat");
    submitPrompt(starterPrompt);
  }

  return (
    <div className="ai-assistance-page">
      <MovieAssistantIntroBanner />

      <MovieAssistantWorkspaceTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        savedCount={savedRecommendations.length}
      />

      {activeTab === "chat" ? (
        <section className="ai-layout" aria-label="Movie assistant recommendations chat">
          <MovieAssistantQuickPromptsSidebar
            isThinking={isThinking}
            onStarterPrompt={handleStarterPrompt}
            starterPrompts={STARTER_PROMPTS}
          />
          <MovieAssistantChatWorkspace
            messages={messages}
            savedIds={savedIds}
            isThinking={isThinking}
            messagesEndRef={messagesEndRef}
            prompt={prompt}
            maxPromptLength={MAX_PROMPT_LENGTH}
            onPromptChange={setPrompt}
            onSubmit={handleSubmit}
            onSaveAnswer={saveAssistantMessage}
            onFavoriteMovie={saveMovieToFavorites}
            isRecommendationFavorite={isRecommendationFavorite}
            savingFavoriteId={savingFavoriteId}
            onFeedback={updateFeedback}
            onFeedbackTextChange={updateFeedbackText}
          />
        </section>
      ) : (
        <MovieAssistantSavedAnswersPanel
          filteredSavedRecommendations={filteredSavedRecommendations}
          savedSearch={savedSearch}
          onSavedSearchChange={setSavedSearch}
          onRemoveSaved={removeSavedRecommendation}
          onFavoriteMovie={saveMovieToFavorites}
          isRecommendationFavorite={isRecommendationFavorite}
          savingFavoriteId={savingFavoriteId}
          onBackToChat={() => setActiveTab("chat")}
          isAuthenticated={isAuthenticated}
        />
      )}
    </div>
  );
}

export default MovieAssistantPage;
