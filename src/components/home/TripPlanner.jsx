import { useState, useRef, useEffect } from "react";
import {
  Calendar,
  Car,
  Bus,
  MapPin,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Navigation,
  CarTaxiFront,
} from "lucide-react";
import LocationHeader from "./LocationHeader";
import TripSummaryModal from "./TripSummary";
import DateSelector from "./Date";
import VehicleSelector from "./Vehicle";
import CustomDestinationSelect from "./Destination";
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full rounded-2xl bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
      </div>
    </div>
  )
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
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [destination, setDestination] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleSearch = () => {
    setShowPopup(true);
  };

  const handleChangeLocation = () => {
    console.log("Change location clicked");
  };

  return (
    <>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Map />
        </div>

        <div className="">
          <div className="max-w-4xl mx-auto">
            {/* Main Card */}
            <div className="bg-[#1C1C1E] rounded-2xl shadow-2xl p-8 border border-gray-800">
              <LocationHeader
                location={location}
                onChangeLocation={handleChangeLocation}
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
                />
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                disabled={!destination || !selectedDate || !selectedVehicle}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white py-2 rounded-xl text-md font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                Find Available Rides
              </button>
            </div>
          </div>
        </div>
      </div>

      <TripSummaryModal
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        tripData={{
          location,
          destination,
          selectedDate,
          selectedVehicle,
        }}
      />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
}
