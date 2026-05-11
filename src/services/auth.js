import { apiRequest } from "./http";

export const signIn = (credentials) =>
  apiRequest("/auth/signin", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

export const signUp = (credentials) =>
  apiRequest("/auth/signup", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

export const getCurrentUser = () => apiRequest("/auth/me");

export const signOut = () =>
  apiRequest("/auth/logout", {
    method: "POST",
  });

export const recoverPassword = (email) =>
  apiRequest("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

export const updateProfile = (profile) =>
  apiRequest("/auth/profile", {
    method: "PATCH",
    body: JSON.stringify(profile),
  });

export const requestPasswordChangeCode = () =>
  apiRequest("/auth/password/change-code", {
    method: "POST",
  });

export const confirmPasswordChange = ({ code, newPassword }) =>
  apiRequest("/auth/password/change", {
    method: "POST",
    body: JSON.stringify({ code, newPassword }),
  });
