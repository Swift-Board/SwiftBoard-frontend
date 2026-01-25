"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Armchair, Wifi, WifiOff } from "lucide-react";
import { io } from "socket.io-client";
import { useNotification } from "../Notification";
import { api, apiAuth } from "@/utils/axios";

// Dynamically load Paystack script
const usePaystackScript = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (window.PaystackPop) {
      setLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, []);

  return loaded;
};

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
  const paystackLoaded = usePaystackScript();

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

  const ridePrice = selectedRide?.price || 0;
  const totalAmount = ridePrice * selectedSeats.length;

  if (!isModalOpen || !selectedRide) return null;

  // Get user email from localStorage
  let userEmail = "customer@example.com";
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      userEmail = user.email || userEmail;
    }
  } catch (error) {
    console.error("Failed to get user email from localStorage:", error);
  }

  const handleMarkSeatsAsTaken = async (reference) => {
    console.log("💳 Processing payment reference:", reference);
    console.log("🎫 Booking seats:", selectedSeats);
    console.log("🚗 Ride ID:", selectedRide._id);

    try {
      // Add request timeout to prevent infinite loading
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.log("⏰ Request timeout - aborting");
      }, 30000); // 30 second timeout

      // 🔥 CRITICAL FIX: Use apiAuth instead of api for authenticated requests
      const { data } = await apiAuth.patch(
        `/rides/${selectedRide._id}/book`,
        {
          seatNumbers: selectedSeats,
          paymentReference: reference,
        },
        { signal: controller.signal },
      );

      clearTimeout(timeoutId);
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
        throw new Error(data.message || "Booking failed");
      }
    } catch (error) {
      console.error("🔥 Booking error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        fullError: error,
      });

      // Log the full response data for debugging
      if (error.response?.data) {
        console.error("📋 Backend error message:", error.response.data.message);
        console.error("📋 Full backend response:", error.response.data);
      }

      let errorMsg = "Something went wrong. Please try again.";

      if (error.name === "AbortError") {
        errorMsg =
          "Request timed out. Please check your connection and try again.";
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.message) {
        errorMsg = error.message;
      }

      showNotification({
        type: "error",
        title: "Booking Failed",
        message: errorMsg,
      });

      // Clear selections on booking failure
      if (error.response?.status === 400) {
        setSelectedSeats([]);
      }
    } finally {
      // 🔥 CRITICAL: Always reset processing state
      console.log("🔄 Resetting processing state");
      setIsProcessing(false);

      if (paymentTimeoutRef.current) {
        clearTimeout(paymentTimeoutRef.current);
      }
    }
  };

  const handlePaymentAction = async () => {
    if (selectedSeats.length === 0) {
      console.log("⚠️ No seats selected");
      return;
    }

    // Check connection before proceeding
    if (!isConnected) {
      console.log("⚠️ Not connected");
      showNotification({
        type: "error",
        title: "Connection Lost",
        message: "Please check your internet connection and try again",
      });
      return;
    }

    // Check if Paystack is loaded
    if (!paystackLoaded || !window.PaystackPop) {
      console.log("⚠️ Paystack not loaded yet");
      showNotification({
        type: "error",
        title: "Payment Error",
        message: "Payment system is loading. Please try again in a moment.",
      });
      return;
    }

    // 🔥 CRITICAL: Verify seats are still available before payment
    console.log("🔍 Verifying seat availability before payment...");
    try {
      const { data } = await api.get(`/rides/${selectedRide._id}`);
      if (data.success && data.ride) {
        const currentlyOccupied = data.ride.occupiedSeats || [];
        const conflictingSeats = selectedSeats.filter((seat) =>
          currentlyOccupied.includes(seat),
        );

        if (conflictingSeats.length > 0) {
          console.log("❌ Seats no longer available:", conflictingSeats);
          setLiveOccupiedSeats(currentlyOccupied);
          setSelectedSeats([]);

          showNotification({
            type: "error",
            title: "Seats Unavailable",
            message: `Seat(s) ${conflictingSeats.join(", ")} were just booked. Please select different seats.`,
          });
          return;
        }
        console.log("✅ All selected seats are available");
      }
    } catch (error) {
      console.error("Failed to verify seat availability:", error);
      showNotification({
        type: "error",
        title: "Verification Failed",
        message: "Unable to verify seat availability. Please try again.",
      });
      return;
    }

    const reference = `TRX-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

    console.log("🚀 Starting payment process...");
    console.log("💰 Total amount:", totalAmount);
    console.log("🎫 Selected seats:", selectedSeats);
    console.log("📧 Email:", userEmail);
    console.log(
      "🔑 Paystack key exists:",
      !!process.env.NEXT_PUBLIC_PAYSTACK_KEY,
    );
    console.log("📝 Payment reference:", reference);

    setIsProcessing(true);

    // Clear any existing timeout
    if (paymentTimeoutRef.current) {
      clearTimeout(paymentTimeoutRef.current);
    }

    // Reduced timeout to 2 minutes for better UX
    paymentTimeoutRef.current = setTimeout(() => {
      console.log("⏰ Payment timeout (2min) - resetting state");
      setIsProcessing(false);
      showNotification({
        type: "warning",
        title: "Payment Timeout",
        message: "Payment window was open too long. Please try again.",
      });
    }, 120000); // 2 minutes

    console.log("🎬 Initializing Paystack popup...");

    try {
      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
        email: userEmail,
        amount: totalAmount * 100,
        ref: reference,
        currency: "NGN",
        onClose: function () {
          console.log("❌❌❌ PAYSTACK WINDOW CLOSED!");
          clearTimeout(paymentTimeoutRef.current);
          setIsProcessing(false);

          showNotification({
            type: "info",
            title: "Payment Cancelled",
            message:
              "You closed the payment window. Your seats are still available.",
          });
        },
        callback: function (response) {
          console.log("✅✅✅ PAYSTACK SUCCESS!");
          console.log("📝 Response:", response);

          clearTimeout(paymentTimeoutRef.current);
          handleMarkSeatsAsTaken(response.reference);
        },
      });

      console.log("🎬 Opening Paystack iframe...");
      handler.openIframe();
      console.log("✅ Paystack popup opened");
    } catch (error) {
      console.error("🔥 Error initializing Paystack:", error);
      setIsProcessing(false);
      clearTimeout(paymentTimeoutRef.current);

      showNotification({
        type: "error",
        title: "Payment Error",
        message: "Failed to initialize payment. Please try again.",
      });
    }
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
                    ? "Processing Payment..."
                    : selectedSeats.length > 0
                      ? `Pay ₦${totalAmount.toLocaleString()}`
                      : "Select a Seat"}
              </button>

              {/* Emergency Cancel Button - only shows if stuck in processing */}
              {isProcessing && (
                <button
                  onClick={() => {
                    setIsProcessing(false);
                    if (paymentTimeoutRef.current) {
                      clearTimeout(paymentTimeoutRef.current);
                    }
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
