import { FaBookmark, FaRegBookmark, FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import RecommendedMovieCard from "./RecommendedMovieCard";

function MovieAssistantConversationMessage({
  message,
  savedIds,
  onSaveAnswer,
  onFavoriteMovie,
  isRecommendationFavorite,
  savingFavoriteId,
  onFeedback,
  onFeedbackTextChange,
}) {
  const answerSaved = message.saved || savedIds.has(message.id);

  return (
    <article
      className={`ai-message ${message.role === "user" ? "user" : "assistant"}`}
    >
      <div className="ai-message-icon" aria-hidden="true">
        {message.role === "user" ? "You" : <HiSparkles aria-hidden />}
      </div>
      <div className="ai-message-body">
        <p>{message.content}</p>

        {message.recommendations?.length > 0 && (
          <div className="ai-recommendation-list">
            {message.recommendations.map((movie) => (
              <RecommendedMovieCard
                key={movie.id}
                movie={movie}
                onFavoriteClick={onFavoriteMovie}
                favoriteActive={isRecommendationFavorite(movie)}
                isSaving={savingFavoriteId === movie.id}
              />
            ))}
          </div>
        )}

        {message.role === "assistant" && (
          <div className="ai-message-actions">
            <button
              type="button"
              className={answerSaved ? "active" : ""}
              onClick={() => onSaveAnswer(message)}
            >
              {answerSaved ? (
                <FaBookmark aria-hidden="true" />
              ) : (
                <FaRegBookmark aria-hidden="true" />
              )}
              Save answer
            </button>
            <button
              type="button"
              className={message.feedback === "like" ? "active" : ""}
              onClick={() => onFeedback(message.id, "like")}
              aria-label="Like this AI answer"
            >
              <FaThumbsUp aria-hidden="true" />
            </button>
            <button
              type="button"
              className={message.feedback === "dislike" ? "active" : ""}
              onClick={() => onFeedback(message.id, "dislike")}
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
              onChange={(event) => onFeedbackTextChange(message.id, event.target.value)}
              maxLength={140}
              placeholder="Optional feedback for the demo"
            />
          </label>
        )}
      </div>
    </article>
  );
}

export default MovieAssistantConversationMessage;
