import "../../styles/Favorites.css";
import { useMovieContext } from "../../contexts/useMovieContext";
import MoviesGrid from "../../components/movies/MoviesGrid";
import Loader from "../../components/Loader";
function Favorites() {
  const { favorites, favoritesLoading } = useMovieContext();

  if (favoritesLoading) return <Loader />;

  if (favorites.length > 0) {
    return (
      <div className="favorites">
        <header className="favorites-header">
          <p className="favorites-eyebrow">Personal library</p>
          <h2>Movies you saved for later</h2>
          <p className="favorites-header-copy">
            Your hand-picked watchlist is ready whenever movie night starts.
          </p>
        </header>
        <MoviesGrid movies={favorites} />
      </div>
    );
  }

  return (
    <div className="favorites-empty">
      <h2>No Favorite Movies Yet</h2>
      <p>Start adding movies to your favorites and they will appear here!</p>
    </div>
  );
}

export default Favorites;
