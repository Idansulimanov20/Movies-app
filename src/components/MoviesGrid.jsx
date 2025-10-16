import MovieCard from "./MovieCard";
import "../css/MoviesGrid.css";
function MoviesGrid({ movies }) {
  return (
    <div className="movies-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}

export default MoviesGrid;
