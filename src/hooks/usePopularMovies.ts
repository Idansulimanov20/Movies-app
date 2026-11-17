import { useEffect, useState } from "react";
import { getPopularMovies } from "../services/api";
import type { Movie } from "../types";

export function usePopularMovies() {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);

  useEffect(() => {
    let active = true;
    getPopularMovies()
      .then((movies) => {
        if (active) setPopularMovies(movies.filter((movie: Movie) => movie.poster_path).slice(0, 12));
      })
      .catch(() => {
        // The hero remains fully usable if the catalog is unavailable.
      });
    return () => { active = false; };
  }, []);

  return popularMovies;
}
