"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNotification } from "../Notification";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { api } from "@/utils/axios";

const NewPassword = () => {
  const { showNotification } = useNotification();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  useEffect(() => {
    // Get email and OTP from localStorage
    const storedEmail = localStorage.getItem("resetEmail");
    const storedOTP = localStorage.getItem("verifiedOTP");

    if (!storedEmail || !storedOTP) {
      showNotification({
        type: "error",
        message: "Session expired. Please start the reset process again.",
        duration: 3000,
      });
      router.push("/resetPassword");
      return;
    }

    setEmail(storedEmail);
    setOtp(storedOTP);
  }, []);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        )
        .required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await api.post("/auth/reset-password", {
          email: email,
          otp: otp,
          password: values.password,
          confirmPassword: values.confirmPassword,
        });

        if (response.data.success) {
          showNotification({
            type: "success",
            message: response.data.message || "Password reset successful!",
            duration: 2000,
          });

          // Clear stored data
          localStorage.removeItem("resetEmail");
          localStorage.removeItem("verifiedOTP");

          // Store new token if provided
          if (response.data.token) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
          }

          // Navigate to login or dashboard
          setTimeout(() => {
            router.push("/login");
          }, 1500);
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          "Failed to reset password. Please try again.";

        showNotification({
          type: "error",
          message: errorMessage,
          duration: 3000,
        });

        // If OTP expired, redirect back to reset password
        if (error.response?.status === 400) {
          setTimeout(() => {
            localStorage.removeItem("resetEmail");
            localStorage.removeItem("verifiedOTP");
            router.push("/reset-password");
          }, 2000);
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <div className="grid lg:mt-20 lg:grid-cols-2 items-center w-full gap-8 p-4">
        <div className="bg-[#1C1C1E] hidden lg:flex p-6 justify-center items-center rounded-lg h-screen">
          <Image
            src="/login.svg"
            alt="Reset Password Illustration"
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
              Create New Password
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Please enter your new password
            </p>

            {/* Password Input */}
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder=" "
                {...formik.getFieldProps("password")}
                className={`peer w-full p-3 pt-5 border rounded-lg outline-none transition-all
                  ${
                    formik.touched.password && formik.errors.password
                      ? "border-red-500"
                      : "border-gray-300"
                  }
                  focus:border-orange-500`}
              />
              <label
                htmlFor="password"
                className="absolute text-sm text-gray-500 left-3 -top-2.5 bg-black px-1 transition-all scale-100 origin-left
                  peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:bg-transparent
                  peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-orange-500 dark:peer-focus:bg-black"
              >
                New Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-4 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="relative w-full">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder=" "
                {...formik.getFieldProps("confirmPassword")}
                className={`peer w-full p-3 pt-5 border rounded-lg outline-none transition-all
                  ${
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }
                  focus:border-orange-500`}
              />
              <label
                htmlFor="confirmPassword"
                className="absolute text-sm text-gray-500 left-3 -top-2.5 bg-black px-1 transition-all scale-100 origin-left
                  peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:bg-transparent
                  peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-orange-500 dark:peer-focus:bg-black"
              >
                Confirm Password
              </label>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-4 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.confirmPassword}
                  </p>
                )}
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-sm font-semibold mb-2">Password must contain:</p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <li className="flex items-center gap-2">
                  <span
                    className={
                      formik.values.password.length >= 8
                        ? "text-green-500"
                        : "text-gray-400"
                    }
                  >
                    ✓
                  </span>
                  At least 8 characters
                </li>
                <li className="flex items-center gap-2">
                  <span
                    className={
                      /[A-Z]/.test(formik.values.password)
                        ? "text-green-500"
                        : "text-gray-400"
                    }
                  >
                    ✓
                  </span>
                  One uppercase letter
                </li>
                <li className="flex items-center gap-2">
                  <span
                    className={
                      /[a-z]/.test(formik.values.password)
                        ? "text-green-500"
                        : "text-gray-400"
                    }
                  >
                    ✓
                  </span>
                  One lowercase letter
                </li>
                <li className="flex items-center gap-2">
                  <span
                    className={
                      /\d/.test(formik.values.password)
                        ? "text-green-500"
                        : "text-gray-400"
                    }
                  >
                    ✓
                  </span>
                  One number
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                formik.isSubmitting || !(formik.isValid && formik.dirty)
              }
              className={`w-full py-3 rounded-lg text-white cursor-pointer font-semibold ${
                formik.isValid && formik.dirty && !formik.isSubmitting
                  ? "bg-[#FF4B5C] hover:bg-[#e43f50]"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {formik.isSubmitting ? "Resetting..." : "Reset Password"}
            </button>

            {/* Back to Login */}
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="text-orange-500 hover:underline"
              >
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default NewPassword;