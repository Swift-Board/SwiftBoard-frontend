"use client";

import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const apiAuth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

apiAuth.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    
    // 🔍 DEBUG LOGS
    console.log("🔑 Token from localStorage:", token ? `${token.substring(0, 20)}...` : "NULL");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ Authorization header set:", config.headers.Authorization.substring(0, 30) + "...");
    } else {
      console.log("❌ NO TOKEN FOUND IN LOCALSTORAGE");
    }
  }
  return config;
});