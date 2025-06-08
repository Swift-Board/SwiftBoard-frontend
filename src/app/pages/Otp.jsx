"use client";

import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";

const Otp = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(20);
  const [canResend, setCanResend] = useState(false);
  const inputsRef = useRef([]);
  const pageTitle = "SwiftBoard | OTP Verification";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullOtp = otp.join("");
    if (fullOtp.length === 6 && /^\d{6}$/.test(fullOtp)) {
      console.log("Entered OTP:", fullOtp);
      // Add your OTP verification logic here
    } else {
      alert("Please enter a valid 6-digit OTP.");
    }
  };

  const handleResend = () => {
    setOtp(new Array(6).fill(""));
    inputsRef.current[0].focus();
    setTimer(10);
    setCanResend(false);

    // TODO: Add actual resend OTP logic here (API call)
    console.log("Resend OTP clicked");
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

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
            Enter the 6-digit code sent to your email at ****@gmail.com
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
                  className="w-12 h-14 text-2xl text-center border border-gray-300 rounded-lg outline-none focus:border-blue-500 transition-all"
                  autoComplete="one-time-code"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={!isOtpComplete}
              className={`w-full py-3 rounded-lg font-semibold transition
              ${
                isOtpComplete
                  ? "bg-[#FF4B5C] text-white hover:bg-[#e43f50]"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              Verify OTP
            </button>
          </form>

          <div className="mt-4 text-center">
            {canResend ? (
              <button
                onClick={handleResend}
                className="text-blue-600 hover:underline font-semibold"
              >
                Resend OTP
              </button>
            ) : (
              <p className="text-gray-500">Resend OTP in {timer} seconds</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Otp;
