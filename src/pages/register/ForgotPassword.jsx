import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { confilogo, Forgetbg } from "../logo/index";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  // ✅ Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        "https://api.confidanto.com/update-profile/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        setMessage("✅ OTP sent! Check your email.");
        setOtpSent(true);
      } else {
        setMessage(result.message || "❌ Error sending OTP.");
      }
    } catch (error) {
      setMessage("⚠️ Network error. Try again.");
    }
  };

  // ✅ Verify OTP & Navigate to Reset Password
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        "https://api.confidanto.com/update-profile/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        setMessage("✅ OTP verified! Redirecting...");
        setTimeout(() => {
          navigate(`/ResetPassword?email=${encodeURIComponent(email)}`);
        }, 1000);
      } else {
        setMessage(result.message || "❌ Invalid OTP.");
      }
    } catch (error) {
      setMessage("⚠️ Error verifying OTP.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-screen-xl flex flex-col md:flex-row justify-center">
        {/* Left-Side Image */}
        <div className="w-full md:w-1/2">
          <img src={Forgetbg} alt="Forgot Password" className="w-full h-auto" />
        </div>

        {/* Form Section */}
        <div className="max-w-md bg-white bg-opacity-90 rounded-lg p-8 shadow-lg">
          <img src={confilogo} alt="Logo" className="h-10 w-auto mb-6 mx-auto" />
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Forgot Password?
          </h2>
          <p className="text-center text-sm text-gray-600">
            Enter your email and we'll send an OTP.
          </p>

          <form className="mt-6 space-y-6" onSubmit={otpSent ? handleVerifyOTP : handleSendOTP}>
            {/* Email Input */}
            <div>
              <input
                type="email"
                placeholder="Email address"
                required
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={otpSent}
              />
            </div>

            {/* OTP Input (Only when OTP is sent) */}
            {otpSent && (
              <div>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  required
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition"
            >
              {otpSent ? "Verify OTP" : "Send OTP"}
            </button>

            {/* Message Display */}
            {message && <p className="text-center text-gray-700">{message}</p>}
          </form>

          <div className="text-center mt-4">
            <Link to="/" className="text-indigo-600 hover:text-indigo-500">Cancel</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
