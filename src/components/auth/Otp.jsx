"use client";

import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "../Notification";
import { api } from "@/utils/axios";

const Otp = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);
  const [email, setEmail] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const inputsRef = useRef([]);
  const router = useRouter();
  const { showNotification } = useNotification();

  useEffect(() => {
    // Get email from localStorage
    const storedEmail = localStorage.getItem("resetEmail");
    if (!storedEmail) {
      showNotification({
        type: "error",
        message: "No email found. Please start the reset process again.",
        duration: 3000,
      });
      router.push("/reset-password");
      return;
    }
    setEmail(storedEmail);

    // Focus first input
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, []);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      setCanResend(false);
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (element, index) => {
    const value = element.value.replace(/\D/, ""); // digits only
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to next input
    if (index < 5 && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      if (otp[index] === "") {
        if (index > 0 && inputsRef.current[index - 1]) {
          inputsRef.current[index - 1].focus();
          newOtp[index - 1] = "";
        }
      } else {
        newOtp[index] = "";
      }
      setOtp(newOtp);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").slice(0, 6).split("");
    if (paste.length === 6 && paste.every((ch) => /\d/.test(ch))) {
      setOtp(paste);
      paste.forEach((char, i) => {
        if (inputsRef.current[i]) {
          inputsRef.current[i].value = char;
        }
      });
      if (inputsRef.current[5]) inputsRef.current[5].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join("");

    if (fullOtp.length !== 6 || !/^\d{6}$/.test(fullOtp)) {
      showNotification({
        type: "error",
        message: "Please enter a valid 6-digit OTP.",
        duration: 2000,
      });
      return;
    }

    setIsVerifying(true);

    try {
      // Verify OTP
      const response = await api.post("/api/auth/verify-otp", {
        email: email,
        otp: fullOtp,
      });

      if (response.data.success) {
        showNotification({
          type: "success",
          message: "OTP verified successfully!",
          duration: 2000,
        });

        // Store OTP for password reset page
        localStorage.setItem("verifiedOTP", fullOtp);

        // Navigate to new password page
        setTimeout(() => {
          router.push("/new-password");
        }, 1500);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Invalid or expired OTP. Please try again.";

      showNotification({
        type: "error",
        message: errorMessage,
        duration: 3000,
      });

      // Clear OTP on error
      setOtp(new Array(6).fill(""));
      if (inputsRef.current[0]) {
        inputsRef.current[0].focus();
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    try {
      const response = await api.post("/api/auth/forgot-password", {
        email: email,
      });

      if (response.data.success) {
        showNotification({
          type: "success",
          message: "New OTP sent to your email!",
          duration: 2000,
        });

        setOtp(new Array(6).fill(""));
        if (inputsRef.current[0]) {
          inputsRef.current[0].focus();
        }
        setTimer(120); // Reset timer to 2 minutes
        setCanResend(false);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to resend OTP. Please try again.";

      showNotification({
        type: "error",
        message: errorMessage,
        duration: 2000,
      });
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  // Format timer display
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Mask email
  const maskEmail = (email) => {
    if (!email) return "****@gmail.com";
    const [username, domain] = email.split("@");
    const maskedUsername = username.slice(0, 2) + "****";
    return `${maskedUsername}@${domain}`;
  };

  return (
    <>
      <div className="grid lg:mt-20 lg:grid-cols-2 items-center w-full gap-8 p-4">
        {/* Left Illustration */}
        <div className="bg-[#1C1C1E] hidden lg:flex p-6 justify-center items-center rounded-lg h-screen">
          <Image
            src="/login.svg"
            alt="OTP Illustration"
            width={100}
            height={100}
            blurDataURL="data:..."
            placeholder="blur"
            className="w-[70%]"
          />
        </div>

        {/* Right Form */}
        <div className="flex lg:p-20 items-center justify-center flex-col h-screen">
          <h2 className="text-3xl font-bold text-center mb-6">Verify OTP</h2>
          <p className="text-gray-600 text-center mb-8">
            Enter the 6-digit code sent to your email at {maskEmail(email)}
          </p>

          <form
            onSubmit={handleSubmit}
            onPaste={handlePaste}
            className="w-full space-y-6"
          >
            <div className="flex justify-between gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength="1"
                  ref={(el) => (inputsRef.current[index] = el)}
                  value={otp[index]}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-14 text-2xl text-center border border-gray-300 rounded-lg outline-none focus:border-orange-500 transition-all"
                  autoComplete="one-time-code"
                  disabled={isVerifying}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={!isOtpComplete || isVerifying}
              className={`w-full py-3 rounded-lg font-semibold transition
              ${
                isOtpComplete && !isVerifying
                  ? "bg-[#FF4B5C] text-white hover:bg-[#e43f50]"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              {isVerifying ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          <div className="mt-4 text-center">
            {canResend ? (
              <button
                onClick={handleResend}
                className="text-orange-600 hover:underline font-semibold"
              >
                Resend OTP
              </button>
            ) : (
              <p className="text-gray-500">
                Resend OTP in {formatTimer(timer)}
              </p>
            )}
          </div>

          {/* Back to Reset Password */}
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => router.push("/resetPassword")}
              className="text-gray-500 hover:underline"
            >
              Back to Reset Password
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Otp;
