"use client";

import { CaretDownIcon, MapPin, User, SignOut } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { List, X } from "@phosphor-icons/react";
import { useLocation } from "@/app/contexts/LocationContext";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { city, isLoading, updateLocation } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();
  const navRef = useRef();
  const profileRef = useRef();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setMenuOpen((prev) => !prev);
  const toggleProfile = () => setProfileOpen((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setProfileOpen(false);
    router.push("/");
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  return (
    <nav
      ref={navRef}
      className="px-6 py-4 flex bg-black transition-colors ease-in duration-300 border-b border-slate-800 items-center justify-between fixed top-0 w-full z-[9999] shadow"
    >
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
          <h5 className="font-black">SwiftBoard</h5>
        </div>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-4 items-center">
        {/* Location dropdown */}
        <div
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={updateLocation}
          title="Click to refresh location"
        >
          <MapPin weight="fill" size={30} />
          <h5>
            {isLoading ? (
              <span className="animate-pulse">Detecting...</span>
            ) : (
              city || "Unknown"
            )}
          </h5>
        </div>

        {/* Auth Section */}
        {user ? (
          <div className="relative" ref={profileRef}>
            <div
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity bg-gray-800 px-4 py-2 rounded-lg"
              onClick={toggleProfile}
            >
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-cyan-400 flex items-center justify-center text-white font-semibold text-sm">
                  {getInitials(user.firstName, user.lastName)}
                </div>
              )}
              <span className="font-medium">
                {user.firstName} {user.lastName}
              </span>
              <CaretDownIcon
                size={16}
                className={`transition-transform ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                >
                  <Link href="/profile/account">
                    <div className="px-4 py-3 hover:bg-gray-700 cursor-pointer flex items-center gap-2 transition-colors">
                      <User size={20} />
                      <span>Profile</span>
                    </div>
                  </Link>
                  <div
                    onClick={handleLogout}
                    className="px-4 py-3 hover:bg-gray-700 cursor-pointer flex items-center gap-2 transition-colors text-red-400"
                  >
                    <SignOut size={20} />
                    <span>Logout</span>
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
      <div className="md:hidden">
        <button onClick={toggleDropdown}>
          {menuOpen ? <X size={28} /> : <List size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="absolute top-full left-0 w-full bg-black text-white shadow-md md:hidden"
          >
            <div className="p-4 flex flex-col gap-4">
              <div
                className="flex items-center gap-2 text-white cursor-pointer hover:opacity-80 transition-opacity"
                onClick={updateLocation}
              >
                <MapPin weight="fill" size={30} />
                <h5>
                  {isLoading ? (
                    <span className="animate-pulse">Detecting...</span>
                  ) : (
                    city || "Unknown"
                  )}
                </h5>
              </div>

              {/* Mobile Auth Section */}
              {user ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-800 rounded-lg">
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-cyan-400 flex items-center justify-center text-white font-semibold text-sm">
                        {getInitials(user.firstName, user.lastName)}
                      </div>
                    )}
                    <span className="font-medium">
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                  <Link href="/profile">
                    <button className="btn_one w-full flex items-center justify-center gap-2">
                      <User size={20} />
                      Profile
                    </button>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="btn_two w-full flex items-center justify-center gap-2 text-red-400"
                  >
                    <SignOut size={20} />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/register">
                    <button className="btn_one w-full">Register</button>
                  </Link>
                  <Link href="/login">
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
