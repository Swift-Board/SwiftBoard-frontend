"use client";

import { useState } from "react";
import { Car, Bus, CarTaxiFront, Loader2, AlertCircle } from "lucide-react";
import dynamic from "next/dynamic";
import LocationHeader from "./LocationHeader";
import TripSummaryModal from "./TripSummary";
import DateSelector from "./Date";
import VehicleSelector from "./Vehicle";
import CustomDestinationSelect from "./Destination";
import { api } from "@/utils/axios";
import { useRouter } from "next/navigation";

const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full rounded-2xl bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
      </div>
    </div>
  ),
});

export default function TripPlanner() {
  const vehicleOptions = [
    {
      label: "Car",
      value: "car",
      icon: Car,
      color: "bg-blue-500/10 border-blue-500 text-blue-500",
      activeColor: "bg-blue-500 text-white border-blue-500",
    },
    {
      label: "Bus",
      value: "bus",
      icon: Bus,
      color: "bg-emerald-500/10 border-emerald-500 text-emerald-500",
      activeColor: "bg-emerald-500 text-white border-emerald-500",
    },
    {
      label: "Sienna",
      value: "sienna",
      icon: CarTaxiFront,
      color: "bg-amber-500/10 border-amber-500 text-amber-500",
      activeColor: "bg-amber-500 text-white border-amber-500",
    },
  ];

  const popularDestinations = [
    "Lagos",
    "Abuja",
    "Jos",
    "Warri",
    "Enugu",
    "Calabar",
    "Kano",
    "Ibadan",
  ];

  const [location] = useState("Port Harcourt");
  const [destination, setDestination] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState("bus");
  const [showCalendar, setShowCalendar] = useState(false);
  const router = useRouter();

  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availableRides, setAvailableRides] = useState([]);
  const [searchError, setSearchError] = useState(null);

  const handleSearch = async () => {
    setIsLoading(true);

    const datePicker = new Date(selectedDate);
    const formattedDate = datePicker.toLocaleDateString("en-CA");

    try {
      const response = await api.get("/rides/search", {
        params: {
          origin: location,
          destination: destination,
          date: formattedDate,
          vehicleType: selectedVehicle,
        },
      });

      if (response.data.rides.length === 0) {
        console.warn("Server found 0 matches in DB");
      }

      const tripData = {
        location,
        destination,
        selectedDate,
        selectedVehicle,
        results: response.data.rides,
      };

      localStorage.setItem("tripData", JSON.stringify(tripData));

      router.push("/available_bookings");
    } catch (error) {
      console.error("Search failed", error);
      setSearchError("No rides found for this route.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Map />
        </div>

        <div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#1C1C1E] rounded-2xl shadow-2xl p-8 border border-gray-800">
              <LocationHeader
                location={location}
                onChangeLocation={() => console.log("Change location clicked")}
              />

              {/* Destination */}
              <div className="mb-6">
                <label className="text-sm text-gray-400 mb-2 block font-medium">
                  Destination
                </label>
                <CustomDestinationSelect
                  value={destination}
                  onChange={setDestination}
                  location={location}
                  destinations={popularDestinations}
                />
              </div>

              {/* Date Selection */}
              <div className="mb-6">
                <DateSelector
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                  showCalendar={showCalendar}
                  setShowCalendar={setShowCalendar}
                />
              </div>

              {/* Vehicle Selection */}
              <div className="mb-4">
                <VehicleSelector
                  selectedVehicle={selectedVehicle}
                  onSelectVehicle={setSelectedVehicle}
                  options={vehicleOptions}
                  defaultVehicle="sienna"
                />
              </div>

              {/* Error Message */}
              {searchError && (
                <div className="mb-4 flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                  <AlertCircle size={16} />
                  <span>{searchError}</span>
                </div>
              )}

              {/* Search Button */}
              <button
                onClick={handleSearch}
                disabled={
                  !destination || !selectedDate || !selectedVehicle || isLoading
                }
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white py-3 rounded-xl text-md font-semibold transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Searching...
                  </>
                ) : (
                  "Find Available Rides"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <TripSummaryModal
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        rides={availableRides}
        tripData={{
          location,
          destination,
          selectedDate,
          selectedVehicle,
        }}
      />
    </>
  );
}
