import React, { useState } from "react";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { MdPersonOutline } from "react-icons/md";
import { FiMoon, FiSun } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { logout } from "../context/UserSlice";
import { toggleTheme } from "../context/ThemeSlice";

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  const user = useSelector((state) => state.user);
  const mode = useSelector((state) => state.theme.mode);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();

    dispatch(logout());
    setOpen(false);

    navigate("/login");
  };

  return (
    <nav className="w-full px-3 sm:px-4 md:px-6 py-3 bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <div className="flex items-center justify-between">

        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 sm:gap-3"
        >
          <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-violet-600 rounded-xl shadow-sm">
            <IoChatbubbleEllipses className="text-white text-lg sm:text-xl" />
          </div>

          <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white">
            PDF Assistant
          </h1>
        </button>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* Theme button */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition"
            aria-label="Toggle theme"
            title={
              mode === "light"
                ? "Switch to dark mode"
                : "Switch to light mode"
            }
          >
            {mode === "light" ? (
              <FiMoon className="text-lg sm:text-xl" />
            ) : (
              <FiSun className="text-lg sm:text-xl" />
            )}
          </button>

          {/* User */}
          <div className="relative">

            <button
              onClick={() => setOpen(!open)}
              className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 transition"
              aria-label="User menu"
            >
              <MdPersonOutline className="text-violet-600 text-2xl sm:text-3xl" />
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 top-12 sm:top-14 w-[calc(100vw-2rem)] max-w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">

                {user.isloggedin ? (
                  <>
                    {/* User information */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">

                      <p className="font-semibold text-gray-900 dark:text-white truncate">
                        {user.name || "User"}
                      </p>

                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                        {user.email}
                      </p>

                    </div>

                    {/* Logout */}
                    <div className="p-2">

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                      >
                        Logout
                      </button>

                    </div>
                  </>
                ) : (
                  <div className="p-2">

                    <button
                      onClick={() => {
                        setOpen(false);
                        navigate("/login");
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-violet-50 dark:hover:bg-gray-800 transition"
                    >
                      Login
                    </button>

                    <button
                      onClick={() => {
                        setOpen(false);
                        navigate("/signup");
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-violet-50 dark:hover:bg-gray-800 transition"
                    >
                      Sign Up
                    </button>

                  </div>
                )}

              </div>
            )}

          </div>

        </div>

      </div>
    </nav>
  );
};