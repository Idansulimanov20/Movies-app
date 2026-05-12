import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBookmark,
  FaCheck,
  FaCommentDots,
  FaHeart,
  FaPaperPlane,
  FaRegBookmark,
  FaRobot,
  FaSearch,
  FaThumbsDown,
  FaThumbsUp,
  FaTrashAlt,
} from "react-icons/fa";
import { SiOpenai } from "react-icons/si";
import { toast } from "react-toastify";
import { useAuth } from "../context/useAuth";
import { useMovieContext } from "../context/useMovieContext";
import "../css/AIAssistance.css";

const SAVED_RECOMMENDATIONS_KEY = "watch-and-chill-ai-recommendations";
const MAX_PROMPT_LENGTH = 240;

const MOVIE_LIBRARY = [
  {
    id: 91001,
    title: "Heat",
    release_date: "1995-12-15",
    genres: ["90s", "action", "crime", "thriller"],
    moods: ["intense", "smart", "cat-and-mouse"],
    reason:
      "A polished 90s crime epic with tense set pieces, big personalities, and a famous downtown shootout.",
  },
  {
    id: 91002,
    title: "Terminator 2: Judgment Day",
    release_date: "1991-07-03",
    genres: ["90s", "action", "sci-fi"],
    moods: ["blockbuster", "explosive", "iconic"],
    reason:
      "A clean pick when someone wants 90s action, memorable effects, and relentless momentum.",
  },
  {
    id: 91003,
    title: "Speed",
    release_date: "1994-06-10",
    genres: ["90s", "action", "thriller"],
    moods: ["fast", "suspense", "fun"],
    reason:
      "A high-concept action thriller that stays simple, urgent, and wildly rewatchable.",
  },
  {
    id: 91004,
    title: "The Matrix",
    release_date: "1999-03-31",
    genres: ["90s", "action", "sci-fi"],
    moods: ["stylish", "mind-bending", "cool"],
    reason:
      "Ideal for cyberpunk action, slick fight choreography, and a story with big ideas.",
  },
  {
    id: 91005,
    title: "Point Break",
    release_date: "1991-07-12",
    genres: ["90s", "action", "crime"],
    moods: ["sunny", "reckless", "cult"],
    reason:
      "A breezy action-crime ride with surfing, undercover tension, and cult-movie energy.",
  },
  {
    id: 91006,
    title: "The Fugitive",
    release_date: "1993-08-06",
    genres: ["90s", "thriller", "action"],
    moods: ["chase", "smart", "suspense"],
    reason:
      "A sharp man-on-the-run thriller for viewers who want action with detective tension.",
  },
  {
    id: 91007,
    title: "Jurassic Park",
    release_date: "1993-06-11",
    genres: ["90s", "adventure", "sci-fi"],
    moods: ["wonder", "suspense", "family"],
    reason:
      "A crowd-pleasing adventure with awe, danger, and the kind of spectacle that still lands.",
  },
  {
    id: 91008,
    title: "Clueless",
    release_date: "1995-07-19",
    genres: ["90s", "comedy", "romance"],
    moods: ["light", "stylish", "funny"],
    reason:
      "A bright 90s comedy pick when the request leans charming, stylish, and easy to watch.",
  },
  {
    id: 91009,
    title: "The Shawshank Redemption",
    release_date: "1994-09-23",
    genres: ["drama", "classic"],
    moods: ["hopeful", "emotional", "slow-burn"],
    reason:
      "A reliable classic for a thoughtful, emotional movie night with a satisfying payoff.",
  },
  {
    id: 91010,
    title: "Mad Max: Fury Road",
    release_date: "2015-05-15",
    genres: ["action", "adventure"],
    moods: ["chaotic", "visual", "nonstop"],
    reason:
      "A modern action blast when the viewer wants pure momentum and striking visuals.",
  },
  {
    id: 91011,
    title: "Knives Out",
    release_date: "2019-11-27",
    genres: ["mystery", "comedy", "crime"],
    moods: ["clever", "funny", "twisty"],
    reason:
      "Great for a playful mystery with a strong ensemble and enough twists to keep everyone engaged.",
  },
  {
    id: 91012,
    title: "Spider-Man: Into the Spider-Verse",
    release_date: "2018-12-14",
    genres: ["animation", "action", "family"],
    moods: ["colorful", "heartfelt", "energetic"],
    reason:
      "A lively animated pick with action, humor, and a lot of heart.",
  },
  {
    id: 91013,
    title: "Before Sunrise",
    release_date: "1995-01-27",
    genres: ["90s", "romance", "drama"],
    moods: ["talky", "intimate", "gentle"],
    reason:
      "Perfect for a romantic, conversation-driven movie that feels human and low-key.",
  },
  {
    id: 91014,
    title: "Alien",
    release_date: "1979-05-25",
    genres: ["horror", "sci-fi"],
    moods: ["tense", "claustrophobic", "scary"],
    reason:
      "A classic choice for slow-building sci-fi horror and serious tension.",
  },
  {
    id: 91015,
    title: "Paddington 2",
    release_date: "2017-11-10",
    genres: ["family", "comedy", "adventure"],
    moods: ["cozy", "kind", "funny"],
    reason:
      "A warm, beautifully made comfort movie when the request asks for something wholesome.",
  },
];

const STARTER_PROMPTS = [
  "90s action movies",
  "A cozy family movie",
  "Smart mystery with humor",
  "Sci-fi action with style",
  "A romantic 90s movie",
];

const INITIAL_MESSAGES = [
  {
    id: "welcome",
    role: "assistant",
    prompt: "Built-in recommendations",
    content:
      "Tell me the mood, decade, genre, actor, or situation. I will suggest a few movie names and explain why they fit.",
    recommendations: MOVIE_LIBRARY.filter((movie) =>
      ["Heat", "Terminator 2: Judgment Day", "Speed"].includes(movie.title),
    ),
    saved: false,
    feedback: null,
    feedbackText: "",
  },
];

function normalizeMovie(movie) {
  return {
    id: movie.id,
    title: movie.title,
    release_date: movie.release_date,
    poster_path: movie.poster_path || null,
    overview: movie.reason,
    vote_average: movie.vote_average || 0,
  };
}

function safelyReadSavedRecommendations() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(SAVED_RECOMMENDATIONS_KEY) || "[]",
    );
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function buildMockRecommendation(prompt) {
  const normalizedPrompt = prompt.toLowerCase();
  const words = normalizedPrompt
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 1);

  const scoredMovies = MOVIE_LIBRARY.map((movie) => {
    const searchableText = [
      movie.title,
      movie.release_date.split("-")[0],
      ...movie.genres,
      ...movie.moods,
      movie.reason,
    ]
      .join(" ")
      .toLowerCase();

    const score = words.reduce((total, word) => {
      if (searchableText.includes(word)) return total + 3;
      if (word === "nineties" && searchableText.includes("90s")) return total + 3;
      if (word === "scary" && searchableText.includes("horror")) return total + 2;
      if (word === "kids" && searchableText.includes("family")) return total + 2;
      return total;
    }, 0);

    return { movie, score };
  })
    .sort((left, right) => right.score - left.score)
    .map(({ movie, score }) => ({ ...movie, score }));

  const strongMatches = scoredMovies.filter((movie) => movie.score > 0);
  const recommendations = (strongMatches.length ? strongMatches : scoredMovies)
    .slice(0, 4)
    .map((rankedMovie) => {
      const movie = { ...rankedMovie };
      delete movie.score;
      return movie;
    });

  const lower = prompt.trim().toLowerCase();
  const content =
    strongMatches.length > 0
      ? `Here are ${recommendations.length} picks that match "${prompt.trim()}". I weighted genre, mood, decade, and title clues from your request.`
      : `I could not find an exact mock match for "${prompt.trim()}", so here are flexible crowd-pleasers to start from. Try adding a genre, decade, or mood for sharper picks.`;

  return {
    content,
    recommendations:
      lower.includes("90") && lower.includes("action")
        ? MOVIE_LIBRARY.filter((movie) =>
            ["Heat", "Terminator 2: Judgment Day", "Speed", "The Matrix"].includes(
              movie.title,
            ),
          )
        : recommendations,
  };
}

function AIAssistance() {
  const { isAuthenticated } = useAuth();
  const { addToFavorites, isFavorite } = useMovieContext();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [prompt, setPrompt] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [savedRecommendations, setSavedRecommendations] = useState(() =>
    safelyReadSavedRecommendations(),
  );
  const [savedSearch, setSavedSearch] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(
      SAVED_RECOMMENDATIONS_KEY,
      JSON.stringify(savedRecommendations),
    );
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
    setSavedRecommendations((current) =>
      current.filter((item) => item.id !== savedId),
    );
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

    if (isFavorite(movie.id)) {
      toast.info(`${movie.title} is already in your favorites.`, {
        toastId: `favorite-exists-${movie.id}`,
      });
      return;
    }

    await addToFavorites(normalizeMovie(movie));
    toast.success(`${movie.title} saved to favorites.`);
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
      <header className="ai-hero">
        <div className="ai-hero-copy">
          <p className="ai-eyebrow">Mock AI movie concierge</p>
          <h1>Ask for the movie name you have in mind</h1>
          <p>
            Describe the vibe, decade, genre, or occasion. This demo uses a
            local mock recommender until the server gets real AI infrastructure.
          </p>
        </div>
        <div className="ai-hero-icons" aria-label="AI assistant style">
          <span>
            <SiOpenai aria-hidden="true" />
            ChatGPT-style
          </span>
          <span>
            <FaRobot aria-hidden="true" />
            Movie bot
          </span>
          <span>
            <FaCommentDots aria-hidden="true" />
            Feedback ready
          </span>
        </div>
      </header>

      <div className="ai-tabs" role="tablist" aria-label="AI assistance sections">
        <button
          type="button"
          className={activeTab === "chat" ? "active" : ""}
          onClick={() => setActiveTab("chat")}
          role="tab"
          aria-selected={activeTab === "chat"}
        >
          <FaRobot aria-hidden="true" />
          Chat
        </button>
        <button
          type="button"
          className={activeTab === "saved" ? "active" : ""}
          onClick={() => setActiveTab("saved")}
          role="tab"
          aria-selected={activeTab === "saved"}
        >
          <FaBookmark aria-hidden="true" />
          Saved ({savedRecommendations.length})
        </button>
      </div>

      {activeTab === "chat" ? (
        <section className="ai-layout" aria-label="AI recommendations chat">
          <aside className="ai-sidebar">
            <div className="ai-sidebar-section">
              <h2>Built-in ideas</h2>
              <div className="ai-prompt-list">
                {STARTER_PROMPTS.map((starterPrompt) => (
                  <button
                    type="button"
                    key={starterPrompt}
                    onClick={() => handleStarterPrompt(starterPrompt)}
                    disabled={isThinking}
                  >
                    {starterPrompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="ai-sidebar-section">
              <h2>Demo coverage</h2>
              <p>
                Handles empty prompts, long prompts, duplicate saves, no exact
                mock matches, unauthenticated favorite saves, and feedback on
                each AI answer.
              </p>
            </div>
          </aside>

          <section className="ai-chat-shell">
            <div className="ai-chat-header">
              <div className="ai-avatar">
                <SiOpenai aria-hidden="true" />
              </div>
              <div>
                <h2>Watch & Chill AI</h2>
                <p>Mock mode active</p>
              </div>
            </div>

            <div className="ai-messages" aria-live="polite">
              {messages.map((message) => (
                <article
                  key={message.id}
                  className={`ai-message ${message.role === "user" ? "user" : "assistant"}`}
                >
                  <div className="ai-message-icon" aria-hidden="true">
                    {message.role === "user" ? "You" : <FaRobot />}
                  </div>
                  <div className="ai-message-body">
                    <p>{message.content}</p>

                    {message.recommendations?.length > 0 && (
                      <div className="ai-recommendation-list">
                        {message.recommendations.map((movie) => (
                          <div className="ai-recommendation-card" key={movie.id}>
                            <div>
                              <p className="ai-movie-year">
                                {movie.release_date?.split("-")[0] || "TBA"}
                              </p>
                              <h3>{movie.title}</h3>
                              <p>{movie.reason}</p>
                            </div>
                            <button
                              type="button"
                              className="ai-favorite-button"
                              onClick={() => saveMovieToFavorites(movie)}
                              aria-label={`Save ${movie.title} to favorites`}
                            >
                              {isFavorite(movie.id) ? (
                                <FaCheck aria-hidden="true" />
                              ) : (
                                <FaHeart aria-hidden="true" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {message.role === "assistant" && (
                      <div className="ai-message-actions">
                        <button
                          type="button"
                          className={message.saved || savedIds.has(message.id) ? "active" : ""}
                          onClick={() => saveAssistantMessage(message)}
                        >
                          {message.saved || savedIds.has(message.id) ? (
                            <FaBookmark aria-hidden="true" />
                          ) : (
                            <FaRegBookmark aria-hidden="true" />
                          )}
                          Save answer
                        </button>
                        <button
                          type="button"
                          className={message.feedback === "like" ? "active" : ""}
                          onClick={() => updateFeedback(message.id, "like")}
                          aria-label="Like this AI answer"
                        >
                          <FaThumbsUp aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className={message.feedback === "dislike" ? "active" : ""}
                          onClick={() => updateFeedback(message.id, "dislike")}
                          aria-label="Dislike this AI answer"
                        >
                          <FaThumbsDown aria-hidden="true" />
                        </button>
                      </div>
                    )}

                    {message.feedback && (
                      <label className="ai-feedback-field">
                        <span>
                          {message.feedback === "like"
                            ? "What worked well?"
                            : "What should be better?"}
                        </span>
                        <input
                          type="text"
                          value={message.feedbackText}
                          onChange={(event) =>
                            updateFeedbackText(message.id, event.target.value)
                          }
                          maxLength={140}
                          placeholder="Optional feedback for the demo"
                        />
                      </label>
                    )}
                  </div>
                </article>
              ))}

              {isThinking && (
                <article className="ai-message assistant">
                  <div className="ai-message-icon" aria-hidden="true">
                    <FaRobot />
                  </div>
                  <div className="ai-message-body">
                    <div className="ai-thinking">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </article>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="ai-chat-form" onSubmit={handleSubmit}>
              <label htmlFor="ai-prompt">Ask for recommendations</label>
              <div className="ai-input-row">
                <input
                  id="ai-prompt"
                  type="text"
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  maxLength={MAX_PROMPT_LENGTH}
                  placeholder="Try: 90s action movies with big set pieces"
                  disabled={isThinking}
                />
                <button type="submit" disabled={isThinking}>
                  <FaPaperPlane aria-hidden="true" />
                  Send
                </button>
              </div>
              <p className="ai-character-count">
                {prompt.length}/{MAX_PROMPT_LENGTH}
              </p>
            </form>
          </section>
        </section>
      ) : (
        <section className="ai-saved-panel">
          <div className="ai-saved-header">
            <div>
              <p className="ai-eyebrow">Saved recommendation sets</p>
              <h2>Browse and search your AI answers</h2>
            </div>
            <label className="ai-saved-search">
              <FaSearch aria-hidden="true" />
              <input
                type="search"
                value={savedSearch}
                onChange={(event) => setSavedSearch(event.target.value)}
                placeholder="Search saved recommendations"
              />
            </label>
          </div>

          {filteredSavedRecommendations.length > 0 ? (
            <div className="ai-saved-list">
              {filteredSavedRecommendations.map((item) => (
                <article className="ai-saved-card" key={item.id}>
                  <div className="ai-saved-card-header">
                    <div>
                      <p className="ai-movie-year">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                      <h3>{item.prompt}</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSavedRecommendation(item.id)}
                      aria-label="Remove saved recommendation"
                    >
                      <FaTrashAlt aria-hidden="true" />
                    </button>
                  </div>
                  <p>{item.content}</p>
                  <div className="ai-saved-movies">
                    {item.recommendations.map((movie) => (
                      <div key={movie.id} className="ai-saved-movie">
                        <span>
                          {movie.title} ({movie.release_date?.split("-")[0] || "TBA"})
                        </span>
                        <button
                          type="button"
                          onClick={() => saveMovieToFavorites(movie)}
                        >
                          {isFavorite(movie.id) ? (
                            <FaCheck aria-hidden="true" />
                          ) : (
                            <FaHeart aria-hidden="true" />
                          )}
                          Favorite
                        </button>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="ai-empty-state">
              <FaRegBookmark aria-hidden="true" />
              <h2>No saved recommendations found</h2>
              <p>
                Save an AI answer from the chat, then come back here to search
                it and move movies into favorites.
              </p>
              <button type="button" onClick={() => setActiveTab("chat")}>
                Back to chat
              </button>
            </div>
          )}

          {!isAuthenticated && (
            <p className="ai-auth-note">
              Want saved movies in Favorites too? <Link to="/login">Sign in</Link>{" "}
              before pressing Favorite.
            </p>
          )}
        </section>
      )}
    </div>
  );
}

export default AIAssistance;
