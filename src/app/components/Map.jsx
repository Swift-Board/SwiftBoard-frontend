"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function Map() {
  const [position, setPosition] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
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
  }, []);

  return (
    <main className="lg:col-span-2">
      {position ? (
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={false}
          className="h-[500px] w-full rounded-lg"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>You are here: {locationName || "Loading..."}</Popup>
          </Marker>
        </MapContainer>
      ) : (
        <p>Loading map...</p>
      )}
    </main>
  );
}
