"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { useRouter } from "next/navigation";

const AccountDetails = () => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [fullName, setFullName] = useState("Daniel Ovedje");
  const [email, setEmail] = useState("blagtheproducer@gmail.com");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordForEmail, setPasswordForEmail] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [alerts, setAlerts] = useState(true);
  const router = useRouter();

  const handleEmailEdit = () => {
    if (!isEditingEmail) {
      setShowPasswordPrompt(true);
    } else {
      setIsEditingEmail(false);
      setPasswordForEmail("");
    }
  };

  const handlePasswordSubmit = () => {
    if (passwordForEmail.trim()) {
      setShowPasswordPrompt(false);
      setIsEditingEmail(true);
      setPasswordForEmail("");
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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Main Content */}
      <div className="mt-6">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Profile Info */}
          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-32 h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center text-5xl font-bold border-4 border-white/10">
                  D
                </div>
              </div>
            </div>

            {/* Fullname */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="px-4 py-2 bg-cyan-400 text-black rounded-lg font-bold text-sm">
                    Fullname
                  </div>
                  {isEditingName ? (
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-400 transition-colors"
                      autoFocus
                    />
                  ) : (
                    <span className="text-white/80">{fullName}</span>
                  )}
                </div>
                <button
                  onClick={() => setIsEditingName(!isEditingName)}
                  className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  {isEditingName ? (
                    <>
                      <Save className="w-4 h-4" />
                      <span className="text-sm">save</span>
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4" />
                      <span className="text-sm">change</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="px-4 py-2 bg-cyan-400 text-black rounded-lg font-bold text-sm">
                    Email
                  </div>
                  {isEditingEmail ? (
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-400 transition-colors"
                      autoFocus
                    />
                  ) : (
                    <span className="text-white/80">{email}</span>
                  )}
                </div>
                <button
                  onClick={handleEmailEdit}
                  className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  {isEditingEmail ? (
                    <>
                      <Save className="w-4 h-4" />
                      <span className="text-sm">save</span>
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4" />
                      <span className="text-sm">change</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="px-4 py-2 bg-cyan-400 text-black rounded-lg font-bold text-sm">
                    Password
                  </div>
                  {isEditingPassword ? (
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="flex-1 bg-white/5 border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-400 transition-colors"
                      autoFocus
                    />
                  ) : (
                    <span className="text-white/80">••••••••••••••••••</span>
                  )}
                </div>
                <button
                  onClick={() => setIsEditingPassword(!isEditingPassword)}
                  className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  {isEditingPassword ? (
                    <>
                      <Save className="w-4 h-4" />
                      <span className="text-sm">save</span>
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4" />
                      <span className="text-sm">change</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Settings & Actions */}
          <div className="space-y-6">
            {/* Settings Card */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-white/10 shadow-2xl">
              <div className="space-y-3">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-all group"
                    onClick={() => {
                      if (item.hasToggle && item.setState) {
                        item.setState(!item.active);
                      }
                      if (item.link) {
                        router.replace(item.link);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-cyan-400" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.hasToggle && (
                      <div
                        className={`w-12 h-6 rounded-full transition-colors ${
                          item.active ? "bg-cyan-400" : "bg-white/20"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full transition-transform transform ${
                            item.active ? "translate-x-6" : "translate-x-1"
                          } mt-0.5`}
                        ></div>
                      </div>
                    )}
                    {item.hasArrow && (
                      <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 border border-red-500/30 rounded-xl transition-all group">
                <LogOut className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-red-400">Logout</span>
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-600/20 to-red-700/20 hover:from-red-600/30 hover:to-red-700/30 border border-red-600/30 rounded-xl transition-all group"
              >
                <Trash2 className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-red-500">Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-md w-full border border-red-500/30 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold">Delete Account</h3>
            </div>
            <p className="text-white/60 mb-6">
              Are you sure you want to delete your account? This action cannot
              be undone and all your data will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle delete
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg transition-colors font-medium"
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
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-md w-full border border-orange-500/30 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <Lock className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-xl font-bold">Verify Password</h3>
              </div>
              <button
                onClick={() => {
                  setShowPasswordPrompt(false);
                  setPasswordForEmail("");
                }}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-white/60 mb-6">
              Please enter your current password to change your email address.
            </p>
            <div className="space-y-4">
              <input
                type="password"
                value={passwordForEmail}
                onChange={(e) => setPasswordForEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handlePasswordSubmit();
                  }
                }}
                placeholder="Enter your password"
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowPasswordPrompt(false);
                    setPasswordForEmail("");
                  }}
                  className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordSubmit}
                  disabled={!passwordForEmail.trim()}
                  className="flex-1 px-6 py-3 bg-orange-400 hover:bg-orange-500 disabled:bg-orange-400/30 disabled:cursor-not-allowed rounded-lg transition-colors font-medium text-black"
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
