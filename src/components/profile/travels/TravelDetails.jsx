"use client";

import React, { useState, useEffect } from "react";
import {
  Download,
  Bus,
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  Navigation,
} from "lucide-react";
import { api } from "@/utils/axios";
import Ticket from "./Ticket";

const TravelDetails = () => {
  const [filter, setFilter] = useState("all");
  const [selectedRide, setSelectedRide] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/rides/my-bookings?status=${filter}`);
      if (data.success) setBookings(data.bookings);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "ongoing":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "pending":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="mx-auto">
        {/* Filter Header */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 no_scrollbar">
          {["all", "completed", "ongoing", "pending"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2 rounded-xl border transition-all ${
                filter === status
                  ? "bg-orange-600 border-orange-500"
                  : "bg-slate-900 border-slate-800 text-slate-400"
              }`}
            >
              <span className="capitalize">{status}</span>
            </button>
          ))}
        </div>

        {/* Table UI */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden">
          {loading ? (
            <div className="p-20 text-center animate-pulse text-slate-500">
              Loading trips...
            </div>
          ) : bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-sm">
                    <th className="p-6">Booking Ref</th>
                    <th className="p-6">Route</th>
                    <th className="p-6">Departure</th>
                    <th className="p-6">Seats</th>
                    <th className="p-6">Amount</th>
                    <th className="p-6">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr
                      key={b._id}
                      onClick={() => setSelectedRide(b)}
                      className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer"
                    >
                      <td className="p-6 font-mono text-orange-500">
                        {b.bookingRef}
                      </td>
                      <td className="p-6">
                        <div className="font-bold">
                          {b.ride?.origin} → {b.ride?.destination}
                        </div>
                        <div className="text-xs text-slate-500">
                          {b.ride?.park}
                        </div>
                      </td>
                      <td className="p-6 text-sm text-slate-300">
                        {new Date(b.ride?.departureTime).toLocaleDateString()}
                      </td>
                      <td className="p-6 text-slate-300">
                        {b.seatNumbers.join(", ")}
                      </td>
                      <td className="p-6 font-bold">
                        ₦{b.amountPaid?.toLocaleString()}
                      </td>
                      <td className="p-6">
                        <span
                          className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border ${getStatusColor(b.status)}`}
                        >
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center text-slate-500">
              <AlertCircle size={48} className="mb-4 opacity-20" />
              <p>No bookings found for "{filter}" status.</p>
            </div>
          )}
        </div>
      </div>

      {/* Ticket Modal */}
      {selectedRide && (
        <Ticket
          selectedRide={selectedRide}
          setSelectedRide={setSelectedRide}
          getStatusColor={getStatusColor}
        />
      )}
    </div>
  );
};

export default TravelDetails;
