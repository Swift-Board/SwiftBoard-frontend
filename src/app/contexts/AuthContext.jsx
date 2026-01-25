"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { api } from "@/utils/axios";
import { useNotification } from "@/components/Notification";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    const handleAuthError = (event) => {
      showNotification({
        type: "error",
        message: event.detail,
        duration: 4000,
      });
    };

    window.addEventListener("auth-error", handleAuthError);
    return () => window.removeEventListener("auth-error", handleAuthError);
  }, [showNotification]);

  // Helper to check if token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );
      const { exp } = JSON.parse(jsonPayload);
      // exp is in seconds, Date.now() is in milliseconds
      return Date.now() >= exp * 1000;
    } catch (err) {
      return true;
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    // Optional: Only redirect if you aren't already on a public page
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      if (isTokenExpired(storedToken)) {
        logout();
      } else {
        setToken(storedToken);
        setUser(storedUser ? JSON.parse(storedUser) : null);
        api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      }
    }
    setLoading(false);
  }, [logout]);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(userData));
    api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
