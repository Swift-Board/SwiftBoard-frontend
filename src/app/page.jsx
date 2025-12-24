"use client";

import { useEffect, useState } from "react";
import { useLocation } from "./contexts/LocationContext";
import dynamic from "next/dynamic";
import TripPlanner from "@/components/home/TripPlanner";
import SectionOne from "@/components/home/SectionOne";
import SectionTwo from "@/components/home/SectionTwo";
import ScrollToTop from "@/components/home/ScrollToTop";

const Map = dynamic(() => import("../components/home/Map"), { ssr: false });

const destinationOptions = [
  { value: "Lagos", label: "Port Harcourt - Lagos" },
  { value: "Abuja", label: "Port Harcourt - Abuja" },
  { value: "Jos", label: "Port Harcourt - Jos" },
  { value: "Warri", label: "Port Harcourt - Warri" },
];

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
      <span className="grid grid-cols-2 sticky top-16 bg-black py-4 z-[9999]">
        <h1 className="text-3xl font-black mb-2">Bookings</h1>
        <h5 className="place-self-center">Traveling Details: N/A</h5>
      </span>
      <TripPlanner
        location={locationName}
        destinationOptions={destinationOptions}
        selectedDestination={selectedDestination}
        setSelectedDestination={setSelectedDestination}
        reload={reload}
        rotated={rotated}
        Map={Map}
      />
      <SectionOne />
      <SectionTwo />
      <ScrollToTop />
    </main>
  );
}
