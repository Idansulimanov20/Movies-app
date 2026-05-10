import { useState, useEffect } from "react";
import { MovieContext } from "./MovieContext";
import { useAuth } from "./useAuth";
import { addFavorite, getFavorites, removeFavorite } from "../services/api";

export function MovieProvider({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [favoritesError, setFavoritesError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadFavorites() {
      if (authLoading) return;

      if (!isAuthenticated) {
        setFavorites([]);
        setFavoritesError("");
        return;
      }

      setFavoritesLoading(true);
      try {
        const nextFavorites = await getFavorites();
        if (!ignore) setFavorites(nextFavorites);
      } catch (error) {
        if (!ignore) setFavoritesError(error.message);
      } finally {
        if (!ignore) setFavoritesLoading(false);
      }
    }

    loadFavorites();

    return () => {
      ignore = true;
    };
  }, [authLoading, isAuthenticated]);

  const addToFavorites = async (movie) => {
    if (!isAuthenticated) return;

    try {
      const nextFavorites = await addFavorite(movie);
      setFavorites(nextFavorites);
      setFavoritesError("");
    } catch (error) {
      setFavoritesError(error.message);
    }
  };

  const removeFromFavorites = async (movieId) => {
    if (!isAuthenticated) return;

    try {
      const nextFavorites = await removeFavorite(movieId);
      setFavorites(nextFavorites);
      setFavoritesError("");
    } catch (error) {
      setFavoritesError(error.message);
    }
  };

  const isFavorite = (movieId) =>
    favorites.some((movie) => movie.id === movieId);

  const value = {
    favorites,
    favoritesLoading,
    favoritesError,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  };

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
}
