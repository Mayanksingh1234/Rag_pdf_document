import { Link } from "react-router-dom";

export const Signup = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center px-6">

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

        <form className="mt-8 space-y-5">

          <input
            type="text"
            placeholder="Full Name"
            className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-indigo-500"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-indigo-500"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-indigo-500"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-indigo-500"
          />

          <button className="w-full rounded-xl bg-indigo-600 py-3 text-white font-semibold hover:bg-indigo-700 transition">
            Create Account
          </button>

        </form>

        <p className="mt-6 text-center text-gray-400">

          Already have an account?

          <Link
            to="/login"
            className="ml-2 text-indigo-400 hover:underline"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}