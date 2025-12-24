import { MapPin, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const CustomDestinationSelect = ({
  value,
  onChange,
  location,
  destinations,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || "");
  const [filteredDestinations, setFilteredDestinations] =
    useState(destinations);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (searchTerm) {
      const filtered = destinations.filter((dest) =>
        dest.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDestinations(filtered);
    } else {
      setFilteredDestinations(destinations);
    }
  }, [searchTerm, destinations]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (destination) => {
    setSearchTerm(destination);
    onChange(destination);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSearchTerm("");
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            onChange(e.target.value);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Enter or select destination"
          className="w-full bg-[#2C2C2E] border border-gray-700 rounded-lg px-4 py-3 pr-20 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {searchTerm && (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-white transition"
            >
              <X size={18} />
            </button>
          )}
          <Search size={18} className="text-gray-400" />
        </div>
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-2 left-0 right-0 bg-[#2C2C2E] rounded-lg shadow-xl border border-gray-700 max-h-60 overflow-y-auto z-50 animate-fade-in"
        >
          {filteredDestinations.length > 0 ? (
            <>
              <div className="px-3 py-2 text-xs text-gray-400 font-medium border-b border-gray-700">
                Popular Destinations
              </div>
              {filteredDestinations.map((destination) => (
                <button
                  key={destination}
                  onClick={() => handleSelect(destination)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-700 transition flex items-center gap-3 text-gray-200"
                >
                  <MapPin size={16} className="text-gray-400" />
                  <span>
                    {location} → {destination}
                  </span>
                </button>
              ))}
            </>
          ) : (
            <div className="px-4 py-8 text-center text-gray-400">
              <p className="mb-2">No destinations found</p>
              <p className="text-sm">
                Press Enter to use "{searchTerm}" as destination
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomDestinationSelect;
