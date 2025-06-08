"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const ResetPassword = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
    }),
    onSubmit: (values) => {
      console.log("Signup data:", values);
    },
  });

  return (
    <>
      <div className="grid lg:mt-20 lg:grid-cols-2 items-center w-full gap-8 p-4">
        <div className="bg-[#1C1C1E] hidden lg:flex p-6 justify-center items-center rounded-lg h-screen">
          <Image
            src="/login.svg"
            alt="Signup Illustration"
            width={100}
            height={100}
            blurDataURL="data:..."
            placeholder="blur"
            className="w-[70%]"
          />
        </div>

        <div className="flex items-center justify-center h-screen">
          <form
            onSubmit={formik.handleSubmit}
            className="w-full max-w-md space-y-6"
          >
            <h2 className="text-3xl font-bold text-center">
              Reset your password
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Please input your email address to continue
            </p>

            {/* Input Group Template */}
            {[{ label: "Email", id: "email", type: "email" }].map(
              ({ label, id, type }) => (
                <div key={id} className="relative w-full">
                  <input
                    type={type}
                    id={id}
                    placeholder=" "
                    {...formik.getFieldProps(id)}
                    className={`peer w-full p-3 pt-5 border rounded-lg outline-none transition-all
                  ${
                    formik.touched[id] && formik.errors[id]
                      ? "border-red-500"
                      : "border-gray-300"
                  }
                  focus:border-blue-500`}
                  />
                  <label
                    htmlFor={id}
                    className="absolute text-sm text-gray-500 left-3 -top-2.5 bg-black px-1 transition-all scale-100 origin-left
    peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:bg-transparent
    peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500 dark:peer-focus:bg-black"
                  >
                    {label}
                  </label>
                  {formik.touched[id] && formik.errors[id] && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors[id]}
                    </p>
                  )}
                </div>
              )
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!(formik.isValid && formik.dirty)}
              className={`w-full py-3 rounded-lg text-white cursor-pointer font-semibold ${
                formik.isValid && formik.dirty
                  ? "bg-[#FF4B5C]"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Request OTP{" "}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
