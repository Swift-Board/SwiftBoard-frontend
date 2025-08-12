import { footerLinks } from "@/constants";
import {
  Envelope,
  InstagramLogo,
  LinkedinLogo,
  MetaLogo,
  TiktokLogo,
  TwitterLogo,
} from "@phosphor-icons/react/dist/ssr";
import React from "react";

const Footer = () => {
  return (
    <footer className="grid lg:grid-cols-4 grid-cols-2 items-center bg-[#111] text-white">
      {/* Social Icons */}
      <div className="flex flex-wrap items-center gap-4 pl-10">
        {[
          InstagramLogo,
          TwitterLogo,
          LinkedinLogo,
          TiktokLogo,
          MetaLogo,
          Envelope,
        ].map((Icon, idx) => (
          <Icon
            key={idx}
            size={24}
            weight="fill"
            className="cursor-pointer hover:text-[#1E90FF] transition-colors"
          />
        ))}
      </div>

      {/* Divider + Footer Links */}
      <div className="grid grid-cols-2 border-l border-gray-600 pl-8">
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

      {/* Booking Section */}
      <div
        className="w-full flex justify-between items-center gap-4 p-8 col-span-2 rounded-tl-2xl bg-blend-darken bg-black/50 text-center"
        style={{
          backgroundImage: "url(/images/footer.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <button className="btn_one">Book Now</button>
        <p className="text-sm">&copy; SwiftBoard 2025</p>
      </div>
    </footer>
  );
};

export default Footer;
