"use client";

import React, { useState } from "react";
import {
  Download,
  Bus,
  Calendar,
  Clock,
  MapPin,
  User,
  X,
  Eye,
  AlertCircle,
  Navigation,
} from "lucide-react";
import { ride_details } from "@/constants";
import Ticket from "./Ticket";
import { useRouter } from "next/navigation";

const TravelDetails = () => {
  const [filter, setFilter] = useState("all");
  const [selectedRide, setSelectedRide] = useState(null);
  const router = useRouter();

  const filteredRides =
    filter === "all"
      ? ride_details
      : ride_details.filter((ride) => ride.status === filter);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "ongoing":
        return "bg-orange-500/10 text-orange-400 border border-orange-500/20";
      case "pending":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border border-slate-500/20";
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto">
        {/* Filter Buttons */}
        <div className="flex sticky top-16 bg-black py-4 z-50 no_scrollbar overflow-scroll gap-3 mb-6 mt-4">
          {["all", "completed", "ongoing", "pending"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                filter === status
                  ? "bg-orange-600 text-white shadow-lg shadow-orange-500/30"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Table Container */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          {filteredRides.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-800 border-b border-slate-700">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-slate-300">
                      Booking Ref
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-slate-300">
                      Route
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-slate-300">
                      Date
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-slate-300">
                      Departure
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-slate-300">
                      Seat
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-slate-300">
                      Price
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-slate-300">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRides.map((ride, index) => (
                    <tr
                      key={ride.id}
                      className={`border-b border-slate-800 hover:bg-slate-800/50 transition-colors ${
                        index % 2 === 0 ? "bg-slate-900" : "bg-slate-900/50"
                      }`}
                      onClick={() => setSelectedRide(ride)}
                    >
                      <td className="py-4 px-6 text-slate-300 font-mono text-sm">
                        {ride.bookingRef}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold">
                            {ride.terminal}
                          </span>
                          <span className="text-orange-400">→</span>
                          <span className="text-white font-semibold">
                            {ride.destination}
                          </span>
                          {ride.status === "ongoing" && (
                            <div
                              className="ml-2 flex items-center justify-center animate-pulse bg-orange-500/20 p-1.5 rounded-full"
                              title="Track Live"
                            >
                              <Navigation
                                size={14}
                                className="text-orange-400 fill-orange-400"
                              />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-300">{ride.date}</td>
                      <td className="py-4 px-6 text-slate-300">
                        {ride.departure}
                      </td>
                      <td className="py-4 px-6 text-slate-300">{ride.seat}</td>
                      <td className="py-4 px-6 text-white font-semibold">
                        ₦{ride.price}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-md text-xs font-semibold ${getStatusColor(
                            ride.status
                          )}`}
                        >
                          {ride.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <AlertCircle size={32} className="text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No rides found
              </h3>
              <p className="text-slate-400 max-w-xs mb-6">
                There are no trips matching the "{filter}" status at the moment.
              </p>
              {filter !== "all" && (
                <button
                  onClick={() => setFilter("all")}
                  className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
                >
                  View all rides
                </button>
              )}
              {filter == "all" && (
                <button
                  onClick={() => router.replace("/")}
                  className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
                >
                  Start Booking
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <Ticket
        selectedRide={selectedRide}
        getStatusColor={getStatusColor}
        setSelectedRide={setSelectedRide}
      />
    </div>
  );
};

export default TravelDetails;
