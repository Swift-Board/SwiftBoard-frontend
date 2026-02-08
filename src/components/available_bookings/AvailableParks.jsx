import { MapPin, Clock, Users, CircleAlert } from "lucide-react";
import React, { useState } from "react";
import dynamic from "next/dynamic";
const BookingsPopup = dynamic(() => import("./BookingsPopup"), {
  ssr: false,
  loading: () => <p>Loading Booking System...</p>,
});
import { useRouter } from "next/navigation";

const AvailableParks = ({ tripData, rides = [], onRefreshRides }) => {
  const [selectedRide, setSelectedRide] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localRides, setLocalRides] = useState(rides);
  const router = useRouter();

  React.useEffect(() => {
    setLocalRides(rides);
  }, [rides]);

  const handleBookingSuccess = (updatedRide) => {
    // Update the specific ride in local state
    setLocalRides((prevRides) =>
      prevRides.map((ride) =>
        ride._id === updatedRide._id ? updatedRide : ride,
      ),
    );

    // Also update selectedRide if it's still open
    setSelectedRide(updatedRide);

    // Optionally refresh from parent
    if (onRefreshRides) {
      onRefreshRides();
    }
  };

  const handleRideClick = (ride) => {
    setSelectedRide(ride);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedRide(null), 300);
  };

  const goHome = () => {
    router.replace("/");
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ✅ Calculate available seats correctly
  const getAvailableSeats = (ride) => {
    const totalSeats = ride.totalSeats || 0;
    const occupiedSeats = ride.occupiedSeats?.length || 0;
    return totalSeats - occupiedSeats;
  };

  return (
    <>
      <section className="py-6">
        <div className="flex flex-col gap-6">
          {localRides && localRides.length > 0 ? (
            <>
              {localRides.map((ride, index) => {
                const availableSeats = getAvailableSeats(ride);

                return (
                  <div
                    key={ride._id || index}
                    onClick={() => handleRideClick(ride)}
                    className="w-full rounded-3xl bg-cover bg-center min-h-[400px] md:h-[400px] border border-slate-200/10 relative overflow-hidden transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                    style={{
                      backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.85)), url(${
                        ride.image ||
                        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069"
                      })`,
                    }}
                  >
                    {/* Content */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between h-full p-6 md:p-8 md:divide-x divide-white/10">
                      {/* Park / Driver Info */}
                      <div className="pb-6 md:pb-0 md:pr-8 border-b md:border-b-0 border-white/10">
                        <h5 className="text-white font-black text-3xl md:text-2xl tracking-tight">
                          {ride.park ||
                            (ride.driver && ride.driver.name) ||
                            "Express Terminal"}
                        </h5>
                        <p className="text-gray-400 text-sm mt-1 uppercase tracking-widest">
                          {ride.vehicleType} Service
                        </p>
                      </div>

                      {/* Destination Info */}
                      <div className="py-6 md:py-0 md:px-8 border-b md:border-b-0 border-white/10">
                        <h5 className="font-semibold text-lg md:text-xl flex items-center gap-2 text-gray-300 mb-2">
                          <MapPin size={20} className="text-[#FFC107]" />
                          Destination
                        </h5>
                        <h5 className="text-2xl md:text-xl font-bold text-white">
                          {ride.origin} → {ride.destination}
                        </h5>
                      </div>

                      {/* Pricing & Availability */}
                      <div className="pt-6 md:pt-0 md:pl-8 space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="text-[#FFC107] font-black text-2xl md:text-xl">
                            ₦{ride.price?.toLocaleString()}
                          </span>
                          <span className="text-gray-400 text-sm">
                            per seat
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-300">
                          <Clock size={18} className="text-blue-400" />
                          <span className="text-sm md:text-base">
                            Departure: {formatTime(ride.departureTime)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Users
                            size={18}
                            className={
                              availableSeats > 0
                                ? "text-green-400"
                                : "text-red-400"
                            }
                          />
                          <span className="text-sm md:text-base text-gray-300">
                            <span
                              className={`font-semibold ${availableSeats > 0 ? "text-white" : "text-red-400"}`}
                            >
                              {availableSeats}
                            </span>{" "}
                            {availableSeats === 1 ? "seat" : "seats"} left
                          </span>
                        </div>

                        {/* Show "FULL" badge if no seats */}
                        {availableSeats === 0 && (
                          <div className="bg-red-500/20 border border-red-500/50 rounded-lg px-3 py-1 text-xs font-bold text-red-400 uppercase tracking-wider">
                            Fully Booked
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div className="min-h-[60vh] bg-red-400/5 border text-center border-red-800/30 rounded-3xl gap-4 p-12 w-full flex flex-col items-center justify-center backdrop-blur-sm">
              <CircleAlert size={60} className="text-red-500 animate-pulse" />
              <h1 className="font-black text-5xl text-white">No Rides</h1>
              <h5 className="font-medium text-xl text-gray-400 max-w-md">
                We couldn't find any available{" "}
                <strong>{tripData.selectedVehicle}</strong> trips to{" "}
                {tripData.destination} for the selected date.
              </h5>
              <button
                onClick={goHome}
                className="mt-4 border border-white/20 hover:bg-white/10 px-10 py-3 transition-all ease-in-out duration-300 rounded-2xl cursor-pointer text-white font-semibold"
              >
                Try a different date
              </button>
            </div>
          )}
        </div>
      </section>

      <BookingsPopup
        selectedRide={selectedRide}
        setSelectedRide={setSelectedRide}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        closeModal={closeModal}
        tripData={tripData}
        onBookingSuccess={handleBookingSuccess}
      />
    </>
  );
};

export default AvailableParks;
