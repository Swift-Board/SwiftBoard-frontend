"use client"

import { footerLinks } from "@/constants";
import { Instagram, MailIcon, Twitter } from "lucide-react";
import React from "react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <footer className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6 bg-[#111] items-center text-white p-4 lg:p-0">
      {/* Footer Links (Divider only on lg) */}
      <div className="lg:grid lg:order-2 order-1 flex lg:gap-0 gap-3 grid-cols-2 gap-y-2 lg:border-l lg:border-gray-600 lg:pl-8 text-center lg:text-left">
        {footerLinks.map((link, index) => (
          <a
            href={link.href}
            key={index}
            className="hover:text-[#1E90FF] cursor-pointer transition-colors"
          >
            {link.text}
          </a>
        ))}
      </div>

      {/* Social Icons */}
      <div className="flex flex-wrap items-center order-2 lg:order-1 gap-4 pl-0 lg:pl-10 justify-center lg:justify-start">
        {[Instagram, Twitter, MailIcon].map((Icon, idx) => (
          <Icon
            key={idx}
            size={24}
            weight="fill"
            className="cursor-pointer hover:text-[#1E90FF] transition-colors"
          />
        ))}
      </div>

      {/* Booking Section */}
      <div
        className="w-full hidden lg:flex order-3 flex-col lg:flex-row justify-center lg:justify-between items-center gap-4 p-6 rounded-tl-2xl bg-blend-darken bg-black/50 text-center lg:col-span-2"
        style={{
          backgroundImage: "url(/images/footer.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <button className="btn_one" onClick={scrollToTop}>
          Start Booking
        </button>
        <p className="text-sm">&copy; SwiftBoard 2025</p>
      </div>
    </footer>
  );
};

export default Footer;
