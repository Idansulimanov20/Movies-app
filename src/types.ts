import type { ReactNode } from "react";

export interface Movie {
  id: number;
  title: string;
  original_title?: string;
  poster_path?: string | null;
  release_date?: string;
  reason?: string;
  genres?: string[];
  moods?: string[];
}

export interface User {
  email: string;
  username: string;
  name?: string;
  avatar?: string;
}

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: { username: string; password: string }) => Promise<User>;
  logout: () => Promise<void>;
  register: (credentials: { email: string; username: string; password: string }) => Promise<User>;
  requestPasswordRecovery: (email: string) => Promise<string>;
  saveProfile: (profile: { name: string; avatar: string }) => Promise<User>;
  sendPasswordChangeCode: () => Promise<{ email: string }>;
  changePassword: (payload: { code: string; newPassword: string }) => Promise<string>;
}

export interface MovieContextValue {
  favorites: Movie[];
  favoritesLoading: boolean;
  addToFavorites: (movie: Movie) => Promise<void>;
  removeFromFavorites: (movieId: number) => Promise<void>;
  isFavorite: (movieId: number) => boolean;
}

export interface ProviderProps { children: ReactNode }

export interface AssistantMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  prompt?: string;
  recommendations?: Movie[];
  saved?: boolean;
  feedback?: "like" | "dislike" | null;
  feedbackText?: string;
}

export interface SavedRecommendation extends Required<Pick<AssistantMessage, "id" | "content" | "prompt" | "recommendations">> {
  createdAt: string;
}
