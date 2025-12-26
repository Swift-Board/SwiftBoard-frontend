import { Banknote, Clock, MapPin, Users, X, Armchair } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

const BookingsPopup = ({ isModalOpen, selectedRide, closeModal, tripData }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (selectedSeats.length > 0 && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [selectedSeats]);

  // Mock occupied seats
  const occupiedSeats = [2, 5, 11];

  const toggleSeat = (seatId) => {
    if (occupiedSeats.includes(seatId)) return;
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  // Dynamic Seat Configuration Logic
  const renderSeats = () => {
    const type = tripData?.selectedVehicle?.toLowerCase() || "car";
    let config = { front: 1, rows: 1, cols: 3 };

    if (type === "sienna") {
      config = { front: 1, rows: 2, cols: 3 };
    } else if (type === "bus") {
      config = { front: 2, rows: 3, cols: 4 };
    }

    const seatUI = (id, label) => {
      const isOccupied = occupiedSeats.includes(id);
      const isSelected = selectedSeats.includes(id);
      return (
        <button
          key={id}
          disabled={isOccupied}
          onClick={() => toggleSeat(id)}
          className={`relative py-3 rounded-lg flex flex-col items-center justify-center transition-all duration-200
            ${
              isOccupied
                ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                : isSelected
                ? "bg-orange-500 text-white scale-110 shadow-lg shadow-orange-500/20"
                : "bg-gray-700/50 text-gray-300 hover:bg-gray-600 border border-white/5"
            }`}
        >
          <Armchair size={18} className={isSelected ? "animate-bounce" : ""} />
          <span className="text-[10px] mt-1 font-bold">{label || id}</span>
        </button>
      );
    };

    return (
      <div className="space-y-8">
        {/* Front Row: Driver + Passenger Seats (Dynamic) */}
        <div className="grid grid-cols-3 gap-3 items-end px-2">
          <div className="p-2 bg-gray-800/30 rounded-lg text-gray-600 flex flex-col items-center">
            <div className="w-8 h-8 border-2 border-gray-700 rounded-full flex items-center justify-center mb-1">
              <div className="w-1 h-4 bg-gray-700 rounded-full rotate-45" />
            </div>
            <span className="text-[8px] uppercase font-bold text-center">
              Driver
            </span>
          </div>

          {config.front === 2 ? (
            <>
              {seatUI(1, "F1")}
              {seatUI(2, "F2")}
            </>
          ) : (
            <>
              <div />
              {seatUI(1, "F1")}
            </>
          )}
        </div>

        {/* Main Cabin Rows */}
        <div
          className={`grid gap-3 ${
            config.cols === 4 ? "grid-cols-4" : "grid-cols-3"
          }`}
        >
          {[...Array(config.rows * config.cols)].map((_, i) =>
            seatUI(i + (config.front + 1))
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {isModalOpen && selectedRide && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999999] flex items-center justify-center p-4 animate-fade-in"
          onClick={closeModal}
        >
          <div
            ref={scrollContainerRef}
            className="bg-[#1C1C1E] rounded-3xl text-white max-w-2xl w-full relative border border-gray-800 shadow-2xl animate-scale-in no_scrollbar overflow-y-auto max-h-[95vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="relative h-40 bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(28, 28, 30, 1)), url(${selectedRide.image})`,
              }}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition bg-black/50 rounded-full p-2"
              >
                <X size={24} />
              </button>
              <div className="absolute bottom-4 left-6">
                <h2 className="text-2xl font-black text-white">
                  {selectedRide.park}
                </h2>
                <p className="text-gray-400 text-sm uppercase tracking-wider font-bold">
                  {tripData?.selectedVehicle || "Vehicle"} •{" "}
                  {selectedRide.destination}
                </p>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* SEAT SELECTION AREA */}
              <div className="bg-black/20 rounded-2xl p-6 border border-gray-800">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg">Select Seats</h3>
                  <div className="flex gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-gray-700 rounded-sm" /> Sold
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-orange-500 rounded-sm" />{" "}
                      Selected
                    </div>
                  </div>
                </div>

                <div className="max-w-[300px] mx-auto border-x-4 border-t-[40px] border-b-8 border-gray-800 rounded-t-[60px] rounded-b-[30px] p-6 relative bg-[#151517] shadow-2xl">
                  {renderSeats()}
                </div>
              </div>

              {/* Trip Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                  <p className="text-xs text-gray-400">Total Price</p>
                  <p className="text-xl font-black text-[#FFC107]">
                    ₦
                    {(
                      parseInt(selectedRide.price.replace(/\D/g, "")) *
                      (selectedSeats.length || 0)
                    ).toLocaleString()}
                  </p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <p className="text-xs text-gray-400">Seats Selected</p>
                  <p className="text-xl font-bold text-white">
                    {selectedSeats.length > 0
                      ? selectedSeats.join(", ")
                      : "None"}
                  </p>
                </div>
              </div>

              <button
                disabled={selectedSeats.length === 0}
                className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg 
                  ${
                    selectedSeats.length > 0
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:scale-[1.02] active:scale-95"
                      : "bg-gray-700 text-gray-500 cursor-not-allowed"
                  }`}
              >
                {selectedSeats.length > 0
                  ? `Confirm ${selectedSeats.length} Seats`
                  : "Select a Seat"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingsPopup;
