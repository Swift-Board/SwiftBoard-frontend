"use client";

import { useEffect, useState, useRef } from "react";
import { useLocation } from "@/app/contexts/LocationContext";
import "mapbox-gl/dist/mapbox-gl.css";

export default function Map() {
  const { city, coordinates, setCoordinates } = useLocation();
  const [position, setPosition] = useState(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [accuracy, setAccuracy] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const [mapError, setMapError] = useState(null);
  const [mapStyle, setMapStyle] = useState("navigation-day-v1"); // Map style state

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // Available map styles
  const mapStyles = [
    { id: "streets-v12", name: "Streets", icon: "🗺️" },
    { id: "outdoors-v12", name: "Outdoors", icon: "🏔️" },
    { id: "light-v11", name: "Light", icon: "☀️" },
    { id: "dark-v11", name: "Dark", icon: "🌙" },
    { id: "satellite-v9", name: "Satellite", icon: "🛰️" },
    { id: "satellite-streets-v12", name: "Hybrid", icon: "🌍" },
    { id: "navigation-day-v1", name: "Navigation", icon: "🧭" },
  ];

  // Initialize Mapbox
  useEffect(() => {
    const initMap = async () => {
      try {
        // Dynamically import mapbox-gl
        const mapboxgl = (await import("mapbox-gl")).default;

        if (!position) return;

        // Set access token
        mapboxgl.accessToken =
          process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
          "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw";

        // Create map with custom styling
        const map = new mapboxgl.Map({
          container: mapRef.current,
          style: `mapbox://styles/mapbox/${mapStyle}`,
          center: [position[1], position[0]], // [lng, lat]
          zoom: 15,
          pitch: 45, // 3D tilt angle
          bearing: 0, // Rotation
          attributionControl: false, // Hide attribution for cleaner look
        });

        // Add custom attribution
        map.addControl(
          new mapboxgl.AttributionControl({
            compact: true,
          }),
          "bottom-right"
        );

        // Add navigation controls (zoom, compass)
        map.addControl(
          new mapboxgl.NavigationControl({
            visualizePitch: true,
          }),
          "top-right"
        );

        // Add fullscreen control
        map.addControl(new mapboxgl.FullscreenControl(), "top-right");

        // Add scale control
        map.addControl(
          new mapboxgl.ScaleControl({
            maxWidth: 100,
            unit: "metric",
          }),
          "bottom-left"
        );

        // Wait for map to load before adding custom layers
        map.on("load", () => {
          // Add 3D buildings layer (if using streets style)
          if (
            mapStyle === "streets-v12" ||
            mapStyle === "light-v11" ||
            mapStyle === "dark-v11"
          ) {
            const layers = map.getStyle().layers;
            const labelLayerId = layers.find(
              (layer) => layer.type === "symbol" && layer.layout["text-field"]
            ).id;

            map.addLayer(
              {
                id: "add-3d-buildings",
                source: "composite",
                "source-layer": "building",
                filter: ["==", "extrude", "true"],
                type: "fill-extrusion",
                minzoom: 15,
                paint: {
                  "fill-extrusion-color": "#aaa",
                  "fill-extrusion-height": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    15,
                    0,
                    15.05,
                    ["get", "height"],
                  ],
                  "fill-extrusion-base": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    15,
                    0,
                    15.05,
                    ["get", "min_height"],
                  ],
                  "fill-extrusion-opacity": 0.6,
                },
              },
              labelLayerId
            );
          }

          // Add accuracy circle
          if (accuracy) {
            map.addSource("accuracy-circle", {
              type: "geojson",
              data: {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [position[1], position[0]],
                },
              },
            });

            map.addLayer({
              id: "accuracy-circle",
              type: "circle",
              source: "accuracy-circle",
              paint: {
                "circle-radius": {
                  stops: [
                    [0, 0],
                    [20, accuracy / 2],
                  ],
                  base: 2,
                },
                "circle-color": "#3b82f6",
                "circle-opacity": 0.2,
                "circle-stroke-width": 2,
                "circle-stroke-color": "#3b82f6",
                "circle-stroke-opacity": 0.5,
              },
            });
          }
        });

        // Create custom animated marker HTML
        const markerEl = document.createElement("div");
        markerEl.className = "custom-marker";
        markerEl.innerHTML = `
          <div style="
            width: 40px;
            height: 40px;
            position: relative;
          ">
            <div style="
              position: absolute;
              width: 100%;
              height: 100%;
              border-radius: 50%;
              background: rgba(59, 130, 246, 0.3);
              animation: pulse 2s infinite;
            "></div>
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: #3b82f6;
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 12px;
            ">
              📍
            </div>
          </div>
          <style>
            @keyframes pulse {
              0% {
                transform: scale(1);
                opacity: 0.5;
              }
              50% {
                transform: scale(1.5);
                opacity: 0.2;
              }
              100% {
                transform: scale(1);
                opacity: 0.5;
              }
            }
          </style>
        `;

        // Create marker with custom element
        const marker = new mapboxgl.Marker({
          element: markerEl,
          anchor: "center",
        })
          .setLngLat([position[1], position[0]])
          .addTo(map);
      } catch (error) {
        console.error("Failed to load map:", error);
        setMapError("Failed to load map");
      }
    };

    if (position && mapRef.current) {
      initMap();
    }

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, [position, city, accuracy, mapStyle]);

  // Change map style
  const changeMapStyle = (styleId) => {
    setMapStyle(styleId);
  };

  // Update map when position changes
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current && position) {
      mapInstanceRef.current.flyTo({
        center: [position[1], position[0]],
        zoom: 15,
        duration: 2000,
        essential: true,
      });

      markerRef.current.setLngLat([position[1], position[0]]);

      // Update popup
      const popupContent = `
        <div style="padding: 12px; min-width: 200px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
            <span style="font-size: 20px;">📍</span>
            <strong style="font-size: 16px;">You are here</strong>
          </div>
          <div style="border-top: 1px solid #e5e7eb; padding-top: 8px;">
            <p style="margin: 4px 0; font-size: 13px; display: flex; justify-content: space-between;">
              <span style="color: #6b7280;">City:</span>
              <strong>${city || "Loading..."}</strong>
            </p>
            <p style="margin: 4px 0; font-size: 11px; color: #9ca3af; font-family: monospace;">
              ${position[0].toFixed(6)}, ${position[1].toFixed(6)}
            </p>
            ${
              accuracy
                ? `
              <p style="margin: 4px 0; font-size: 11px; color: #9ca3af;">
                Accuracy: <strong style="color: #3b82f6;">±${Math.round(
                  accuracy
                )}m</strong>
              </p>
            `
                : ""
            }
          </div>
        </div>
      `;

      markerRef.current.getPopup().setHTML(popupContent);
    }
  }, [position, city, accuracy]);

  // Get user position
  useEffect(() => {
    if (coordinates) {
      setPosition([coordinates.lat, coordinates.lon]);
      setMapLoading(false);
    }

    const getUserPosition = () => {
      if (!navigator.geolocation) {
        console.error("Geolocation not supported");
        if (!coordinates) {
          setPosition([9.082, 8.6753]);
        }
        setMapLoading(false);
        return;
      }

      const id = navigator.geolocation.watchPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setPosition(coords);
          setAccuracy(pos.coords.accuracy);
          setMapLoading(false);

          setCoordinates({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);

          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const coords = [pos.coords.latitude, pos.coords.longitude];
              setPosition(coords);
              setAccuracy(pos.coords.accuracy);
              setMapLoading(false);

              setCoordinates({
                lat: pos.coords.latitude,
                lon: pos.coords.longitude,
              });
            },
            (err) => {
              console.error("Fallback geolocation failed:", err);
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
      ) : mapError ? (
        <div className="h-[500px] w-full rounded-2xl bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">{mapError}</p>
            <button
              onClick={refreshLocation}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : position ? (
        <div className="relative">
          <div
            ref={mapRef}
            className="h-[500px] w-full rounded-2xl shadow-lg"
          />

          {/* Map Style Selector */}
          {/* <div className="absolute top-4 left-4 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2">
            <div className="flex flex-col gap-2">
              {mapStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => changeMapStyle(style.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    mapStyle === style.id
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                  title={style.name}
                >
                  <span>{style.icon}</span>
                  <span className="hidden sm:inline">{style.name}</span>
                </button>
              ))}
            </div>
          </div> */}

          {/* Refresh button */}
          <button
            onClick={refreshLocation}
            className="absolute bottom-4 right-4 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
            title="Refresh your location"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      ) : (
        <div className="h-[500px] w-full rounded-2xl bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Unable to load map
            </p>
            <button
              onClick={refreshLocation}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
