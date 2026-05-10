import "../css/MovieCard.css";
import { useAuth } from "../context/useAuth";
import { useMovieContext } from "../context/useMovieContext";
import logo from "../assets/icon.png";

function MovieCard({ movie }) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
  const { isAuthenticated } = useAuth();
  const favorite = isFavorite(movie.id);

  async function onFavoriteClick(event) {
    event.preventDefault();

    if (favorite) await removeFromFavorites(movie.id);
    else await addToFavorites(movie);
  }

  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  return (
    <div className="movie-card">
      <div className="movie-poster">
        {imageUrl ? (
          <img src={imageUrl} alt={movie.title} />
        ) : (
          <div className="movie-poster-placeholder" aria-label="Movie poster not available">
            <img src={logo} alt="" className="movie-placeholder-logo" />
            <span className="movie-placeholder-title">Poster unavailable</span>
            <span className="movie-placeholder-copy">Artwork has not been provided yet</span>
          </div>
        )}

        <div className="movie-overlay">
          {isAuthenticated && (
            <button
              className={`favorite-btn ${favorite ? "active" : ""}`}
              onClick={onFavoriteClick}
              aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            >
              <span aria-hidden="true">&hearts;</span>
            </button>
          )}
        </div>
      </div>

      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>{movie.release_date?.split("-")[0]}</p>
      </div>
    </div>
  );
}

export default MovieCard;
