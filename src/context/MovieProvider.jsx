import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { MovieContext } from "./MovieContext";
import { useAuth } from "./useAuth";
import { addFavorite, getFavorites, removeFavorite } from "../services/api";

const GENERIC_FAVORITES_ERROR =
  "Something went wrong with favorites. Please contact support if it continues.";

export function MovieProvider({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadFavorites() {
      if (authLoading) return;

      if (!isAuthenticated) {
        setFavorites([]);
        return;
      }

      setFavoritesLoading(true);
      try {
        const nextFavorites = await getFavorites();
        if (!ignore) {
          setFavorites(nextFavorites);
        }
      } catch (error) {
        console.error("Failed to load favorites:", error);
        if (!ignore) {
          toast.error(GENERIC_FAVORITES_ERROR, {
            toastId: "load-favorites-error",
          });
        }
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
    } catch (error) {
      console.error("Failed to add favorite:", error);
      toast.error(GENERIC_FAVORITES_ERROR, {
        toastId: "add-favorite-error",
      });
    }
  };

  const removeFromFavorites = async (movieId) => {
    if (!isAuthenticated) return;

    try {
      const nextFavorites = await removeFavorite(movieId);
      setFavorites(nextFavorites);
    } catch (error) {
      console.error("Failed to remove favorite:", error);
      toast.error(GENERIC_FAVORITES_ERROR, {
        toastId: "remove-favorite-error",
      });
    }
  };

  const isFavorite = (movieId) =>
    favorites.some((movie) => movie.id === movieId);

  const value = {
    favorites,
    favoritesLoading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  };

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
}
