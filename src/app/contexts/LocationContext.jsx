// context/LocationContext.js
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState("Nigeria"); // Default to Nigeria

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
