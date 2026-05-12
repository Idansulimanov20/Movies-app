import { Link } from "react-router-dom";
import { FaCheck, FaHeart, FaRegBookmark, FaSearch, FaTrashAlt } from "react-icons/fa";

/** Lists locally saved assistant answers and supports moving picks to favorites. */
function MovieAssistantSavedAnswersPanel({
  filteredSavedRecommendations,
  savedSearch,
  onSavedSearchChange,
  onRemoveSaved,
  onFavoriteMovie,
  isRecommendationFavorite,
  savingFavoriteId,
  onBackToChat,
  isAuthenticated,
}) {
  return (
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
            onChange={(event) => onSavedSearchChange(event.target.value)}
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
                  onClick={() => onRemoveSaved(item.id)}
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
                      onClick={() => onFavoriteMovie(movie)}
                      disabled={savingFavoriteId === movie.id}
                    >
                      {isRecommendationFavorite(movie) ? (
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
            Save an AI answer from the chat, then come back here to search it and move movies
            into favorites.
          </p>
          <button type="button" onClick={onBackToChat}>
            Back to chat
          </button>
        </div>
      )}

      {!isAuthenticated && (
        <p className="ai-auth-note">
          Want saved movies in Favorites too? <Link to="/login">Sign in</Link> before pressing
          Favorite.
        </p>
      )}
    </section>
  );
}

export default MovieAssistantSavedAnswersPanel;
