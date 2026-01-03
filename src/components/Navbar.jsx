"use client";

import { CaretDownIcon, MapPin } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { List, X } from "@phosphor-icons/react";
import { useLocation } from "@/app/contexts/LocationContext";

const Navbar = () => {
  const { city, isLoading, updateLocation } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef();

  const toggleDropdown = () => setMenuOpen((prev) => !prev);

  return (
    <nav
      ref={navRef}
      className="px-6 py-4 flex bg-black transition-colors ease-in duration-300 items-center justify-between fixed top-0 w-full z-[9999] shadow"
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

        <div className="flex items-center gap-2">
          <Link href="/register">
            <button className="btn_one">Register</button>
          </Link>
          <Link href="/login">
            <button className="btn_two">Login</button>
          </Link>
          {/* <DarkMode /> */}
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

              <div className="flex flex-col gap-2">
                <Link href="/register">
                  <button className="btn_one w-full">Register</button>
                </Link>
                <Link href="/login">
                  <button className="btn_two w-full">Login</button>
                </Link>
                {/* <DarkMode /> */}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;