import { available_rides } from "@/constants";
import { MapPin, Clock, Users, CircleAlert } from "lucide-react";
import React, { useState } from "react";
import BookingsPopup from "./BookingsPopup";
import { useRouter } from "next/navigation";

const AvailableParks = ({ tripData }) => {
  const [selectedRide, setSelectedRide] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

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

  return (
    <>
      <section className="py-6">
        <div className="flex flex-col gap-6">
          {available_rides.length > 1 ? (
            <>
              {available_rides.map((ride, index) => (
                <div
                  key={index}
                  onClick={() => handleRideClick(ride)}
                  className="w-full rounded-3xl bg-cover bg-center min-h-[400px] md:h-[400px] border border-slate-200/10 relative overflow-hidden transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                  style={{
                    backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.85)), url(${ride.image})`,
                  }}
                >
                  {/* Content */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between h-full p-6 md:p-8 md:divide-x divide-white/10">
                    {/* Park */}
                    <div className="pb-6 md:pb-0 md:pr-8 border-b md:border-b-0 border-white/10">
                      <h5 className="text-white font-black text-3xl md:text-2xl tracking-tight">
                        {ride.park}
                      </h5>
                      <p className="text-gray-400 text-sm mt-1">
                        Transport Park
                      </p>
                    </div>

                    {/* Destination */}
                    <div className="py-6 md:py-0 md:px-8 border-b md:border-b-0 border-white/10">
                      <h5 className="font-semibold text-lg md:text-xl flex items-center gap-2 text-gray-300 mb-2">
                        <MapPin size={20} className="text-[#FFC107]" />
                        Destination
                      </h5>
                      <h5 className="text-2xl md:text-xl font-bold text-white">
                        {tripData.location} - {tripData.destination}
                      </h5>
                    </div>

                    {/* Details */}
                    <div className="pt-6 md:pt-0 md:pl-8 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-[#FFC107] font-black text-2xl md:text-xl">
                          {ride.price}
                        </span>
                        <span className="text-gray-400 text-sm">per seat</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-300">
                        <Clock size={18} className="text-blue-400" />
                        <span className="text-sm md:text-base">
                          {ride.departure}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users size={18} className="text-green-400" />
                        <span className="text-sm md:text-base text-gray-300">
                          <span className="font-semibold text-white">
                            {ride.available_seats}
                          </span>{" "}
                          seats left
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="h-screen bg-red-400/10 border text-center border-red-800 rounded-2xl gap-4 p-12 w-full flex flex-col items-center justify-center">
                <CircleAlert size={50} />
                <h1 className="font-black text-5xl">Sorry</h1>
                <h5 className="font-medium text-xl">
                  We couldn't find any available rides with your details.
                </h5>
                <button
                  onClick={goHome}
                  className="border border-slate-200/30 hover:bg-slate-200/20 px-8 py-2 transition-all ease-in-out duration-300 rounded-2xl cursor-pointer"
                >
                  Try booking again
                </button>
              </div>
            </>
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
      />
    </>
  );
};

export default AvailableParks;
