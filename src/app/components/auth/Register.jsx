"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  EyeSlashIcon,
  EyeIcon,
  GoogleLogo,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirm = () => setShowConfirm((prev) => !prev);

  const formik = useFormik({
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
      firstName: Yup.string().required("Required"),
      lastName: Yup.string().required("Required"),
      password: Yup.string()
        .min(8, "Must be at least 8 characters") // updated to 8
        .required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Required"),
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
              Create an Account
            </h2>

            {/* Input Group Template */}
            {[
              { label: "First Name", id: "firstName", type: "text" },
              { label: "Last Name", id: "lastName", type: "text" },
              { label: "Email", id: "email", type: "email" },
            ].map(({ label, id, type }) => (
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
                  peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500 peer-focus:bg-black"
                >
                  {label}
                </label>
                {formik.touched[id] && formik.errors[id] && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors[id]}
                  </p>
                )}
              </div>
            ))}

            {/* Password */}
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder=" "
                {...formik.getFieldProps("password")}
                className={`peer w-full p-3 pt-5 pr-10 border rounded-lg outline-none transition-all
                ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500"
                    : "border-gray-300"
                }
                focus:border-blue-500`}
              />
              <label
                htmlFor="password"
                className="absolute text-sm text-gray-500 left-3 -top-2.5 bg-black px-1 transition-all scale-100 origin-left
                peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:bg-transparent
                peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500 peer-focus:bg-black"
              >
                Password
              </label>
              <span
                className="absolute top-5 right-3 cursor-pointer text-gray-500"
                onClick={togglePassword}
              >
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </span>
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative w-full">
              <input
                type={showConfirm ? "text" : "password"}
                id="confirmPassword"
                placeholder=" "
                {...formik.getFieldProps("confirmPassword")}
                className={`peer w-full p-3 pt-5 pr-10 border rounded-lg outline-none transition-all
                ${
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-300"
                }
                focus:border-blue-500`}
              />
              <label
                htmlFor="confirmPassword"
                className="absolute text-sm text-gray-500 left-3 -top-2.5 bg-black px-1 transition-all scale-100 origin-left
                peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:bg-transparent
                peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500 peer-focus:bg-black"
              >
                Confirm Password
              </label>
              <span
                className="absolute top-4 right-3 cursor-pointer text-gray-500"
                onClick={toggleConfirm}
              >
                {showConfirm ? <EyeSlashIcon /> : <EyeIcon />}
              </span>
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.confirmPassword}
                  </p>
                )}
            </div>

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
              Sign Up
            </button>

            <div className="flex items-center gap-2">
              <hr className="flex-1 border-gray-300" />
              <span className="text-sm text-gray-500">or sign up with</span>
              <hr className="flex-1 border-gray-300" />
            </div>

            {/* Google Auth */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 bg-white border text-black hover:translate-y-0.5 ease-in duration-100 p-2 rounded-lg cursor-pointer transition"
              onClick={() => console.log("Google Sign In placeholder")}
            >
              <Image
                src="/google.svg"
                alt="Google Icon"
                width={10}
                height={10}
                blurDataURL="data:..."
                placeholder="blur"
                className="w-8"
              />
              Continue with Google
            </button>

            <small className="flex justify-center">
              Already have an account? &nbsp;
              <Link href="/login">
                <span className="underline text-[#FF4B5C]">Login</span>
              </Link>{" "}
            </small>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
