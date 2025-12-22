"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [city, setCity] = useState(""); // UI: "New York"
  const [coordinates, setCoordinates] = useState(null); // Data: { lat: 0, lon: 0 }
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Helper: Extract strictly the city name ---
const extractCityName = (addressData) => {
  if (!addressData || !addressData.address) return null;

  const addr = addressData.address;

  // We prioritize the most common 'locality' labels
  const cityNames = [
    addr.city, 
    addr.town, 
    addr.municipality, 
    addr.city_district, // Fallback for large metros
    addr.village, 
    addr.hamlet
  ];

  // Find the first one that is a valid string
  const detectedCity = cityNames.find(name => typeof name === 'string' && name.length > 0);

  return detectedCity || null;
};

  // --- Strategy 2: Reverse Geocode (Lat/Lon -> City Name) ---
  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
        { headers: { "User-Agent": "SwiftBoard App" } }
      );
      if (!response.ok) throw new Error("Geocoding failed");
      const data = await response.json();
      return extractCityName(data);
    } catch (err) {
      // Fallback to BigDataCloud if Nominatim fails
      const altRes = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      );
      const altData = await altRes.json();
      return altData.city || altData.locality || null;
    }
  };

  // --- Strategy 3: IP-based Fallback ---
  const tryIPBasedLocation = useCallback(async () => {
    const services = [
      {
        url: "https://ipapi.co/json/",
        parse: (d) => ({ city: d.city, lat: d.latitude, lon: d.longitude }),
      },
      {
        url: "https://ip-api.com/json/",
        parse: (d) => ({ city: d.city, lat: d.lat, lon: d.lon }),
      },
    ];

    for (const service of services) {
      try {
        const res = await fetch(service.url);
        const data = await res.json();
        const info = service.parse(data);
        if (info.city) return info;
      } catch (e) {
        continue;
      }
    }
    return null;
  }, []);

  // --- Core Logic: Update State and Storage ---
  const handleLocationUpdate = useCallback(
    async (lat, lon, cityName = null) => {
      const coords = { lat, lon };
      setCoordinates(coords);
      localStorage.setItem("userCoordinates", JSON.stringify(coords));

      const finalCity =
        cityName || (await reverseGeocode(lat, lon)) || "Unknown City";
      setCity(finalCity);
      localStorage.setItem("userCity", finalCity);
      return finalCity;
    },
    []
  );

  // --- Main Manual/Auto Trigger ---
  const updateLocation = useCallback(
    async (isBackground = false) => {
      if (!isBackground) setIsLoading(true);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            await handleLocationUpdate(
              pos.coords.latitude,
              pos.coords.longitude
            );
            setIsLoading(false);
          },
          async () => {
            const ipData = await tryIPBasedLocation();
            if (ipData) {
              await handleLocationUpdate(ipData.lat, ipData.lon, ipData.city);
            } else {
              setCity("Worldwide");
              setError("Location detection failed");
            }
            setIsLoading(false);
          },
          { enableHighAccuracy: !isBackground, timeout: 10000 }
        );
      } else {
        setIsLoading(false);
      }
    },
    [handleLocationUpdate, tryIPBasedLocation]
  );

  // --- Effect: On Mount ---
  useEffect(() => {
    const initLocation = async () => {
      const savedCity = localStorage.getItem("userCity");
      const savedCoords = localStorage.getItem("userCoordinates");

      if (savedCity && savedCoords) {
        setCity(savedCity);
        setCoordinates(JSON.parse(savedCoords));
        setIsLoading(false);
        // Refresh in background to ensure accuracy
        updateLocation(true);
      } else {
        updateLocation(false);
      }
    };

    initLocation();

    const interval = setInterval(() => updateLocation(true), 900000); // 15 mins
    return () => clearInterval(interval);
  }, [updateLocation]);

  return (
    <LocationContext.Provider
      value={{ city, setCity, coordinates, isLoading, error, updateLocation }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
