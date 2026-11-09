import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useDispatch } from "react-redux";
import { login } from "../context/UserSlice";

export const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      // 1. Create Supabase Auth user
      const { data, error: signupError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
          },
        },
      });

      if (signupError) {
        throw signupError;
      }

      const user = data.user;

      if (!user) {
        throw new Error("Unable to create account.");
      }

      // 2. Create profil

      // 3. Update Redux state
      if (data.session) {
    dispatch(
      login({
        id: user.id,
        name: formData.name,
        email: user.email,
      })
    );

    navigate("/");
    } else {
    alert("Account created. Please verify your email and then log in.");
    navigate("/login");
  }

      // 4. Go to dashboard
      navigate("/");

    } catch (err) {
      setError(err.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl p-8">

        <div className="text-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-3xl mx-auto">
            🚀
          </div>

          <h1 className="mt-5 text-3xl font-bold text-white">
            Create Account
          </h1>

          <p className="mt-2 text-gray-400">
            Start chatting with your PDFs
          </p>
        </div>

        {error && (
          <div className="mt-5 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="mt-8 space-y-5">

          <div>
            <label className="text-gray-300 text-sm">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="mt-1 w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              value={formData.password}
              onChange={handleChange}
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
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
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
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-400 hover:text-indigo-300"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};