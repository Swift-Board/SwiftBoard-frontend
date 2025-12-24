"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLocation } from "@/app/contexts/LocationContext";

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

// Component to update map center when location changes
function MapUpdater({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 15);
    }
  }, [position, map]);

  return null;
}

export default function Map() {
  const { city, coordinates, setCoordinates } = useLocation();
  const [position, setPosition] = useState(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [accuracy, setAccuracy] = useState(null);
  const [watchId, setWatchId] = useState(null);

  useEffect(() => {
    // If we have coordinates from context, use them immediately
    if (coordinates) {
      setPosition([coordinates.lat, coordinates.lon]);
      setMapLoading(false);
    }

    const getUserPosition = () => {
      if (!navigator.geolocation) {
        console.error("Geolocation not supported");
        // Use context coordinates or fallback
        if (!coordinates) {
          setPosition([9.082, 8.6753]); // Default fallback
        }
        setMapLoading(false);
        return;
      }

      // Use watchPosition for continuous location updates
      const id = navigator.geolocation.watchPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setPosition(coords);
          setAccuracy(pos.coords.accuracy);
          setMapLoading(false);

          // Update context coordinates
          setCoordinates({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);

          // Try one-time position as fallback
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const coords = [pos.coords.latitude, pos.coords.longitude];
              setPosition(coords);
              setAccuracy(pos.coords.accuracy);
              setMapLoading(false);

              // Update context coordinates
              setCoordinates({
                lat: pos.coords.latitude,
                lon: pos.coords.longitude,
              });
            },
            (err) => {
              console.error("Fallback geolocation failed:", err);
              // Use context coordinates or ultimate fallback
              if (!coordinates) {
                setPosition([9.082, 8.6753]);
              }
              setMapLoading(false);
            },
            {
              enableHighAccuracy: false,
              timeout: 5000,
              maximumAge: 60000,
            }
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 1000,
        }
      );

      setWatchId(id);
    };

    getUserPosition();

    // Cleanup: stop watching position when component unmounts
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [coordinates, setCoordinates]);

  // Manual refresh function
  const refreshLocation = () => {
    setMapLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setPosition(coords);
          setAccuracy(pos.coords.accuracy);
          setMapLoading(false);

          // Update context coordinates
          setCoordinates({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          });
        },
        (error) => {
          console.error("Location refresh failed:", error);
          setMapLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  };

  return (
    <main className="lg:col-span-2">
      {mapLoading ? (
        <div className="h-[500px] w-full rounded-2xl bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Getting your precise location...
            </p>
          </div>
        </div>
      ) : position ? (
        <div className="relative">
          <MapContainer
            center={position}
            zoom={15}
            scrollWheelZoom={false}
            className="h-[500px] w-full rounded-2xl shadow-lg"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>
                <div className="text-center">
                  <strong className="text-lg block mb-2">
                    📍 You are here
                  </strong>
                  <p className="text-sm text-gray-700 mb-1">
                    <strong>City:</strong> {city || "Loading..."}
                  </p>
                  <p className="text-xs text-gray-500">
                    Lat: {position[0].toFixed(6)}, Lon: {position[1].toFixed(6)}
                  </p>
                  {accuracy && (
                    <p className="text-xs text-gray-500 mt-1">
                      Accuracy: ±{Math.round(accuracy)}m
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
            <MapUpdater position={position} />
          </MapContainer>

          {/* Refresh button */}
          <button
            onClick={refreshLocation}
            className="absolute top-4 right-4 z-[1000] bg-white dark:bg-gray-800 shadow-lg rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            title="Refresh your location"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="h-[500px] w-full rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Unable to load map
            </p>
            <button
              onClick={refreshLocation}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
