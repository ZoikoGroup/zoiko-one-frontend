import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  login as loginRequest,
  register as registerRequest,
  logout as logoutRequest,
  fetchCurrentUser,
  getCachedUser,
  isAuthenticated,
} from "../service/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCachedUser());
  const [loading, setLoading] = useState(isAuthenticated());
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    if (!isAuthenticated()) {
      setLoading(false);
      return;
    }
    fetchCurrentUser()
      .then((current) => {
        if (active) setUser(current);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (credentials) => {
    setError(null);
    setLoading(true);
    try {
      const loggedInUser = await loginRequest(credentials);
      setUser(loggedInUser);
      return loggedInUser;
    } catch (err) {
      setError(err.message || "Unable to sign in");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload) => {
    setError(null);
    setLoading(true);
    try {
      const newUser = await registerRequest(payload);
      setUser(newUser);
      return newUser;
    } catch (err) {
      setError(err.message || "Unable to create account");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    setUser(null);
  }, []);

  const value = {
    user,
    isAuthenticated: Boolean(user) || isAuthenticated(),
    loading,
    error,
    login,
    register,
    logout,
    defaultRedirect: "/",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
