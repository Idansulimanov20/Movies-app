import { apiRequest } from "./http";

export const getPopularMovies = async () => {
  const data = await getPopularMoviesPage();
  return data.results;
};

export const getPopularMoviesPage = (page = 1) =>
  apiRequest(`/movies/popular?page=${page}`);

export const searchMovies = async (query) => {
  const data = await searchMoviesPage(query);
  return data.results;
};

export const searchMoviesPage = (query, page = 1) =>
  apiRequest(`/movies/search?query=${encodeURIComponent(query)}&page=${page}`);

export const getMovieGenres = async () => {
  const data = await apiRequest("/movies/genres");
  return data.genres;
};

export const discoverMovies = async (filters) => {
  const data = await discoverMoviesPage(filters);
  return data.results;
};

export const discoverMoviesPage = async (filters, page = 1) => {
  const params = new URLSearchParams();

  if (filters.genreIds.length) params.set("with_genres", filters.genreIds.join("|"));
  if (filters.yearFrom) params.set("primary_release_date.gte", `${filters.yearFrom}-01-01`);
  if (filters.yearTo) params.set("primary_release_date.lte", `${filters.yearTo}-12-31`);
  if (filters.minRating) params.set("vote_average.gte", String(filters.minRating));
  if (filters.sortBy) params.set("sort_by", filters.sortBy);
  params.set("page", String(page));

  return apiRequest(`/movies/discover?${params.toString()}`);
};

export const getFavorites = async () => {
  const data = await apiRequest("/favorites");
  return data.favorites;
};

export const addFavorite = async (movie) => {
  const data = await apiRequest("/favorites", {
    method: "POST",
    body: JSON.stringify(movie),
  });
  return data.favorites;
};

export const removeFavorite = async (movieId) => {
  const data = await apiRequest(`/favorites/${movieId}`, {
    method: "DELETE",
  });
  return data.favorites;
};
