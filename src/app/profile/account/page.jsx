"use client";

import AccountDetails from "@/components/profile/account/AccountDetails";
import { ArrowLeft, User } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const page = () => {
  const router = useRouter();

  return (
    <>
      <main className="layout">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mt-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back</span>
        </button>
        <div className="flex items-center gap-2 mt-6">
          <User size={30} />
          <h1 className="text-3xl font-black">User Profile</h1>
        </div>
        <AccountDetails />
      </main>
    </>
  );
};

export default page;
