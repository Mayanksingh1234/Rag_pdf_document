
import React, { useState } from "react";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { MdPersonOutline } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { logout } from "../context/UserSlice";

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();

    dispatch(logout());
    setOpen(false);

    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center p-2">
      
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="bg-violet-500 p-2 rounded-xl">
          <IoChatbubbleEllipses className="text-white size-4 md:size-6" />
        </div>

        <h1 className="text-l md:text-xl font-bold">
          PDF Assistant
        </h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-5 md:gap-6 lg:gap-8">

        {/* User Icon */}
        <div className="relative">

          <button
            onClick={() => setOpen(!open)}
            className="cursor-pointer"
          >
            <MdPersonOutline className="size-6 md:size-7 lg:size-9 text-violet-500" />
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 p-3">

              {user.isloggedin ? (
                <>
                  <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {user.name || "User"}
                    </p>

                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full mt-2 text-left px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-violet-50 dark:hover:bg-gray-700"
                  >
                    Login
                  </button>

                  <button
                    onClick={() => navigate("/signup")}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-violet-50 dark:hover:bg-gray-700"
                  >
                    Sign Up
                  </button>
                </>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
