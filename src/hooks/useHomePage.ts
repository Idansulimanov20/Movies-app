import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { discoverMoviesPage, getMovieGenres, getPopularMoviesPage, searchMoviesPage } from "../services/api";

const GENERIC_FETCH_ERROR = "We could not load movies right now. Please try again later.";
export const DEFAULT_DISCOVERY_FILTERS = { titleQuery: "", genreIds: [], yearFrom: "", yearTo: "", minRating: 0, sortBy: "popularity.desc" };

const appendUniqueMovies = (current, incoming) => {
  const knownIds = new Set(current.map((movie) => movie.id));
  return [...current, ...incoming.filter((movie) => !knownIds.has(movie.id))];
};

export function useHomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState(DEFAULT_DISCOVERY_FILTERS);
  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [source, setSource] = useState({ type: "popular", query: "", filters: DEFAULT_DISCOVERY_FILTERS });

  const setMoviePage = (data, nextSource) => {
    setMovies(data.results || []);
    setPage(data.page || 1);
    setTotalPages(data.totalPages || 1);
    setSource(nextSource);
  };

  const loadDefaultMovies = useCallback(async () => {
    setLoading(true);
    try { setMoviePage(await getPopularMoviesPage(), { type: "popular" }); }
    catch (err) { console.error("Failed to fetch popular movies:", err); toast.error(GENERIC_FETCH_ERROR, { toastId: "popular-movies-error" }); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadDefaultMovies(); }, [loadDefaultMovies]);
  useEffect(() => { getMovieGenres().then(setGenres).catch((err) => console.error("Failed to load movie genres:", err)); }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query || loading) return;
    setLoading(true);
    try {
      setMoviePage(await searchMoviesPage(query), { type: "search", query });
      setFilters(DEFAULT_DISCOVERY_FILTERS);
    } catch (err) { console.error("Failed to search movies:", err); toast.error(GENERIC_FETCH_ERROR, { toastId: "search-movies-error" }); }
    finally { setLoading(false); }
  };

  const handleClearSearch = async () => { setSearchQuery(""); setFilters(DEFAULT_DISCOVERY_FILTERS); await loadDefaultMovies(); };

  const applyFilters = async (nextFilters) => {
    setLoading(true);
    try {
      setMoviePage(await discoverMoviesPage(nextFilters), { type: "discover", filters: nextFilters });
      setFilters(nextFilters);
      setSearchQuery("");
    } catch (err) { console.error("Failed to discover movies:", err); toast.error(GENERIC_FETCH_ERROR, { toastId: "discover-movies-error" }); }
    finally { setLoading(false); }
  };

  const clearFilters = async () => { setFilters(DEFAULT_DISCOVERY_FILTERS); setSearchQuery(""); await loadDefaultMovies(); };

  const loadMore = async () => {
    if (loadingMore || loading || page >= totalPages) return;
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      let data;
      if (source.type === "discover") data = await discoverMoviesPage(source.filters, nextPage);
      else if (source.type === "search") data = await searchMoviesPage(source.query, nextPage);
      else data = await getPopularMoviesPage(nextPage);
      setMovies((current) => appendUniqueMovies(current, data.results || []));
      setPage(data.page || nextPage);
      setTotalPages(data.totalPages || totalPages);
    } catch (err) { console.error("Failed to load more movies:", err); toast.error(GENERIC_FETCH_ERROR, { toastId: "load-more-movies-error" }); }
    finally { setLoadingMore(false); }
  };

  const filteredMovies = useMemo(() => {
    const titleQuery = filters.titleQuery.trim().toLowerCase();
    if (!titleQuery) return movies;
    return movies.filter((movie) => movie.title?.toLowerCase().includes(titleQuery));
  }, [filters.titleQuery, movies]);

  const hasActiveFilters = useMemo(() => Boolean(filters.titleQuery.trim()) || filters.genreIds.length > 0 || Boolean(filters.yearFrom || filters.yearTo || filters.minRating) || filters.sortBy !== DEFAULT_DISCOVERY_FILTERS.sortBy, [filters]);

  return { searchQuery, setSearchQuery, filters, genres, hasActiveFilters, loading, loadingMore, hasMore: page < totalPages, handleSearch, handleClearSearch, applyFilters, clearFilters, loadMore, filteredMovies };
}
