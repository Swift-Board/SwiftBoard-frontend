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

const page = () => {
  const [tripData, setTripData] = useState({});
  const [vehicleIcon, setVehicleIcon] = useState(null);

  useEffect(() => {
    const storedTripData = JSON.parse(localStorage.getItem("tripData"));

    if (storedTripData) {
      setTripData(storedTripData);
      const getVehicleIcon = () => {
        const vehicle = storedTripData.selectedVehicle?.toLowerCase();

        switch (vehicle) {
          case "sienna":
            return <CarTaxiFront className="inline-block mr-2" size={20} />;
          case "bus":
            return <Bus className="inline-block mr-2" size={20} />;
          case "car":
            return <Car className="inline-block mr-2" size={20} />;
          default:
            return <Car className="inline-block mr-2" size={20} />;
        }
      };

      setVehicleIcon(getVehicleIcon());
    }
  }, []);

  return (
    <>
      <main className="layout">
        {/* header */}
        <span className="flex items-center text-gray-400 justify-between flex-wrap gap-2 sticky top-16 bg-black py-4 z-[9999]">
          <h1 className="text-3xl font-black">Bookings</h1>
          <h5 className="place-self-end flex items-center gap-2">
            <Navigation /> {tripData.location} - {tripData.destination}
          </h5>
          <h5 className="place-self-end  flex items-center gap-2">
            <Calendar />{" "}
            {tripData.selectedDate &&
              new Date(tripData.selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
          </h5>
          <h5 className="place-self-end flex items-center justify-end">
            Vehicle:&nbsp; {vehicleIcon}
          </h5>
          <button className="flex items-center gap-2 border-teal-400 border text-white hover:bg-teal-400/20 p-2 px-4 font-black cursor-pointer text-xs rounded-2xl">
            <Edit />
            Edit
          </button>
        </span>

        <div className="flex items-center gap-4 justify-end mt-6">
          <h5 className="flex text-[#FFC107] items-center gap-2">
            Sort By <SortAsc />
          </h5>
          <div className="">
            <select className="border border-slate-200 rounded-2xl p-2">
              <option value="Distance" className="bg-black text-white">
                Distance
              </option>
              <option value="Price" className="bg-black text-white">
                Price
              </option>
            </select>
          </div>
        </div>
        <AvailableParks tripData={tripData} />
      </main>
    </>
  );
};

export default page;
