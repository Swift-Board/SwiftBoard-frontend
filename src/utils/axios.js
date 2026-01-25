"use client";

import axios from "axios";

// 1. PUBLIC API (No token needed, no auto-logout)
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// 2. AUTHENTICATED API (Token required, handles expiration)
export const apiAuth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Request Interceptor: Attach token to apiAuth requests
apiAuth.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        // console.log("✅ Token attached to apiAuth request");
      } else {
        console.warn("⚠️ apiAuth used but NO TOKEN found in localStorage");
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Watch for 401 errors on apiAuth
apiAuth.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Dispatch a custom event that our Notification system can hear
      const event = new CustomEvent("auth-error", {
        detail: "Your session has expired. Please login again.",
      });
      window.dispatchEvent(event);

      if (!window.location.pathname.includes("/login")) {
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000); // Give them 2 seconds to read the notification
      }
    }
    return Promise.reject(error);
  },
);
