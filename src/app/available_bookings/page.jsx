"use client";

import React, { useEffect, useState } from "react";
import {
  Car,
  Bus,
  CarTaxiFront,
  Navigation,
  Calendar,
  Edit,
  SortAsc,
} from "lucide-react";
import AvailableParks from "@/components/available_bookings/AvailableParks";
import { useRouter } from "next/navigation";

const page = () => {
  const [tripData, setTripData] = useState({});
  const [rides, setRides] = useState([]);
  const [vehicleIcon, setVehicleIcon] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedString = localStorage.getItem("tripData");

    if (storedString) {
      const data = JSON.parse(storedString);
      setTripData(data);
      setRides(data.results || []);

      const vehicle = data.selectedVehicle?.toLowerCase();
      const icons = {
        sienna: <CarTaxiFront className="inline-block mr-2" size={20} />,
        bus: <Bus className="inline-block mr-2" size={20} />,
        car: <Car className="inline-block mr-2" size={20} />,
      };
      setVehicleIcon(
        icons[vehicle] || <Car className="inline-block mr-2" size={20} />,
      );
    }
  }, []);

  return (
    <main className="layout">
      {/* Header section (Sticky) */}
      <span className="flex items-center text-gray-400 justify-between flex-wrap gap-2 sticky top-16 bg-black py-4 z-[9999]">
        <h1 className="text-3xl font-black text-white">Bookings</h1>
        <h5 className="place-self-end flex items-center gap-2">
          <Navigation size={18} className="text-teal-400" /> {tripData.location}{" "}
          - {tripData.destination}
        </h5>
        <h5 className="place-self-end flex items-center gap-2">
          <Calendar size={18} className="text-teal-400" />
          {tripData.selectedDate &&
            new Date(tripData.selectedDate).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
        </h5>
        <h5 className="place-self-end flex items-center justify-end">
          Vehicle: {vehicleIcon}
        </h5>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 border-teal-400 border text-white hover:bg-teal-400/20 p-2 px-4 font-black cursor-pointer text-xs rounded-2xl"
        >
          <Edit size={14} /> Edit
        </button>
      </span>

      <div className="flex items-center gap-4 justify-end mt-6">
        <h5 className="flex text-[#FFC107] items-center gap-2 font-bold">
          Sort By <SortAsc size={20} />
        </h5>
        <select className="border border-gray-700 bg-transparent text-white rounded-2xl p-2 focus:ring-2 focus:ring-teal-400 outline-none">
          <option className="bg-black" value="Distance">
            Distance
          </option>
          <option className="bg-black" value="Price">
            Price
          </option>
        </select>
      </div>

      <AvailableParks tripData={tripData} rides={rides} />
    </main>
  );
};

export default page;
