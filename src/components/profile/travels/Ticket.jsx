import { AnimatePresence, motion } from "framer-motion";
import {
  Bus,
  Clock,
  Download,
  MapPin,
  Navigation,
  User,
  X,
} from "lucide-react";
import React from "react";

const Ticket = ({ selectedRide, getStatusColor, setSelectedRide }) => {
  if (!selectedRide) return null;

  // Helper to extract data safely since selectedRide is now a 'Booking' object
  const bookingData = {
    ref: selectedRide.bookingRef,
    origin: selectedRide.ride?.origin || "N/A",
    destination: selectedRide.ride?.destination || "N/A",
    park: selectedRide.ride?.park || "Unknown Park",
    date: new Date(selectedRide.ride?.departureTime).toLocaleDateString(),
    time: new Date(selectedRide.ride?.departureTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    seats: selectedRide.seatNumbers?.join(", ") || "N/A",
    vehicle: selectedRide.ride?.vehicleType || "Bus",
    price: selectedRide.amountPaid?.toLocaleString(),
    status: selectedRide.status,
  };

  const downloadTicket = (data) => {
    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 1200;
    const ctx = canvas.getContext("2d");

    // Background & Design
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 900, 1200);

    // Main Card
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(50, 100, 800, 1000);

    // Header Gradient
    const headerGradient = ctx.createLinearGradient(50, 100, 850, 100);
    headerGradient.addColorStop(0, "#3b82f6");
    headerGradient.addColorStop(1, "#8b5cf6");
    ctx.fillStyle = headerGradient;
    ctx.fillRect(50, 100, 800, 8);

    // Text Header
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.fillText("TRAVEL TICKET", 450, 200);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "24px Arial";
    ctx.fillText(`REF: ${data.ref}`, 450, 250);

    // Route Box
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(80, 300, 740, 180);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 38px Arial";
    ctx.fillText(data.origin, 250, 380);
    ctx.fillStyle = "#3b82f6";
    ctx.fillText("→", 450, 380);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(data.destination, 650, 380);

    ctx.font = "20px Arial";
    ctx.fillStyle = "#64748b";
    ctx.fillText(`${data.date} | ${data.park}`, 450, 440);

    // Details Grid Layout
    const details = [
      { label: "DEPARTURE", value: data.time, x: 120, y: 580 },
      { label: "VEHICLE", value: data.vehicle.toUpperCase(), x: 480, y: 580 },
      { label: "SEATS", value: data.seats, x: 120, y: 700 },
      { label: "STATUS", value: data.status.toUpperCase(), x: 480, y: 700 },
    ];

    details.forEach((d) => {
      ctx.fillStyle = "#64748b";
      ctx.font = "16px Arial";
      ctx.textAlign = "left";
      ctx.fillText(d.label, d.x, d.y);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 32px Arial";
      ctx.fillText(d.value, d.x, d.y + 45);
    });

    // Price
    ctx.fillStyle = "#ffffff";
    ctx.font = "24px Arial";
    ctx.fillText("TOTAL FARE PAID", 120, 850);
    ctx.font = "bold 50px Arial";
    ctx.textAlign = "right";
    ctx.fillText(`₦${data.price}`, 780, 860);

    canvas.toBlob(
      (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Ticket-${data.ref}.jpg`;
        a.click();
      },
      "image/jpeg",
      0.95,
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSelectedRide(null)}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-slate-900 rounded-2xl border border-slate-800 max-w-xl w-full shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-800">
            <h2 className="text-xl font-bold text-white uppercase tracking-tight">
              Trip Details
            </h2>
            <button
              onClick={() => setSelectedRide(null)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Visual Ticket Design */}
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden relative">
              <div className="h-1.5 bg-gradient-to-r from-blue-500 to-purple-600" />

              <div className="p-6 text-center border-b border-slate-700/50">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">
                  Booking Reference
                </p>
                <h3 className="text-2xl font-mono font-bold text-orange-500">
                  {bookingData.ref}
                </h3>
              </div>

              {/* Origin to Destination */}
              <div className="p-8 flex items-center justify-between relative">
                <div className="text-left">
                  <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">
                    From
                  </p>
                  <h4 className="text-2xl font-black text-white">
                    {bookingData.origin}
                  </h4>
                </div>
                <div className="flex-1 flex flex-col items-center px-4">
                  <div className="w-full h-[1px] bg-slate-700 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-800 px-2 text-blue-400">
                      <Bus size={16} />
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">
                    To
                  </p>
                  <h4 className="text-2xl font-black text-white">
                    {bookingData.destination}
                  </h4>
                </div>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-2 gap-px bg-slate-700/50 border-y border-slate-700/50">
                <div className="p-4 bg-slate-800/30">
                  <p className="text-[10px] text-slate-500 font-bold mb-1">
                    DATE & TIME
                  </p>
                  <p className="text-sm font-bold text-slate-200">
                    {bookingData.date} | {bookingData.time}
                  </p>
                </div>
                <div className="p-4 bg-slate-800/30 border-l border-slate-700/50">
                  <p className="text-[10px] text-slate-500 font-bold mb-1">
                    SEATS
                  </p>
                  <p className="text-sm font-bold text-slate-200">
                    {bookingData.seats}
                  </p>
                </div>
                <div className="p-4 bg-slate-800/30">
                  <p className="text-[10px] text-slate-500 font-bold mb-1">
                    VEHICLE
                  </p>
                  <p className="text-sm font-bold text-slate-200 uppercase">
                    {bookingData.vehicle}
                  </p>
                </div>
                <div className="p-4 bg-slate-800/30 border-l border-slate-700/50">
                  <p className="text-[10px] text-slate-500 font-bold mb-1">
                    STATUS
                  </p>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border ${getStatusColor(bookingData.status)}`}
                  >
                    {bookingData.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="p-6 flex items-center justify-between bg-white/[0.02]">
                <span className="text-slate-400 text-sm">Amount Paid</span>
                <span className="text-2xl font-black text-white">
                  ₦{bookingData.price}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => downloadTicket(bookingData)}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <Download size={18} />
                Download E-Ticket
              </button>

              {bookingData.status === "ongoing" && (
                <button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 border border-slate-700 transition-all">
                  <Navigation
                    size={18}
                    className="text-blue-400 fill-blue-400"
                  />
                  Track Live Location
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Ticket;
