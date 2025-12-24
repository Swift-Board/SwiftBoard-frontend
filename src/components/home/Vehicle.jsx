const VehicleSelector = ({ selectedVehicle, onSelectVehicle, options }) => {
  return (
    <div>
      <label className="text-sm text-gray-400 mb-3 block font-medium">
        Select Vehicle Type
      </label>
      <div className="grid grid-cols-3 gap-4">
        {options.map(({ label, value, icon: Icon, color, activeColor }) => {
          const isSelected = selectedVehicle === value;

          return (
            <button
              key={value}
              onClick={() => onSelectVehicle(value)}
              className={`
                flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all
                ${isSelected ? activeColor : `${color} hover:scale-105`}
              `}
            >
              <Icon size={28} className="mb-2" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VehicleSelector;
