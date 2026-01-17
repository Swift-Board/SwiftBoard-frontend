import { useState, useEffect } from "react";
import { X, Loader2, LogIn, AlertCircle, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import AvailableParks from "../available_bookings/AvailableParks";


const TripSummaryModal = ({ isOpen, onClose, tripData, rides = [] }) => {
  const [isSearching, setIsSearching] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setIsSearching(true);
      setShowLoginPrompt(false);

      const userString = localStorage.getItem("user");

      const timer = setTimeout(() => {
        if (userString) {
          try {
            const user = JSON.parse(userString);
            if (user && user.id) {
              setIsSearching(false);
            } else {
              setIsSearching(false);
              setShowLoginPrompt(true);
            }
          } catch (error) {
            setIsSearching(false);
            setShowLoginPrompt(true);
          }
        } else {
          setIsSearching(false);
          setShowLoginPrompt(true);
        }
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleLoginRedirect = () => {
    localStorage.setItem("pendingTrip", JSON.stringify(tripData));
    router.push("/login");
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-[999999] flex items-center justify-center p-0 md:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`bg-[#121214] text-white w-full h-full md:h-auto md:max-w-5xl md:rounded-3xl relative border border-gray-800 shadow-2xl overflow-y-auto animate-scale-in ${
          !isSearching && !showLoginPrompt ? "max-h-[90vh]" : "max-w-lg"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className="sticky top-0 bg-[#121214]/80 backdrop-blur-md z-10 p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition md:hidden"
            >
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-xl font-bold">
              {isSearching
                ? "Finding Rides"
                : showLoginPrompt
                  ? "Authentication"
                  : "Available Rides"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="hidden md:block p-2 text-gray-400 hover:text-white transition hover:bg-white/5 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {isSearching ? (
            /* LOADING STATE */
            <div className="py-20 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Loader2 className="h-12 w-12 text-orange-500 animate-spin" />
                  <div className="absolute inset-0 rounded-full bg-orange-500/20 animate-ping"></div>
                </div>
                <div>
                  <p className="text-lg font-medium text-white">
                    Curating the best rides for you...
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Fetching real-time availability from parks
                  </p>
                </div>
              </div>
            </div>
          ) : showLoginPrompt ? (
            /* LOGIN PROMPT STATE */
            <div className="py-10 text-center">
              <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                  <AlertCircle className="h-8 w-8 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Login Required
                  </h3>
                  <p className="text-gray-400 max-w-xs mx-auto">
                    To ensure a secure booking experience, please sign in to
                    your account.
                  </p>
                </div>
                <button
                  onClick={handleLoginRedirect}
                  className="w-full max-w-sm bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <LogIn size={20} />
                  Login to Continue
                </button>
              </div>
            </div>
          ) : (
            /* RESULTS STATE */
            <div className="animate-fade-in">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-gray-400 text-sm">
                  Showing results for{" "}
                  <span className="text-white font-semibold">
                    {tripData.destination}
                  </span>
                </p>
                <span className="bg-orange-500/10 text-orange-500 text-xs font-bold px-3 py-1 rounded-full border border-orange-500/20 uppercase">
                  {tripData.selectedVehicle}
                </span>
              </div>

              <AvailableParks tripData={tripData} rides={rides} />
            </div>
          )}
        </div>
      </div>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        .animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
};

export default TripSummaryModal;
