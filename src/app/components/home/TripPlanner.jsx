"use client";

import { useState } from "react";
import {
  Calendar,
  Car,
  Bus,
  PersonSimpleBike,
  ArrowClockwise,
  X,
} from "@phosphor-icons/react";
import DatePicker from "react-datepicker";
import { motion, AnimatePresence } from "framer-motion";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";

const vehicleOptions = [
  {
    label: "Car",
    value: "car",
    icon: Car,
    glow: "shadow-[0_0_10px_2px_#3b82f6]",
  },
  {
    label: "Bus",
    value: "bus",
    icon: Bus,
    glow: "shadow-[0_0_10px_2px_#10b981]",
  },
  {
    label: "Bike",
    value: "bike",
    icon: PersonSimpleBike,
    glow: "shadow-[0_0_10px_2px_#f59e0b]",
  },
];

const darkSelectStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: "#2c2c2e",
    borderColor: "#444",
    color: "#fff",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#2c2c2e",
    color: "#fff",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#fff",
  }),
};

export default function TripPlanner({
  location,
  destinationOptions,
  selectedDestination,
  setSelectedDestination,
  reload,
  rotated,
  Map,
}) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleSearch = () => {
    setShowPopup(true);
  };

  const closePopup = () => setShowPopup(false);

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-3">
        <Map locationName={location} />

        <div className="bg-[#1C1C1E] rounded-md p-6 w-full">
          {/* Header */}
          <div className="flex items-center gap-4">
            <h5 className="text-slate-400 text-xl">{location}</h5>
            <ArrowClockwise
              onClick={reload}
              className={`text-orange-400 cursor-pointer transition-transform duration-500 ${
                rotated ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* Destination */}
          <div className="mt-4">
            <h5 className="text-white text-xl mb-4">Destination</h5>
            <Select
              options={destinationOptions}
              styles={darkSelectStyles}
              value={selectedDestination}
              onChange={setSelectedDestination}
              placeholder="Select a destination"
              isClearable
            />
          </div>

          {/* Date Picker */}
          <div className="mt-4">
            <h5 className="text-white text-xl mb-4">Select Date</h5>
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="w-full flex items-center justify-between px-4 py-2 bg-[#2c2c2e] rounded text-white"
            >
              {selectedDate ? selectedDate.toDateString() : "Choose a date"}
              <Calendar size={20} />
            </button>

            <div className="p-4 bg-[#1C1C1E] rounded-2xl shadow-lg">
              <AnimatePresence>
                {showDatePicker && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="mb-4"
                  >
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => {
                        setSelectedDate(date);
                        setShowDatePicker(false);
                      }}
                      inline
                      calendarClassName="bg-[#2C2C2E] text-white rounded-md p-2"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Vehicle Selection */}
          <div className="mt-2">
            <h5 className="text-white text-xl mb-4">Select Vehicle</h5>
            <div className="flex justify-between gap-4">
              {vehicleOptions.map(({ label, value, icon: Icon, glow }) => {
                const isSelected = selectedVehicle === value;

                return (
                  <button
                    key={value}
                    onClick={() => setSelectedVehicle(value)}
                    className={`flex flex-col items-center px-4 py-3 rounded-md transition 
          ${
            isSelected
              ? `${glow}`
              : ""
          }`}
                  >
                    <Icon size={24} className="transition" />
                    <span className="mt-1 text-sm">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Button */}
          <div className="mt-4">
            <button
              onClick={handleSearch}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-md text-lg font-medium transition"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Result Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed inset-0 bg-black/70 z-[999999] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#1C1C1E] p-6 rounded-md text-white max-w-md w-full relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={closePopup}
                className="absolute top-3 right-3 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
              <h2 className="text-xl font-bold mb-2">Trip Summary</h2>
              <p className="text-sm mb-2">
                <strong>From:</strong> {location}
              </p>
              <p className="text-sm mb-2">
                <strong>To:</strong>{" "}
                {selectedDestination?.label || "Not selected"}
              </p>
              <p className="text-sm mb-2">
                <strong>Date:</strong>{" "}
                {selectedDate ? selectedDate.toDateString() : "Not selected"}
              </p>
              <p className="text-sm mb-4">
                <strong>Vehicle:</strong>{" "}
                {selectedVehicle ? selectedVehicle : "Not selected"}
              </p>
              <div className="text-center text-orange-400 font-medium">
                No rides available currently.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
