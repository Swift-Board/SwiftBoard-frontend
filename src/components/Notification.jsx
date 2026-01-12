// components/Notification.jsx
"use client";

import React, { useState, useEffect, createContext, useContext } from "react";

const NotificationContext = createContext(null);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};

const NotificationItem = ({ id, type, message, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const config = {
    success: {
      bgColor: "bg-green-50",
      borderColor: "border-green-500",
      iconColor: "text-green-500",
      textColor: "text-green-800",
      icon: "✓",
    },
    error: {
      bgColor: "bg-red-50",
      borderColor: "border-red-500",
      iconColor: "text-red-500",
      textColor: "text-red-800",
      icon: "✕",
    },
    warning: {
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-500",
      iconColor: "text-yellow-500",
      textColor: "text-yellow-800",
      icon: "⚠",
    },
    info: {
      bgColor: "bg-blue-50",
      borderColor: "border-blue-500",
      iconColor: "text-blue-500",
      textColor: "text-blue-800",
      icon: "ℹ",
    },
  };

  const { bgColor, borderColor, iconColor, textColor, icon } =
    config[type] || config.info;

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(id), 300);
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border-l-4 shadow-lg transition-all duration-300 ${bgColor} ${borderColor} ${
        isExiting ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"
      }`}
      style={{ minWidth: "320px", maxWidth: "420px" }}
    >
      <span className={`${iconColor} flex-shrink-0 text-xl font-bold`}>
        {icon}
      </span>
      <p className={`flex-1 text-sm font-medium ${textColor}`}>{message}</p>
      <button
        onClick={handleClose}
        className={`${textColor} hover:opacity-70 transition-opacity flex-shrink-0 text-xl leading-none`}
      >
        ×
      </button>
    </div>
  );
};

const NotificationContainer = ({ notifications, onRemove }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[99999999] flex flex-col gap-3 pointer-events-none">
      <div className="flex flex-col gap-3 pointer-events-auto">
        {notifications.map((notif) => (
          <NotificationItem key={notif.id} {...notif} onClose={onRemove} />
        ))}
      </div>
    </div>
  );
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = ({ type = "info", message, duration = 5000 }) => {
    const id = Date.now() + Math.random();
    console.log("Showing notification:", { type, message, id }); // Debug log
    setNotifications((prev) => [...prev, { id, type, message, duration }]);
  };

  const removeNotification = (id) => {
    console.log("Removing notification:", id); // Debug log
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{ showNotification, removeNotification }}
    >
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
      {children}
    </NotificationContext.Provider>
  );
};
