"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";

const CustomCalendar = ({ selectedDate, onSelectDate, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
  const today = new Date();
  today.setHours(0, 0, 0, 0);

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

  const daysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const generateCalendarDays = () => {
    const days = [];
    const totalDays = daysInMonth(currentMonth);
    const firstDay = firstDayOfMonth(currentMonth);
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= totalDays; i++) days.push(i);
    return days;
  };

  const handlePrevMonth = () => {
    const prevMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1
    );
    const minMonth = new Date(today.getFullYear(), today.getMonth());
    if (prevMonth >= minMonth) {
      setCurrentMonth(prevMonth);
    }
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const handleGoToToday = () => {
    const now = new Date();
    setCurrentMonth(now);
    onSelectDate(now);
    onClose();
  };

  const isPast = (day) => {
    if (!day) return false;
    const dateToCheck = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    return dateToCheck < today;
  };

  const handleDateSelect = (day) => {
    if (day && !isPast(day)) {
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
  const isPrevMonthDisabled =
    currentMonth.getMonth() === today.getMonth() &&
    currentMonth.getFullYear() === today.getFullYear();

  return (
    <div className="absolute top-full mt-2 left-0 right-0 bg-[#2C2C2E] rounded-xl shadow-2xl border border-white/10 p-4 z-50 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          disabled={isPrevMonthDisabled}
          className={`p-2 rounded-lg transition ${
            isPrevMonthDisabled
              ? "opacity-20 cursor-not-allowed"
              : "hover:bg-gray-700 text-white"
          }`}
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="text-white font-bold">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-700 rounded-lg transition text-white"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div
            key={day}
            className="text-center text-[10px] text-gray-500 font-black uppercase tracking-widest py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const past = isPast(day);
          return (
            <button
              key={index}
              onClick={() => handleDateSelect(day)}
              disabled={!day || past}
              className={`
                aspect-square rounded-lg text-sm transition-all flex items-center justify-center
                ${!day ? "invisible" : ""}
                ${
                  past
                    ? "text-gray-600 cursor-not-allowed opacity-30"
                    : "text-gray-200"
                }
                ${
                  isSelected(day)
                    ? "bg-orange-500 text-white font-bold shadow-lg shadow-orange-500/20"
                    : isToday(day)
                    ? "bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30"
                    : !past
                    ? "hover:bg-gray-700 hover:text-white"
                    : ""
                }
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Today Button Footer */}
      <div className="mt-4 pt-4 border-t border-white/5">
        <button
          onClick={handleGoToToday}
          className="w-full py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <CalendarIcon size={14} className="text-orange-500" />
          Go to Today
        </button>
      </div>
    </div>
  );
};

export default CustomCalendar;
