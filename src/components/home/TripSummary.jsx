import { useState, useEffect } from "react";
import {
  X,
  MapPin,
  Calendar,
  Car,
  Loader2,
  LogIn,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

const TripSummaryModal = ({ isOpen, onClose, tripData }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setIsSearching(true);
      setShowLoginPrompt(false);

      // Simulate search delay
      const searchTimer = setTimeout(() => {
        setIsSearching(false);

        // Check if user exists in localStorage
        const userString = localStorage.getItem("user");
        if (userString) {
          try {
            const user = JSON.parse(userString);
            if (user && user.id) {
              // User found, redirect to dashboard
              setTimeout(() => {
                router.push("/dashboard");
              }, 500);
            } else {
              // Invalid user object
              setShowLoginPrompt(true);
            }
          } catch (error) {
            console.error("Error parsing user data:", error);
            setShowLoginPrompt(true);
          }
        } else {
          // No user found
          setShowLoginPrompt(true);
        }
      }, 2000);

      return () => clearTimeout(searchTimer);
    }
  }, [isOpen, router]);

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  if (!isOpen) return null;

  const { location, destination, selectedDate, selectedVehicle } = tripData;

  const formatDate = (date) => {
    if (!date) return null;
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999999] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#1C1C1E] p-8 rounded-2xl text-white max-w-lg w-full relative border border-gray-800 shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X size={24} />
        </button>

        {isSearching ? (
          <div className="rounded-xl p-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping"></div>
              </div>
              <div>
                <p className="text-blue-400 font-medium">
                  Searching for available rides...
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Please wait while we find the best options
                </p>
              </div>
            </div>
          </div>
        ) : showLoginPrompt ? (
          <div className="rounded-xl p-6 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-yellow-400 font-medium mb-1">
                  Login Required
                </p>
                <p className="text-sm text-gray-400">
                  Please login to continue booking your ride
                </p>
              </div>
              <button
                onClick={handleLoginRedirect}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <LogIn size={18} />
                Login to Continue
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 text-center">
            <p className="text-orange-400 font-medium">
              No rides available currently
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Please try a different date or destination
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scaleIn 0.2s ease-out;
        }
        .animate-ping {
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default TripSummaryModal;
