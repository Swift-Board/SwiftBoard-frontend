"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Armchair, Wifi, WifiOff } from "lucide-react";
import { usePaystackPayment } from "react-paystack";
import { io } from "socket.io-client";
import { useNotification } from "../Notification";
import { api } from "@/utils/axios";

const BookingsPopup = ({
  isModalOpen,
  selectedRide,
  closeModal,
  tripData,
  onBookingSuccess,
}) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [liveOccupiedSeats, setLiveOccupiedSeats] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const socketRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const paymentTimeoutRef = useRef(null);
  const { showNotification } = useNotification();

  // --- Real-time Socket Listener ---
  useEffect(() => {
    if (!isModalOpen || !selectedRide) return;

    setIsLoading(true);

    // Connect to backend
    const socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000",
      {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      },
    );

    socketRef.current = socket;

    // Connection status handlers
    socket.on("connect", () => {
      console.log("✅ Socket connected");
      setIsConnected(true);
      socket.emit("joinRideRoom", selectedRide._id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setIsConnected(false);
    });

    // 🔄 Fetch fresh ride data from backend to ensure we have latest seats
    const fetchLatestRideData = async () => {
      try {
        const { data } = await api.get(`/rides/${selectedRide._id}`);
        if (data.success && data.ride) {
          console.log("🔄 Fetched latest seat data:", data.ride.occupiedSeats);
          setLiveOccupiedSeats(data.ride.occupiedSeats || []);
        } else {
          // Fallback to prop data if API fails
          setLiveOccupiedSeats(selectedRide.occupiedSeats || []);
        }
      } catch (error) {
        console.error("❌ Failed to fetch latest ride data:", error);
        // Fallback to prop data
        setLiveOccupiedSeats(selectedRide.occupiedSeats || []);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestRideData();
    setSelectedSeats([]);
    setIsProcessing(false);

    // Listen for seat updates from other users
    socket.on("seatsUpdated", (updatedOccupiedSeats) => {
      console.log("📡 Received seat update:", updatedOccupiedSeats);
      setLiveOccupiedSeats(updatedOccupiedSeats);

      // Deselect any seat the user was holding if someone else just booked it
      setSelectedSeats((prev) => {
        const stillAvailable = prev.filter(
          (id) => !updatedOccupiedSeats.includes(id),
        );

        // Notify user if their selection was taken
        if (stillAvailable.length < prev.length) {
          showNotification({
            type: "warning",
            title: "Seats Unavailable",
            message: "Some selected seats were just booked by another user",
          });
        }

        return stillAvailable;
      });
    });

    // Cleanup
    return () => {
      if (socket) {
        socket.emit("leaveRideRoom", selectedRide._id);
        socket.disconnect();
      }
      // Clear any pending payment timeout
      if (paymentTimeoutRef.current) {
        clearTimeout(paymentTimeoutRef.current);
      }
    };
  }, [isModalOpen, selectedRide]);

  if (!isModalOpen || !selectedRide) return null;

  const ridePrice = selectedRide.price || 0;
  const totalAmount = ridePrice * selectedSeats.length;

  const config = {
    reference: `TRX-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
    email: tripData?.userEmail || tripData?.email || "customer@example.com",
    amount: totalAmount * 100,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
  };

  const initializePayment = usePaystackPayment(config);

  const handleMarkSeatsAsTaken = async (reference) => {
    console.log("💳 Processing payment reference:", reference);
    console.log("🎫 Booking seats:", selectedSeats);
    console.log("🚗 Ride ID:", selectedRide._id);

    try {
      const { data } = await api.patch(`/rides/${selectedRide._id}/book`, {
        seatNumbers: selectedSeats,
        paymentReference: reference,
      });

      console.log("✅ Backend response:", data);

      if (data.success) {
        showNotification({
          type: "success",
          title: "Booking Confirmed",
          message: `Successfully booked ${selectedSeats.length} seat(s). Safe trip!`,
        });

        // ✅ Notify parent to refresh ride list
        if (onBookingSuccess) {
          onBookingSuccess(data.ride);
        }

        setSelectedSeats([]);
        closeModal();
      } else {
        console.error("❌ Booking failed - success: false in response");
        throw new Error("Booking failed");
      }
    } catch (error) {
      console.error("🔥 Booking error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        fullError: error,
      });

      const errorMsg = error.response?.data?.message || "Something went wrong";

      showNotification({
        type: "error",
        title: "Booking Failed",
        message:
          errorMsg === "Seats unavailable or already booked"
            ? "These seats were just taken. Please select different seats."
            : errorMsg,
      });

      // Clear selections on booking failure
      if (error.response?.status === 400) {
        setSelectedSeats([]);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentAction = () => {
    if (selectedSeats.length === 0) return;

    // Check connection before proceeding
    if (!isConnected) {
      showNotification({
        type: "error",
        title: "Connection Lost",
        message: "Please check your internet connection and try again",
      });
      return;
    }

    setIsProcessing(true);

    // Clear any existing timeout
    if (paymentTimeoutRef.current) {
      clearTimeout(paymentTimeoutRef.current);
    }

    // Safety timeout - reset if payment doesn't complete in 5 minutes
    paymentTimeoutRef.current = setTimeout(() => {
      console.log("⏰ Payment timeout - resetting state");
      setIsProcessing(false);
      showNotification({
        type: "warning",
        title: "Payment Timeout",
        message: "Payment window was open too long. Please try again.",
      });
    }, 300000); // 5 minutes

    // Backup: Also reset after 3 seconds of Paystack iframe being closed
    // This catches cases where onClose doesn't fire
    const checkPaystackClosed = setInterval(() => {
      const paystackIframe = document.querySelector('iframe[src*="paystack"]');
      if (!paystackIframe && isProcessing) {
        console.log("🔍 Detected Paystack closed without callback");
        clearInterval(checkPaystackClosed);
        clearTimeout(paymentTimeoutRef.current);
        setIsProcessing(false);
      }
    }, 500);

    initializePayment(
      // Success callback
      (reference) => {
        clearInterval(checkPaystackClosed);
        clearTimeout(paymentTimeoutRef.current);
        console.log("✅ Payment successful:", reference);
        handleMarkSeatsAsTaken(reference.reference);
      },
      // Close/Cancel callback
      () => {
        clearInterval(checkPaystackClosed);
        clearTimeout(paymentTimeoutRef.current);
        console.log("❌ Payment cancelled or closed");
        setIsProcessing(false);
        showNotification({
          type: "info",
          title: "Payment Cancelled",
          message:
            "You closed the payment window. Your seats are still available.",
        });
      },
    );
  };

  const toggleSeat = (seatId) => {
    // Prevent selection if processing or seat is occupied
    if (liveOccupiedSeats.includes(seatId) || isProcessing) return;

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId],
    );
  };

  const renderSeats = () => {
    const type = selectedRide.vehicleType?.toLowerCase() || "car";
    const vConfig = {
      bus: { front: 2, rows: 3, cols: 4, total: 14 },
      sienna: { front: 1, rows: 2, cols: 3, total: 7 },
      car: { front: 1, rows: 1, cols: 3, total: 4 },
    }[type];

    const seatUI = (id, label) => {
      const isOccupied = liveOccupiedSeats.includes(id);
      const isSelected = selectedSeats.includes(id);

      return (
        <button
          key={id}
          type="button"
          disabled={isOccupied || isProcessing}
          onClick={() => toggleSeat(id)}
          className={`relative py-3 rounded-lg flex flex-col items-center justify-center transition-all duration-300
            ${
              isOccupied
                ? "bg-gray-800 text-gray-600 cursor-not-allowed border-transparent"
                : isSelected
                  ? "bg-orange-500 text-white scale-110 shadow-lg shadow-orange-500/30 border-orange-400"
                  : "bg-gray-700/50 text-gray-300 hover:bg-gray-600 border-white/5 border hover:border-orange-500/50"
            }`}
        >
          <Armchair size={18} className={isSelected ? "animate-pulse" : ""} />
          <span className="text-[10px] mt-1 font-bold">
            {label || `S${id}`}
          </span>
        </button>
      );
    };

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-3 gap-3 items-end px-2">
          <div className="flex flex-col items-center opacity-30 grayscale">
            <div className="w-8 h-8 border-2 border-white rounded-full mb-1 flex items-center justify-center">
              <div className="w-1 h-3 bg-white rounded-full" />
            </div>
            <span className="text-[7px] uppercase font-black">Driver</span>
          </div>
          {vConfig.front === 2 ? (
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
        <div
          className={`grid gap-3 ${vConfig.cols === 4 ? "grid-cols-4" : "grid-cols-3"}`}
        >
          {Array.from({ length: vConfig.total - vConfig.front }).map((_, i) =>
            seatUI(i + vConfig.front + 1),
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-[999999] flex items-center justify-center p-4"
      onClick={closeModal}
    >
      <div
        ref={scrollContainerRef}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#1C1C1E] rounded-[2.5rem] text-white max-w-xl w-full relative border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh] no_scrollbar"
      >
        {/* Connection Status Indicator */}
        <div className="absolute top-4 left-4 z-10">
          {isConnected ? (
            <div className="flex items-center gap-1 bg-green-500/20 px-2 py-1 rounded-full">
              <Wifi size={12} className="text-green-500" />
              <span className="text-[8px] text-green-500 font-bold">LIVE</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 bg-red-500/20 px-2 py-1 rounded-full">
              <WifiOff size={12} className="text-red-500" />
              <span className="text-[8px] text-red-500 font-bold">OFFLINE</span>
            </div>
          )}
        </div>

        <div
          className="relative h-44 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), #1C1C1E), url(${selectedRide.image || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069"})`,
          }}
        >
          <button
            onClick={closeModal}
            className="absolute top-6 right-6 p-2 bg-black/40 hover:bg-black/60 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          <div className="absolute bottom-4 left-8">
            <h2 className="text-3xl font-black">{selectedRide.park}</h2>
            <p className="text-orange-500 text-xs font-black uppercase tracking-widest">
              {selectedRide.destination}
            </p>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
            </div>
          ) : (
            <>
              <div className="bg-black/40 rounded-[2rem] p-8 border border-white/5">
                <div className="max-w-[260px] mx-auto border-x-4 border-t-[35px] border-[#2C2C2E] rounded-t-[60px] rounded-b-3xl p-6 bg-[#0A0A0B]">
                  {renderSeats()}
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-4 text-[10px]">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-700/50 rounded border border-white/5" />
                  <span className="text-gray-400">Available</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-orange-500 rounded" />
                  <span className="text-gray-400">Selected</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-800 rounded" />
                  <span className="text-gray-400">Taken</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                  <span className="text-[10px] text-gray-500 font-bold uppercase">
                    Subtotal
                  </span>
                  <p className="text-xl font-black text-orange-500">
                    ₦{totalAmount.toLocaleString()}
                  </p>
                </div>
                <div className="flex-1 bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                  <span className="text-[10px] text-gray-500 font-bold uppercase">
                    Seats
                  </span>
                  <p className="text-xl font-bold">
                    {selectedSeats.length || "0"}
                  </p>
                </div>
              </div>

              <button
                onClick={handlePaymentAction}
                disabled={
                  selectedSeats.length === 0 || isProcessing || !isConnected
                }
                className={`w-full py-5 rounded-2xl font-black text-lg transition-all ${
                  selectedSeats.length > 0 && !isProcessing && isConnected
                    ? "bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/20 active:scale-95"
                    : "bg-gray-800 text-gray-600 cursor-not-allowed"
                }`}
              >
                {!isConnected
                  ? "Connection Lost..."
                  : isProcessing
                    ? "Finalizing Booking..."
                    : selectedSeats.length > 0
                      ? `Pay ₦${totalAmount.toLocaleString()}`
                      : "Select a Seat"}
              </button>

              {/* Emergency Cancel Button - only shows if stuck in processing */}
              {isProcessing && (
                <button
                  onClick={() => {
                    setIsProcessing(false);
                    showNotification({
                      type: "info",
                      title: "Cancelled",
                      message: "Booking process cancelled. You can try again.",
                    });
                  }}
                  className="w-full py-3 rounded-xl font-bold text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                >
                  Cancel & Reset
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingsPopup;
