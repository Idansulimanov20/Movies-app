import { apiRequest } from "./http";

export const getPopularMovies = async () => {
  const data = await apiRequest("/movies/popular");
  return data.results;
};

export const searchMovies = async (query) => {
  const data = await apiRequest(`/movies/search?query=${encodeURIComponent(query)}`);
  return data.results;
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
