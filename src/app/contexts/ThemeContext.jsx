"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import useLocalStorage from "use-local-storage";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Delay matching until after mount
  const [theme, setTheme] = useLocalStorage("theme", null); // null = unset

  useEffect(() => {
    if (theme === null) {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, [theme]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("exit");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme: theme || "light", toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
