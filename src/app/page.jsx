"use client";

import { useEffect, useState } from "react";
import { useLocation } from "./contexts/LocationContext";
import dynamic from "next/dynamic";
import { ArrowsClockwiseIcon } from "@phosphor-icons/react/dist/ssr";
import Select from "react-select";
import TripPlanner from "./components/home/TripPlanner";

const Map = dynamic(() => import("./components/home/Map"), { ssr: false });

const destinationOptions = [
  { value: "Lagos", label: "Port Harcourt - Lagos" },
  { value: "Abuja", label: "Port Harcourt - Abuja" },
  { value: "Jos", label: "Port Harcourt - Jos" },
  { value: "Warri", label: "Port Harcourt - Warri" },
];

const darkSelectStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: "#2C2C2E",
    borderColor: "#3A3A3C",
    color: "#fff",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#1C1C1E",
    color: "#fff",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#fff",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#3A3A3C" : "#1C1C1E",
    color: "#fff",
    cursor: "pointer",
  }),
};

export default function Home() {
  const { location } = useLocation();
  const [position, setPosition] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [rotated, setRotated] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setPosition(coords);
        setLocationLoading(true);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords[0]}&lon=${coords[1]}`
          );
          const data = await res.json();
          const place =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.state ||
            "Unknown Location";
          setLocationName(place);
        } catch (err) {
          console.error("Failed to fetch location name:", err);
          setLocationName("Unknown Location");
        } finally {
          setLocationLoading(false);
        }
      });
    }
  };
  useEffect(() => {
    fetchLocation();
  }, []);

  const reload = () => {
    setRotated(true);
    fetchLocation();
    setTimeout(() => setRotated(false), 500);
  };

  return (
    <main className="layout">
      <h1 className="text-3xl font-black mb-2">Bookings</h1>

      {locationLoading ? (
        <p className="text-gray-500 mb-4">Fetching your location...</p>
      ) : locationName ? (
        <p className="text-gray-600 mb-4">
          Your current location: {locationName}
        </p>
      ) : null}
      <TripPlanner
        location={locationName}
        destinationOptions={destinationOptions}
        selectedDestination={selectedDestination}
        setSelectedDestination={setSelectedDestination}
        reload={reload}
        rotated={rotated}
        Map={Map}
      />
    </main>
  );
}
