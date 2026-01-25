"use client";

import {
  CaretDownIcon,
  MapPin,
  User,
  SignOut,
  List,
  X,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "@/app/contexts/LocationContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

const Navbar = () => {
  const { city, isLoading, updateLocation } = useLocation();
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false); // Mobile Menu
  const [profileOpen, setProfileOpen] = useState(false); // Profile Dropdown
  const profileRef = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMenuOpen(false);
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  return (
    <nav className="px-6 py-4 flex bg-black transition-colors ease-in duration-300 border-b border-slate-800 items-center justify-between fixed top-0 w-full z-[9999] shadow">
      {/* Logo */}
      <Link href="/">
        <div className="flex bg-black items-center gap-2">
          <Image
            src="/Swiftboard.svg"
            alt="SwiftBoard"
            width={40}
            height={40}
            className="w-[40px]"
          />
          <h5 className="font-black text-white">SwiftBoard</h5>
        </div>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-4 items-center">
        <div
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity text-white"
          onClick={updateLocation}
        >
          <MapPin weight="fill" size={30} className="text-[#FF4B5C]" />
          <h5>
            {isLoading ? (
              <span className="animate-pulse">Detecting...</span>
            ) : (
              city || "Unknown"
            )}
          </h5>
        </div>

        {user ? (
          <div className="relative" ref={profileRef}>
            <div
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity bg-gray-800 px-4 py-2 rounded-lg text-white"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <div className="w-8 h-8 rounded-full bg-cyan-400 flex items-center justify-center text-white font-semibold text-sm">
                {getInitials(user.firstName, user.lastName)}
              </div>
              <span className="font-medium">
                {user.firstName} {user.lastName}
              </span>
              <CaretDownIcon
                size={16}
                className={`transition-transform ${profileOpen ? "rotate-180" : ""}`}
              />
            </div>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700"
                >
                  <Link
                    href="/profile/account"
                    onClick={() => setProfileOpen(false)}
                  >
                    <div className="px-4 py-3 hover:bg-gray-700 cursor-pointer flex items-center gap-2 transition-colors text-white">
                      <User size={20} /> <span>Profile</span>
                    </div>
                  </Link>
                  <div
                    onClick={handleLogout}
                    className="px-4 py-3 hover:bg-gray-700 cursor-pointer flex items-center gap-2 transition-colors text-red-400 border-t border-gray-700"
                  >
                    <SignOut size={20} /> <span>Logout</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/register">
              <button className="btn_one">Register</button>
            </Link>
            <Link href="/login">
              <button className="btn_two">Login</button>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden flex items-center gap-3 text-white">
        {user && (
          <div
            className="w-8 h-8 rounded-full bg-cyan-400 flex items-center justify-center text-xs font-bold"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            {getInitials(user.firstName, user.lastName)}
          </div>
        )}
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <List size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="absolute top-full left-0 w-full bg-black border-b border-gray-800 text-white shadow-md md:hidden overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-4">
              {user ? (
                <>
                  <Link
                    href="/profile/account"
                    onClick={() => setMenuOpen(false)}
                    className="py-2 flex items-center gap-2"
                  >
                    <User size={20} /> Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="py-2 text-left text-red-400 flex items-center gap-2"
                  >
                    <SignOut size={20} /> Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/register" onClick={() => setMenuOpen(false)}>
                    <button className="btn_one w-full">Register</button>
                  </Link>
                  <Link href="/login" onClick={() => setMenuOpen(false)}>
                    <button className="btn_two w-full">Login</button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
