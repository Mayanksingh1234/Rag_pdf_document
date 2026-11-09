import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useDispatch } from "react-redux";
import { login } from "../context/UserSlice";

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginError) {
        throw loginError;
      }

      const user = data.user;

      if (!user) {
        throw new Error("Unable to login.");
      }

      // Get profile
      const { data: profile, error: profileError } =
        await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();

      if (profileError) {
        throw profileError;
      }

      // Store user in Redux
      dispatch(
        login({
          id: user.id,
          name: profile.full_name,
          email: user.email,
        })
      );

      navigate("/");

    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
  if (!email) {
    setError("Please enter your email address first.");
    return;
  }

  try {
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      throw error;
    }

    alert("Password reset link has been sent to your email.");
  } catch (err) {
    setError(err.message || "Failed to send password reset email.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center px-6">

      <div className="w-full max-w-md rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl p-8">

        <div className="text-center">

          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-3xl mx-auto">
            📄
          </div>

          <h1 className="mt-5 text-3xl font-bold text-white">
            PDF RAG Assistant
          </h1>

          <p className="mt-2 text-gray-400">
            Sign in to continue
          </p>

        </div>

        {error && (
          <div className="mt-5 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form
          onSubmit={handleLogin}
          className="mt-8 space-y-5"
        >

          <div>
            <label className="text-gray-300 text-sm">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@gmail.com"
              required
              className="mt-1 w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm">
              Password
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

          <div className="flex justify-between text-sm">

            <label className="flex items-center gap-2 text-gray-400">
              <input type="checkbox" />
              Remember me
            </label>

           <button
            type="button"
            onClick={handleForgotPassword}
            className="text-indigo-400 hover:text-indigo-300"
          >
            Forgot?
          </button>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

        </form>


        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{" "}

          <Link
            to="/signup"
            className="text-indigo-400 hover:text-indigo-300"
          >
            Sign Up
          </Link>

        </p>

      </div>

    </div>
  );
};