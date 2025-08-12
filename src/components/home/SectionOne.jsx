import React from "react";
import { MapPin, NavigationArrow } from "@phosphor-icons/react";
import Image from "next/image";

const SectionOne = () => {
  return (
    <section className="grid lg:grid-cols-2 gap-8 items-center text-white bg-[#1C1C1E] p-4 rounded-lg">
      <div
        style={{
          backgroundImage: "url(/images/section_one.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="relative flex justify-end items-end rounded-xl p-8 order-1 lg:order-2 overflow-hidden bg-blend-darken bg-black/50 h-[400px] group shadow-lg"
      >
        <div className="flex flex-col">
          <p className="text-slate-300">Powered By</p>
          <h1 className="flex items-center text-3xl font-bold gap-4">
            Google Maps
            <Image
              src="/googlePin.png"
              alt="Google Maps Logo"
              width={40}
              height={40}
            />
          </h1>
        </div>
      </div>

      <div className="flex flex-col px-8 justify-center order-2 lg:order-1">
        <NavigationArrow size={48} weight="bold" className="mb-4 text-white" />
        <h1 className="text-4xl font-bold">Track your journey</h1>
        <div className="flex items-center gap-2 mt-2 opacity-90">
          <MapPin size={24} weight="fill" className="text-yellow-400" />
          <p className="text-lg text-[#FF4B5C]">Know where you are</p>
        </div>
      </div>
    </section>
  );
};

export default SectionOne;
