import { MapPin, Navigation } from "lucide-react";

const LocationHeader = ({ location, onChangeLocation }) => {
  return (
    <div className="mb-2 pb-1 border-b border-gray-800">
      <div className="grid lg:grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-400 mb-2 block">
            Traveling From
          </label>
          <div className="flex items-center gap-2 text-white text-lg font-medium">
            <MapPin size={20} className="text-orange-500" />
            {location}
          </div>
        </div>
        <button
          onClick={onChangeLocation}
          className="text-orange-400 place-self-end text-sm hover:text-orange-300 transition flex items-center gap-1"
        >
          <Navigation size={14} />
          Change location
        </button>
      </div>
    </div>
  );
};

export default LocationHeader;
