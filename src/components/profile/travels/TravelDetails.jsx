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
import { apiAuth } from "@/utils/axios";
import Ticket from "./Ticket";

const TravelDetails = () => {
  const [filter, setFilter] = useState("all");
  const [selectedRide, setSelectedRide] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]); // Store all bookings for counting
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiAuth.get(`/rides/my-bookings?status=${filter}`);
      console.log("📚 Fetched bookings:", data);

      if (data.success) {
        setBookings(data.bookings);
      } else {
        setError("Failed to load bookings");
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all bookings once for badge counts
  const fetchAllBookings = async () => {
    try {
      const { data } = await apiAuth.get(`/rides/my-bookings?status=all`);
      if (data.success) {
        setAllBookings(data.bookings);
      }
    } catch (err) {
      console.error("❌ Failed to fetch all bookings:", err);
    }
  };

  useEffect(() => {
    fetchAllBookings(); // Fetch once on mount for counts
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  // Count bookings by status
  const getStatusCount = (status) => {
    if (status === "all") return allBookings.length;
    return allBookings.filter((b) => b.status === status).length;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "ongoing":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "pending":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black mb-2">My Bookings</h1>
          <p className="text-slate-400">View and manage your travel history</p>
        </div>

        {/* Filter Header */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 no_scrollbar">
          {["all", "pending", "ongoing", "completed", "cancelled"].map(
            (status) => {
              const count = getStatusCount(status);
              return (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-6 py-2 rounded-xl border transition-all whitespace-nowrap ${
                    filter === status
                      ? "bg-orange-600 border-orange-500 text-white"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <span className="capitalize">{status}</span>
                  {count > 0 && (
                    <span
                      className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-black ${
                        filter === status
                          ? "bg-white/20 text-white"
                          : "bg-orange-500/20 text-orange-400"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            },
          )}
        </div>

        {/* Stats Footer */}
        {allBookings.length > 0 && (
          <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <div className="text-slate-400 text-sm mb-2">Total Bookings</div>
              <div className="text-2xl font-black text-white">
                {allBookings.length}
              </div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <div className="text-slate-400 text-sm mb-2">Total Seats</div>
              <div className="text-2xl font-black text-white">
                {allBookings.reduce(
                  (sum, b) => sum + (b.seatNumbers?.length || 0),
                  0,
                )}
              </div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <div className="text-slate-400 text-sm mb-2">Total Spent</div>
              <div className="text-2xl font-black text-orange-500">
                ₦
                {allBookings
                  .reduce((sum, b) => sum + (b.amountPaid || 0), 0)
                  .toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Table UI */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden">
          {loading ? (
            <div className="p-20 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-4"></div>
              <p className="text-slate-500">Loading trips...</p>
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
                      <td className="p-6">
                        <div className="font-mono text-orange-500 font-bold">
                          {b.bookingRef}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {new Date(b.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="font-bold text-white">
                          {b.ride?.origin || "N/A"} →{" "}
                          {b.ride?.destination || "N/A"}
                        </div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <Bus size={12} />
                          {b.ride?.park || "Unknown Park"}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="text-sm text-slate-300 flex items-center gap-2">
                          <Calendar size={14} className="text-slate-500" />
                          {b.ride?.departureTime
                            ? new Date(b.ride.departureTime).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )
                            : "N/A"}
                        </div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                          <Clock size={12} />
                          {b.ride?.departureTime
                            ? new Date(b.ride.departureTime).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )
                            : "N/A"}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-wrap gap-1">
                          {b.seatNumbers && b.seatNumbers.length > 0 ? (
                            b.seatNumbers.map((seat) => (
                              <span
                                key={seat}
                                className="px-2 py-1 bg-orange-500/10 text-orange-400 rounded-md text-xs font-bold border border-orange-500/20"
                              >
                                {seat}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-500 text-xs">
                              No seats
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {b.seatNumbers?.length || 0} seat(s)
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="font-bold text-lg text-white">
                          ₦{b.amountPaid?.toLocaleString() || "0"}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {b.paymentReference?.substring(0, 12)}...
                        </div>
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
              <p className="text-lg font-bold mb-2">No bookings found</p>
              <p className="text-sm">
                {filter === "all"
                  ? "You haven't made any bookings yet"
                  : `No "${filter}" bookings found`}
              </p>
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
