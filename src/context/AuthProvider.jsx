import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  getCurrentUser,
  recoverPassword,
  confirmPasswordChange,
  requestPasswordChangeCode,
  signIn,
  signOut,
  signUp,
  updateProfile,
} from "../services/auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadUser() {
      try {
        const data = await getCurrentUser();
        if (!ignore) setUser(data.user);
      } catch {
        if (!ignore) setUser(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadUser();

    return () => {
      ignore = true;
    };
  }, []);

  const login = useCallback(
    async (credentials) => {
      const data = await signIn(credentials);
      setUser(data.user);
      return data.user;
    },
    []
  );

  const register = useCallback(
    async (credentials) => {
      const data = await signUp(credentials);
      setUser(data.user);
      return data.user;
    },
    []
  );

  const logout = useCallback(async () => {
    await signOut();
    setUser(null);
  }, []);

  const requestPasswordRecovery = useCallback(async (email) => {
    const data = await recoverPassword(email);
    return data.message;
  }, []);

  const saveProfile = useCallback(async (profile) => {
    const data = await updateProfile(profile);
    setUser(data.user);
    return data.user;
  }, []);

  const sendPasswordChangeCode = useCallback(async () => {
    const data = await requestPasswordChangeCode();
    return data;
  }, []);

  const changePassword = useCallback(async (payload) => {
    const data = await confirmPasswordChange(payload);
    return data.message;
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      register,
      requestPasswordRecovery,
      saveProfile,
      sendPasswordChangeCode,
      changePassword,
    }),
    [
      changePassword,
      loading,
      login,
      logout,
      register,
      requestPasswordRecovery,
      saveProfile,
      sendPasswordChangeCode,
      user,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
