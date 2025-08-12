import { Clock, Lightning } from "@phosphor-icons/react";
import React from "react";

const SectionTwo = () => {
  return (
    <section className="grid lg:grid-cols-2 gap-8">
      {/* Luxury Card */}
      <div
        className="relative rounded-xl overflow-hidden h-[500px] group shadow-lg"
        style={{
          backgroundImage: "url(/images/section_two_one.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/60 transition-all duration-500"></div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-end p-8">
          <h1 className="text-[#1E90FF] text-4xl font-extrabold mb-2 drop-shadow-lg">
            Luxury
          </h1>
          <p className="text-white text-lg font-light tracking-wide">
            In every journey
          </p>
          <span className="mt-4 block w-12 border-b-4 border-[#1E90FF]"></span>
        </div>
      </div>

      {/* Fast Booking Card */}
      <div
        className="relative rounded-xl overflow-hidden h-[500px] group shadow-lg"
        style={{
          backgroundImage: "url(/images/section_two_two.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/60 transition-all duration-500"></div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-end p-8">
          <h1 className="flex items-center gap-3 text-white text-3xl font-bold mb-2 drop-shadow-lg">
            Fast Booking
            <Lightning size={32} weight="fill" className="text-yellow-400" />
          </h1>
          <p className="flex items-center text-lg font-light tracking-wide text-white">
            In less than{" "}
            <span className="flex items-center gap-1 ml-1 font-medium text-yellow-400">
              <Clock size={22} weight="fill" />5 minutes
            </span>
          </p>
          <span className="mt-4 block w-12 border-b-4 border-yellow-400"></span>
        </div>
      </div>
    </section>
  );
};

export default SectionTwo;
