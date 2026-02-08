"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { EyeSlashIcon, EyeIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/utils/axios";
import { useNotification } from "../Notification";
import { useAuth } from "@/app/contexts/AuthContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);
  const { showNotification } = useNotification();
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "expired") {
      showNotification({
        type: "error",
        message: "Session expired. Please log in to continue.",
        duration: 5000,
      });
    }
  }, [showNotification]);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
      password: Yup.string()
        .min(8, "Must be at least 8 characters")
        .required("Required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = await api.post("/auth/login", values);
        if (response.data.success) {
          login(response.data.user, response.data.token);
          showNotification({
            type: "success",
            message: response.data.message || "Login successful!",
            duration: 2000,
          });
          resetForm();
          setTimeout(() => {
            router.push("/");
          }, 1500);
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Login failed.";
        showNotification({
          type: "error",
          message: errorMessage,
          duration: 2000,
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="grid lg:mt-20 lg:grid-cols-2 items-center w-full gap-8 p-4">
      <div className="dark:bg-[#1C1C1E] hidden lg:flex p-6 justify-center items-center rounded-lg h-screen">
        <Image
          src="/login.svg"
          alt="Login"
          width={100}
          height={100}
          className="w-[70%]"
          priority
        />
      </div>
      <div className="flex items-center justify-center h-screen">
        <form
          onSubmit={formik.handleSubmit}
          className="w-full max-w-md space-y-6"
        >
          <h2 className="text-3xl font-bold text-center">Login</h2>

          {/* Email */}
          <div className="relative w-full">
            <input
              type="email"
              id="email"
              placeholder=" "
              {...formik.getFieldProps("email")}
              className={`peer w-full p-3 pt-5 border rounded-lg outline-none transition-all dark:bg-black ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "border-gray-300"
              } focus:border-blue-500`}
            />
            <label
              htmlFor="email"
              className="absolute text-sm text-gray-500 left-3 -top-2.5 bg-black px-1 transition-all peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-blue-500"
            >
              Email
            </label>
          </div>

          {/* Password */}
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder=" "
              {...formik.getFieldProps("password")}
              className={`peer w-full p-3 pt-5 pr-10 border rounded-lg outline-none transition-all dark:bg-black ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : "border-gray-300"
              } focus:border-blue-500`}
            />
            <label
              htmlFor="password"
              className="absolute text-sm text-gray-500 left-3 -top-2.5 bg-black px-1 transition-all peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-blue-500"
            >
              Password
            </label>
            <span
              className="absolute top-5 right-3 cursor-pointer text-gray-500"
              onClick={togglePassword}
            >
              {showPassword ? (
                <EyeSlashIcon size={20} />
              ) : (
                <EyeIcon size={20} />
              )}
            </span>
          </div>

          <button
            type="submit"
            disabled={!(formik.isValid && formik.dirty) || formik.isSubmitting}
            className={`w-full py-3 rounded-lg text-white cursor-pointer font-semibold transition-colors ${
              formik.isValid && formik.dirty
                ? "bg-[#FF4B5C] hover:bg-[#e04352]"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {formik.isSubmitting ? "Logging In..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
