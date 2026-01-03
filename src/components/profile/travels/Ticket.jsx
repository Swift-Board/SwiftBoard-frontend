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
  const downloadTicket = (ride) => {
    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 1200;
    const ctx = canvas.getContext("2d");

    // Dark background
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 900, 1200);

    // Subtle grid pattern
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1;
    for (let i = 0; i < 900; i += 30) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 1200);
      ctx.stroke();
    }
    for (let i = 0; i < 1200; i += 30) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(900, i);
      ctx.stroke();
    }

    // Main ticket card
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(50, 100, 800, 1000);

    // Top accent bar with gradient
    const headerGradient = ctx.createLinearGradient(50, 100, 850, 100);
    headerGradient.addColorStop(0, "#3b82f6");
    headerGradient.addColorStop(1, "#8b5cf6");
    ctx.fillStyle = headerGradient;
    ctx.fillRect(50, 100, 800, 8);

    // Header section
    ctx.fillStyle = "#334155";
    ctx.fillRect(50, 108, 800, 140);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.fillText("TRAVEL TICKET", 450, 170);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "18px Arial";
    ctx.fillText(`REF: ${ride.bookingRef}`, 450, 210);

    // Route section
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(80, 280, 740, 160);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 42px Arial";
    ctx.textAlign = "center";
    ctx.fillText(ride.terminal, 280, 350);

    ctx.fillStyle = "#3b82f6";
    ctx.font = "36px Arial";
    ctx.fillText("→", 450, 350);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 42px Arial";
    ctx.fillText(ride.destination, 620, 350);

    ctx.fillStyle = "#64748b";
    ctx.font = "16px Arial";
    ctx.fillText(ride.date, 450, 400);

    // Details grid
    const details = [
      { label: "DEPARTURE", value: ride.departure, x: 120, y: 520 },
      { label: "ARRIVAL", value: ride.time, x: 480, y: 520 },
      { label: "SEAT", value: ride.seat.toString(), x: 120, y: 640 },
      { label: "VEHICLE", value: ride.carType.toUpperCase(), x: 480, y: 640 },
    ];

    details.forEach((detail) => {
      ctx.fillStyle = "#334155";
      ctx.fillRect(detail.x - 20, detail.y - 60, 300, 100);

      ctx.fillStyle = "#64748b";
      ctx.font = "14px Arial";
      ctx.textAlign = "left";
      ctx.fillText(detail.label, detail.x, detail.y - 20);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 28px Arial";
      ctx.fillText(detail.value, detail.x, detail.y + 20);
    });

    // Price section
    ctx.fillStyle = "#ffffff";
    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    ctx.fillText("TOTAL FARE", 120, 765);

    ctx.font = "bold 42px Arial";
    ctx.textAlign = "right";
    ctx.fillText(`₦${ride.price}`, 780, 775);

    // Status badge
    let statusColor =
      ride.status === "completed"
        ? "#10b981"
        : ride.status === "ongoing"
        ? "#3b82f6"
        : "#f59e0b";

    ctx.fillStyle = statusColor;
    ctx.fillRect(80, 860, 200, 50);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "left";
    ctx.fillText(ride.status.toUpperCase(), 130, 893);

    canvas.toBlob(
      (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ticket-${ride.bookingRef}.jpg`;
        a.click();
        URL.revokeObjectURL(url);
      },
      "image/jpeg",
      0.95
    );
  };

  return (
    <>
      {selectedRide && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedRide(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 no_scrollbar rounded-2xl border border-slate-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <h2 className="text-2xl font-bold text-white">
                  YOUR TRAVEL TICKET
                </h2>
                <button
                  onClick={() => setSelectedRide(null)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X size={24} className="text-slate-400" />
                </button>
              </div>

              {/* Ticket Content */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-slate-700 overflow-hidden"
              >
                {/* Ticket Card */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 overflow-hidden">
                  {/* Top Accent */}
                  <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600"></div>

                  {/* Header */}
                  <div className="bg-slate-800/50 p-6 border-b border-slate-700">
                    <div className="text-center">
                      <h3 className="text-3xl font-bold text-white mb-2">
                        TRAVEL TICKET
                      </h3>
                      <p className="text-slate-400 text-sm">
                        REF: {selectedRide.bookingRef}
                      </p>
                    </div>
                  </div>

                  {/* Route */}
                  <div className="p-6 bg-slate-900/50">
                    <div className="flex items-center justify-center gap-6 mb-4">
                      <div className="text-center">
                        <p className="text-slate-400 text-sm mb-1">From</p>
                        <p className="text-3xl font-bold text-white">
                          {selectedRide.terminal}
                        </p>
                      </div>
                      <div className="text-blue-400 text-3xl">→</div>
                      <div className="text-center">
                        <p className="text-slate-400 text-sm mb-1">To</p>
                        <p className="text-3xl font-bold text-white">
                          {selectedRide.destination}
                        </p>
                      </div>
                    </div>
                    <p className="text-center text-slate-400">
                      {selectedRide.date}
                    </p>
                  </div>

                  {/* Details Grid */}
                  <div className="lg:grid grid-cols-2 flex flex-col gap-4 p-6">
                    <div className="bg-slate-800 p-4 flex items-center justify-between flex-wrap rounded-lg">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                          <Clock size={20} className="text-blue-400" />
                        </div>
                        <p className="text-xs text-slate-400">DEPARTURE</p>
                      </div>
                      <p className="text-xl font-bold text-white">
                        {selectedRide.departure}
                      </p>
                    </div>

                    <div className="bg-slate-800 p-4 flex items-center justify-between flex-wrap rounded-lg">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                          <MapPin size={20} className="text-purple-400" />
                        </div>
                        <p className="text-xs text-slate-400">ARRIVAL</p>
                      </div>
                      <p className="text-xl font-bold text-white">
                        {selectedRide.time}
                      </p>
                    </div>

                    <div className="bg-slate-800 p-4 flex items-center justify-between flex-wrap rounded-lg">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                          <User size={20} className="text-cyan-400" />
                        </div>
                        <p className="text-xs text-slate-400">SEAT</p>
                      </div>
                      <p className="text-xl font-bold text-white">
                        {selectedRide.seat}
                      </p>
                    </div>

                    <div className="bg-slate-800 p-4 flex items-center justify-between flex-wrap rounded-lg">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                          <Bus size={20} className="text-emerald-400" />
                        </div>
                        <p className="text-xs text-slate-400">VEHICLE</p>
                      </div>
                      <p className="text-xl font-bold text-white uppercase">
                        {selectedRide.carType}
                      </p>
                    </div>
                  </div>

                  {/* Price Section */}
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-lg">TOTAL FARE</span>
                      <span className="text-3xl font-bold text-white">
                        ₦{selectedRide.price}
                      </span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="p-6 flex items-center justify-center">
                    <span
                      className={`px-4 py-2 rounded-lg text-sm font-semibold ${getStatusColor(
                        selectedRide.status
                      )}`}
                    >
                      {selectedRide.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                {/* Download Button */}
                <button
                  onClick={() => downloadTicket(selectedRide)}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-full flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
                >
                  <Download size={20} />
                  Download Ticket as Image
                </button>
                <button className="w-full mt-6">
                  {selectedRide.status === "ongoing" && (
                    <div
                      className="flex items-center gap-2 justify-center border border-slate-200/20 hover:bg-slate-200/20 cursor-pointer ease-in-out duration-300 py-4 rounded-full"
                      title="Track Live"
                    >
                      <Navigation
                        size={20}
                        className="text-blue-400 fill-blue-400"
                      />
                      Track Live
                    </div>
                  )}
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
};

export default Ticket;
