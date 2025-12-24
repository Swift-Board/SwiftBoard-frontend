"use client";

import { useState, useRef, useEffect } from "react";
import {
  Calendar,
  Car,
  Bus,
  MapPin,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Navigation,
} from "lucide-react";

const CustomCalendar = ({ selectedDate, onSelectDate, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = () => {
    const days = [];
    const totalDays = daysInMonth(currentMonth);
    const firstDay = firstDayOfMonth(currentMonth);

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= totalDays; i++) {
      days.push(i);
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const handleDateSelect = (day) => {
    if (day) {
      const newDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      onSelectDate(newDate);
      onClose();
    }
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day) => {
    if (!selectedDate || !day) return false;
    return (
      day === selectedDate.getDate() &&
      currentMonth.getMonth() === selectedDate.getMonth() &&
      currentMonth.getFullYear() === selectedDate.getFullYear()
    );
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="absolute top-full mt-2 left-0 right-0 bg-[#2C2C2E] rounded-lg shadow-xl border border-gray-700 p-4 z-50 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-700 rounded-lg transition"
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="text-white font-semibold">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-700 rounded-lg transition"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div
            key={day}
            className="text-center text-xs text-gray-400 font-medium py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <button
            key={index}
            onClick={() => handleDateSelect(day)}
            disabled={!day}
            className={`
              aspect-square rounded-lg text-sm transition-all
              ${!day ? "invisible" : ""}
              ${
                isSelected(day)
                  ? "bg-orange-500 text-white font-semibold"
                  : isToday(day)
                  ? "bg-blue-500/20 text-blue-400 font-semibold"
                  : "hover:bg-gray-700 text-gray-200"
              }
            `}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CustomCalendar;
