import { Link } from "react-router-dom";

export const Login = () => {
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

        <form className="mt-8 space-y-5">

          <div>

            <label className="text-gray-300 text-sm">
              Email
            </label>

            <input
              type="email"
              placeholder="john@gmail.com"
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-indigo-500"
            />

          </div>

          <div>

            <label className="text-gray-300 text-sm">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-indigo-500"
            />

          </div>

          <div className="flex justify-between text-sm">

            <label className="flex items-center gap-2 text-gray-400">

              <input type="checkbox" />

              Remember me

            </label>

            <button
              type="button"
              className="text-indigo-400 hover:text-indigo-300"
            >
              Forgot?
            </button>

          </div>

          <button
            className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700 transition"
          >
            Sign In
          </button>

        </form>

        <div className="my-6 flex items-center">

          <div className="h-px flex-1 bg-slate-700"></div>

          <span className="mx-4 text-gray-500 text-sm">
            OR
          </span>

          <div className="h-px flex-1 bg-slate-700"></div>

        </div>

        <button className="w-full rounded-xl border border-slate-700 py-3 text-white hover:bg-slate-800 transition">
          Continue with Google
        </button>

        <p className="mt-6 text-center text-gray-400">

          Don't have an account?

          <Link
            to="/signup"
            className="ml-2 text-indigo-400 hover:underline"
          >
            Sign Up
          </Link>

        </p>

      </div>

    </div>
  );
}