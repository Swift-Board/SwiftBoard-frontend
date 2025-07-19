"use client";

import { CaretDownIcon, MapPin } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import DarkMode from "./DarkMode";
import { motion, AnimatePresence } from "framer-motion";
import { List, X } from "@phosphor-icons/react";
import Select from "react-select";
import { useLocation } from "../contexts/LocationContext";

const darkSelectStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: "#2C2C2E",
    borderColor: "#3A3A3C",
    color: "#fff",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#1C1C1E",
    color: "#fff",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#fff",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#3A3A3C" : "#1C1C1E",
    color: "#fff",
    cursor: "pointer",
  }),
};

const Navbar = () => {
  const { location, setLocation } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const toggleDropdown = () => setMenuOpen((prev) => !prev);

  // Fetch current location using geolocation API
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await res.json();
        const place =
          data.address.city || data.address.town || data.address.state;
        setUserLocation(place);
      });
    }
  }, []);
  const navRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        navRef.current.classList.add("bg-black");
      } else {
        navRef.current.classList.remove("bg-black");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dynamically build location options
  const locationOptions = [
    { label: "Nigeria", value: "Nigeria" },
    ...(userLocation
      ? [{ label: `📍 ${userLocation}`, value: userLocation }]
      : []),
  ];

  // Handle location change
  const handleLocationChange = (selected) => {
    if (selected) {
      setLocation(selected.value);
    }
  };

  return (
    <nav
      ref={navRef}
      className="px-6 py-4 flex transition-colors ease-in duration-300 items-center justify-between fixed top-0 w-full z-[9999] shadow"
    >
      {/* Logo */}
      <Link href="/">
        <div className="flex items-center gap-2">
          <Image
            src="/swift.svg"
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
        <Link href="/about">About Us</Link>

        {/* Location dropdown */}
        <div className="flex items-center gap-2 w-[200px]">
          <MapPin weight="fill" />
          <Select
            options={locationOptions}
            placeholder="Select location"
            styles={darkSelectStyles}
            onChange={handleLocationChange}
            className="text-sm w-full"
            value={{ label: location, value: location }}
            isSearchable={false}
          />
        </div>

        <div className="flex items-center gap-2">
          <Link href="/register">
            <button className="btn_one">Register</button>
          </Link>
          <Link href="/login">
            <button className="btn_two">Login</button>
          </Link>
          <DarkMode />
        </div>
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
            className="absolute top-full left-0 w-full bg-gray-900 text-white shadow-md md:hidden"
          >
            <div className="p-4 flex flex-col gap-4">
              <Link href="/about" onClick={toggleDropdown}>
                About Us
              </Link>

              <div className="flex items-center gap-2 text-black">
                <MapPin weight="fill" size={30} />
                <Select
                  options={locationOptions}
                  placeholder="Select location"
                  styles={darkSelectStyles}
                  onChange={handleLocationChange}
                  className="text-sm w-full"
                  value={{ label: location, value: location }}
                  isSearchable={false}
                />
              </div>

              <div className="flex flex-col gap-2">
                <button className="btn_one">Register</button>
                <button className="btn_two">Login</button>
                <DarkMode />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
