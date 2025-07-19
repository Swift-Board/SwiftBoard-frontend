import React from "react";
import Login from "../components/auth/Login";
import Head from "next/head";
export const metadata = {
  title: "SwiftBoard | Login",
};

const page = () => {

  return (
    <>

      <Login />
    </>
  );
};

export default page;
