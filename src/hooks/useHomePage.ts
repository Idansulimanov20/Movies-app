import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getPopularMovies, searchMovies } from "../services/api";

const GENERIC_FETCH_ERROR =
  "We could not load movies right now. Please try again later.";

export function useHomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterText, setFilterText] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDefaultMovies = useCallback(async () => {
    setLoading(true);
    try {
      const moviesData = await getPopularMovies();
      setMovies(moviesData);
    } catch (err) {
      console.error("Failed to fetch popular movies:", err);
      toast.error(GENERIC_FETCH_ERROR, {
        toastId: "popular-movies-error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDefaultMovies();
  }, [loadDefaultMovies]);

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!searchQuery.trim()) return;
    if (loading) return;

    setLoading(true);
    try {
      const results = await searchMovies(searchQuery);
      setMovies(results);
      setFilterText("");
      setYearFilter("");
    } catch (err) {
      console.error("Failed to search movies:", err);
      toast.error(GENERIC_FETCH_ERROR, {
        toastId: "search-movies-error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = async () => {
    setSearchQuery("");
    setFilterText("");
    setYearFilter("");
    await loadDefaultMovies();
  };

  const filteredMovies = movies.filter((movie) => {
    const matchesTitle =
      movie.title &&
      movie.title.toLowerCase().includes(filterText.toLowerCase());

    const matchesYear =
      !yearFilter ||
      (movie.release_date && movie.release_date.startsWith(yearFilter));

    return matchesTitle && matchesYear;
  });

  return {
    searchQuery,
    setSearchQuery,
    filterText,
    setFilterText,
    yearFilter,
    setYearFilter,
    movies,
    loading,
    handleSearch,
    handleClearSearch,
    filteredMovies,
  };
}
