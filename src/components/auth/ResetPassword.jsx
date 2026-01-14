"use client";

import Image from "next/image";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNotification } from "../Notification";
import { useRouter } from "next/navigation";
import { api } from "@/utils/axios";

const ResetPassword = () => {
  const { showNotification } = useNotification();
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = await api.post("/api/auth/forgot-password", values);

        if (response.data.success) {
          showNotification({
            type: "success",
            message: response.data.message || "OTP sent successfully!",
            duration: 2000,
          });

          localStorage.setItem("resetEmail", values.email);

          setTimeout(() => {
            router.push("/otp");
          }, 1500);
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Failed to send OTP. Please try again.";

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
              Please input your email address to receive OTP
            </p>

            {/* Email Input */}
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={formik.isSubmitting || !(formik.isValid && formik.dirty)}
              className={`w-full py-3 rounded-lg text-white cursor-pointer font-semibold ${
                formik.isValid && formik.dirty && !formik.isSubmitting
                  ? "bg-[#FF4B5C] hover:bg-[#e43f50]"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {formik.isSubmitting ? "Sending..." : "Request OTP"}
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

export default ResetPassword;