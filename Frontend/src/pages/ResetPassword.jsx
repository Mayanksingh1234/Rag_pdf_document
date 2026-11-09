import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export const ResetPassword = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        throw error;
      }

      setMessage("Password updated successfully.");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center px-6">

      <div className="w-full max-w-md rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl p-8">

        <div className="text-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-3xl mx-auto">
            🔐
          </div>

          <h1 className="mt-5 text-3xl font-bold text-white">
            Reset Password
          </h1>

          <p className="mt-2 text-gray-400">
            Enter your new password
          </p>
        </div>

        {error && (
          <div className="mt-5 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-5 rounded-lg bg-green-500/10 border border-green-500/30 px-4 py-3 text-sm text-green-400">
            {message}
          </div>
        )}

        <form
          onSubmit={handleResetPassword}
          className="mt-8 space-y-5"
        >

          <div>
            <label className="text-gray-300 text-sm">
              New Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="mt-1 w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm">
              Confirm Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="mt-1 w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>

        </form>

      </div>
    </div>
  );
};