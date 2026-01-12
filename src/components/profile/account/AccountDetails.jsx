"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  MapPin,
  AlertCircle,
  Map,
  LogOut,
  Trash2,
  Edit2,
  ChevronRight,
  Save,
  Lock,
  X,
  User,
  Mail,
  KeyRound,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/components/Notification";

const AccountDetails = () => {
  const router = useRouter();
  const { showNotification } = useNotification();

  const [user, setUser] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [alerts, setAlerts] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setFirstName(userData.firstName || "");
        setLastName(userData.lastName || "");
        setEmail(userData.email || "");
      } catch (error) {
        console.error("Error parsing user data:", error);
        showNotification({
          type: "error",
          message: "Failed to load user data",
          duration: 5000,
        });
      }
    } else {
      router.push("/login");
    }
  }, []);

  const getInitials = () => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  const handleSaveName = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      showNotification({
        type: "error",
        message: "First name and last name are required",
        duration: 5000,
      });
      return;
    }

    try {
      const updatedUser = { ...user, firstName, lastName };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditingName(false);

      showNotification({
        type: "success",
        message: "Name updated successfully",
        duration: 5000,
      });
    } catch (error) {
      showNotification({
        type: "error",
        message: "Failed to update name",
        duration: 5000,
      });
    }
  };

  const handleEmailEdit = () => {
    if (!isEditingEmail) {
      setShowPasswordPrompt(true);
    } else {
      setIsEditingEmail(false);
      setEmail(user.email);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!currentPassword.trim()) {
      showNotification({
        type: "error",
        message: "Please enter your password",
        duration: 5000,
      });
      return;
    }

    try {
      setShowPasswordPrompt(false);
      setIsEditingEmail(true);
      setCurrentPassword("");

      showNotification({
        type: "success",
        message: "Password verified",
        duration: 5000,
      });
    } catch (error) {
      showNotification({
        type: "error",
        message: "Invalid password",
        duration: 5000,
      });
    }
  };

  const handleSaveEmail = async () => {
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      showNotification({
        type: "error",
        message: "Please enter a valid email",
        duration: 5000,
      });
      return;
    }

    try {
      const updatedUser = { ...user, email };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditingEmail(false);

      showNotification({
        type: "success",
        message: "Email updated successfully",
        duration: 5000,
      });
    } catch (error) {
      showNotification({
        type: "error",
        message: "Failed to update email",
        duration: 5000,
      });
    }
  };

  const handleSavePassword = async () => {
    if (newPassword.length < 8) {
      showNotification({
        type: "error",
        message: "Password must be at least 8 characters",
        duration: 5000,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      showNotification({
        type: "error",
        message: "Passwords do not match",
        duration: 5000,
      });
      return;
    }

    try {
      setIsEditingPassword(false);
      setNewPassword("");
      setConfirmPassword("");

      showNotification({
        type: "success",
        message: "Password updated successfully",
        duration: 5000,
      });
    } catch (error) {
      showNotification({
        type: "error",
        message: "Failed to update password",
        duration: 5000,
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    showNotification({
      type: "success",
      message: "Logged out successfully",
      duration: 3000,
    });
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  const handleDeleteAccount = async () => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setShowDeleteConfirm(false);

      showNotification({
        type: "success",
        message: "Account deleted successfully",
        duration: 3000,
      });

      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (error) {
      showNotification({
        type: "error",
        message: "Failed to delete account",
        duration: 5000,
      });
    }
  };

  const menuItems = [
    {
      icon: Bell,
      label: "Notifications",
      hasToggle: true,
      active: notifications,
      setState: setNotifications,
    },
    {
      icon: MapPin,
      label: "Travels",
      link: "/profile/travels",
      hasArrow: true,
    },
    {
      icon: AlertCircle,
      label: "Alerts",
      hasToggle: true,
      active: alerts,
      setState: setAlerts,
    },
    { icon: Map, label: "Maps", hasArrow: true },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 mt-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft size={30} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              Account Settings
            </h1>
            <p className="text-gray-400 mt-2 text-sm sm:text-base">
              Manage your profile and preferences
            </p>
          </span>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column - Profile Info */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10 shadow-2xl">
              {/* Profile Picture */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="relative group flex-shrink-0">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-2xl object-cover border-4 border-cyan-400/20"
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-bold border-4 border-cyan-400/20">
                      {getInitials()}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <Edit2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
                <div className="text-center sm:text-left flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold truncate">
                    {firstName} {lastName}
                  </h2>
                  <p className="text-gray-400 text-sm sm:text-base truncate">
                    {email}
                  </p>
                </div>
              </div>

              {/* Fullname */}
              <div className="space-y-3 sm:space-y-4 mb-6">
                <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-cyan-400">
                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
                  Full Name
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {isEditingName ? (
                    <div className="flex-1 flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
                        className="flex-1 bg-white/5 border border-white/20 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name"
                        className="flex-1 bg-white/5 border border-white/20 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>
                  ) : (
                    <div className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 sm:px-4 py-2 sm:py-3 min-w-0">
                      <span className="text-white text-sm sm:text-base truncate block">
                        {firstName} {lastName}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={
                      isEditingName
                        ? handleSaveName
                        : () => setIsEditingName(true)
                    }
                    className="flex items-center justify-center gap-2 px-4 py-2 sm:py-3 bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/30 text-cyan-400 rounded-lg transition-all whitespace-nowrap"
                  >
                    {isEditingName ? (
                      <>
                        <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm font-medium">
                          Save
                        </span>
                      </>
                    ) : (
                      <>
                        <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm font-medium">
                          Edit
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-3 sm:space-y-4 mb-6">
                <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-cyan-400">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                  Email Address
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {isEditingEmail ? (
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/20 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  ) : (
                    <div className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 sm:px-4 py-2 sm:py-3 min-w-0">
                      <span className="text-white text-sm sm:text-base truncate block">
                        {email}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={isEditingEmail ? handleSaveEmail : handleEmailEdit}
                    className="flex items-center justify-center gap-2 px-4 py-2 sm:py-3 bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/30 text-cyan-400 rounded-lg transition-all whitespace-nowrap"
                  >
                    {isEditingEmail ? (
                      <>
                        <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm font-medium">
                          Save
                        </span>
                      </>
                    ) : (
                      <>
                        <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm font-medium">
                          Edit
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-3 sm:space-y-4">
                <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-cyan-400">
                  <KeyRound className="w-3 h-3 sm:w-4 sm:h-4" />
                  Password
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {isEditingPassword ? (
                    <div className="flex-1 space-y-3">
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New password"
                        className="w-full bg-white/5 border border-white/20 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        className="w-full bg-white/5 border border-white/20 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>
                  ) : (
                    <div className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 sm:px-4 py-2 sm:py-3">
                      <span className="text-white text-sm sm:text-base">
                        ••••••••••••
                      </span>
                    </div>
                  )}
                  <button
                    onClick={
                      isEditingPassword
                        ? handleSavePassword
                        : () => setIsEditingPassword(true)
                    }
                    className="flex items-center justify-center gap-2 px-4 py-2 sm:py-3 bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/30 text-cyan-400 rounded-lg transition-all whitespace-nowrap"
                  >
                    {isEditingPassword ? (
                      <>
                        <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm font-medium">
                          Save
                        </span>
                      </>
                    ) : (
                      <>
                        <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm font-medium">
                          Edit
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Settings & Actions */}
          <div className="space-y-6">
            {/* Settings Card */}
            <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl">
              <h3 className="text-lg sm:text-xl font-bold mb-4">Preferences</h3>
              <div className="space-y-2">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center justify-between p-3 sm:p-4 rounded-xl hover:bg-white/5 transition-all group"
                    onClick={() => {
                      if (item.hasToggle && item.setState) {
                        item.setState(!item.active);
                      }
                      if (item.link) {
                        router.push(item.link);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-cyan-400/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                      </div>
                      <span className="font-medium text-sm sm:text-base truncate">
                        {item.label}
                      </span>
                    </div>
                    {item.hasToggle && (
                      <div
                        className={`w-11 h-6 sm:w-12 sm:h-6 rounded-full transition-colors flex-shrink-0 ${
                          item.active ? "bg-cyan-400" : "bg-white/20"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full transition-transform transform ${
                            item.active
                              ? "translate-x-5 sm:translate-x-6"
                              : "translate-x-1"
                          } mt-1 sm:mt-0.5`}
                        ></div>
                      </div>
                    )}
                    {item.hasArrow && (
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white/40 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-orange-500/20 to-orange-600/20 hover:from-orange-500/30 hover:to-orange-600/30 border border-orange-500/30 rounded-xl transition-all group"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-sm sm:text-base text-orange-400">
                  Logout
                </span>
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center justify-center gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-red-600/20 to-red-700/20 hover:from-red-600/30 hover:to-red-700/30 border border-red-600/30 rounded-xl transition-all group"
              >
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-sm sm:text-base text-red-500">
                  Delete Account
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 sm:p-8 max-w-md w-full border border-red-500/30 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold">Delete Account</h3>
            </div>
            <p className="text-white/60 mb-6 text-sm sm:text-base">
              Are you sure you want to delete your account? This action cannot
              be undone and all your data will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-red-500 hover:bg-red-600 rounded-lg transition-colors font-medium text-sm sm:text-base"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Prompt Modal for Email Change */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 sm:p-8 max-w-md w-full border border-cyan-500/30 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
                  <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold">
                  Verify Password
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowPasswordPrompt(false);
                  setCurrentPassword("");
                }}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            <p className="text-white/60 mb-6 text-sm sm:text-base">
              Please enter your current password to change your email address.
            </p>
            <div className="space-y-4">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handlePasswordSubmit();
                  }
                }}
                placeholder="Enter your password"
                className="w-full bg-white/5 border border-white/20 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:border-cyan-400 transition-colors"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowPasswordPrompt(false);
                    setCurrentPassword("");
                  }}
                  className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors font-medium text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordSubmit}
                  disabled={!currentPassword.trim()}
                  className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-cyan-400 hover:bg-cyan-500 disabled:bg-cyan-400/30 disabled:cursor-not-allowed rounded-lg transition-colors font-medium text-black text-sm sm:text-base"
                >
                  Verify
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountDetails;
