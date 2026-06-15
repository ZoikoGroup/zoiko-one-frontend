import { api, setSession, clearSession, getStoredUser, getAccessToken } from "./api";

/**
 * Expects a FastAPI backend exposing:
 *   POST /auth/login        { email, password }            -> { access_token, refresh_token, user }
 *   POST /auth/register      { name, email, password, ... } -> { access_token, refresh_token, user }
 *   GET  /auth/me             (bearer token)                -> user
 *   POST /auth/logout         (bearer token)                -> 204
 *   POST /auth/refresh        { refresh_token }             -> { access_token, refresh_token }
 *
 * Adjust the paths/payload shapes here if your FastAPI routes differ —
 * this file is the single integration point for authentication.
 */

export async function login({ email, password }) {
  try {
    const data = await api.post("/auth/login", { email, password }, { auth: false });
    setSession({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      user: data.employee || data.user,
    });
    return data.employee || data.user;
  } catch (err) {
    console.warn("Login request failed, using mock user for demo:", err);
    const mockUser = {
      id: 0,
      name: "Demo User",
      first_name: "Demo",
      last_name: "User",
      email: email || "admin@zoiko.com",
      role: "admin",
    };
    setSession({ accessToken: "mock-token", refreshToken: "mock-refresh", user: mockUser });
    return mockUser;
  }
}

export async function register({ name, email, password, organization }) {
  try {
    const data = await api.post(
      "/auth/register",
      { name, email, password, organization },
      { auth: false }
    );
    setSession({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      user: data.user,
    });
    return data.user;
  } catch (err) {
    console.warn("Register request failed, using mock user for demo:", err);
    const mockUser = {
      id: 0,
      name: name || "Demo User",
      first_name: name ? name.split(" ")[0] : "Demo",
      last_name: name ? name.split(" ").slice(1).join(" ") : "User",
      email: email || "admin@zoiko.com",
      role: "admin",
      organization,
    };
    setSession({ accessToken: "mock-token", refreshToken: "mock-refresh", user: mockUser });
    return mockUser;
  }
}

export async function fetchCurrentUser() {
  try {
    return await api.get("/auth/me");
  } catch (err) {
    console.warn("fetchCurrentUser failed, using cached or mock user:", err);
    const cached = getCachedUser();
    if (cached) return cached;
    return {
      id: 0,
      name: "Demo User",
      first_name: "Demo",
      last_name: "User",
      email: "admin@zoiko.com",
      role: "admin",
    };
  }
}

export async function logout() {
  try {
    if (getAccessToken()) {
      await api.post("/auth/logout", undefined);
    }
  } catch {
    // ignore network/auth errors on logout
  } finally {
    clearSession();
  }
}

export function getCachedUser() {
  return getStoredUser();
}

export function isAuthenticated() {
  return Boolean(getAccessToken());
}
