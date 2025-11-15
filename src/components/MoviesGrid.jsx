import MovieCard from "./MovieCard";
import "../css/MoviesGrid.css";
function MoviesGrid({ movies }) {
  if (!movies || movies.length === 0) {
    return (
      <div className="favorites-empty">
        <h2>No movies found</h2>
        <p>
          We couldn’t find any movies matching your search. Try adjusting search
          term to see more movies.
        </p>
      </div>
    );
  }
  return (
    <div className="movies-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}

export default MoviesGrid;
