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
        <AccountDetails />
      </main>
    </>
  );
};

export default page;
