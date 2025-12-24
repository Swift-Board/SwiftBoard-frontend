import { Calendar } from "lucide-react";
import CustomCalendar from "./Calendar";

const DateSelector = ({
  selectedDate,
  onSelectDate,
  showCalendar,
  setShowCalendar,
}) => {
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
    <div className="relative">
      <label className="text-sm text-gray-400 mb-2 block font-medium">
        Travel Date
      </label>
      <button
        onClick={() => setShowCalendar(!showCalendar)}
        className="w-full bg-[#2C2C2E] border border-gray-700 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-orange-500 transition group"
      >
        <span className={selectedDate ? "text-white" : "text-gray-500"}>
          {selectedDate ? formatDate(selectedDate) : "Select travel date"}
        </span>
        <Calendar
          size={20}
          className={`${
            showCalendar
              ? "text-orange-500"
              : "text-gray-400 group-hover:text-orange-500"
          } transition`}
        />
      </button>

      {showCalendar && (
        <CustomCalendar
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
          onClose={() => setShowCalendar(false)}
        />
      )}
    </div>
  );
};

export default DateSelector;
