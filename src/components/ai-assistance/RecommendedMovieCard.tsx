import { FaCheck, FaHeart } from "react-icons/fa";

/** One suggested movie from the assistant, with add-to-favorites. */
function RecommendedMovieCard({
  movie,
  onFavoriteClick,
  favoriteActive,
  isSaving,
}) {
  return (
    <div className="ai-recommendation-card">
      <div>
        <p className="ai-movie-year">{movie.release_date?.split("-")[0] || "TBA"}</p>
        <h3>{movie.title}</h3>
        <p>{movie.reason}</p>
      </div>
      <button
        type="button"
        className="ai-favorite-button"
        onClick={() => onFavoriteClick(movie)}
        disabled={isSaving}
        aria-label={`Save ${movie.title} to favorites`}
      >
        {favoriteActive ? (
          <FaCheck aria-hidden="true" />
        ) : (
          <FaHeart aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

export default RecommendedMovieCard;
