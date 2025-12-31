import TravelDetails from "@/components/profile/travels/TravelDetails";
import { Car } from "lucide-react";
import React from "react";

const page = () => {
  return (
    <>
      <main className="layout">
        <div className="mt-4">
          <span>
            <h1 className="text-3xl font-black flex items-center gap-2">
              Travels <Car size={40} />
            </h1>
            <p className="text-slate-400">
              Manage and download your journey tickets
            </p>
          </span>
        </div>
        <TravelDetails />
      </main>
    </>
  );
};

export default page;
