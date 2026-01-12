"use client";

import axios from "axios";

const token = localStorage.getItem("token");

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const apiAuth = axios.create({
  baseURL: process.env.NEXT_API_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
