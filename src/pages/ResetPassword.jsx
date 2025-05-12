import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetlogo } from "../assets/index";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email"); // Get email from URL
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // ✅ Reset Password API
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        "https://api.confidanto.com/update-profile/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            newPassword,
            confirmNewPassword,
          }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        setMessage("✅ Password reset successful! Redirecting...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(result.message || "❌ Failed to reset password.");
      }
    } catch (error) {
      setMessage("⚠️ Error resetting password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Background Logo */}
      <div className="absolute left-9 top-1/2 transform -translate-y-1/2 opacity-20">
        <img src={resetlogo} alt="Logo" className="w-800 h-auto blur-sm" />
      </div>

      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full z-10">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          🔐 Reset Your Password
        </h2>

        <form onSubmit={handleResetPassword} className="space-y-5">
          {/* New Password Input */}
          <div>
            <input
              type="password"
              placeholder="New Password"
              required
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <input
              type="password"
              placeholder="Confirm New Password"
              required
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition"
          >
            Reset Password
          </button>

          {/* Message Display */}
          {message && <p className="text-center text-gray-700">{message}</p>}
        </form>
      </div>
    </div>
  );
}
