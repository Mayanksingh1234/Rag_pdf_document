import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Left_component } from "../components/Left_component";
import { FiMenu, FiX } from "react-icons/fi";

export const Mainoutlet = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">

      {/* Navbar */}
      <Navbar />

      {/* Mobile / Tablet Menu Button */}
      <div className="lg:hidden px-3 sm:px-4 py-2 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setSidebarOpen(true)}
          className="
            flex items-center gap-2
            px-3 py-2
            rounded-lg
            bg-white dark:bg-gray-900
            border border-gray-200 dark:border-gray-700
            text-gray-700 dark:text-gray-200
            hover:bg-violet-100
            hover:text-violet-600
            dark:hover:bg-violet-900/30
            dark:hover:text-violet-400
            transition-colors duration-200
          "
        >
          <FiMenu size={20} />
          <span>Menu</span>
        </button>
      </div>

      {/* Mobile / Tablet Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar */}
          <aside
            className="
              absolute left-0 top-0
              h-full w-64
              bg-white dark:bg-gray-900
              shadow-xl
              overflow-y-auto
            "
          >

            {/* Close Button */}
            <div className="flex justify-end p-3 border-b border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setSidebarOpen(false)}
                className="
                  p-2 rounded-lg
                  text-gray-600 dark:text-gray-300
                  hover:bg-violet-100
                  hover:text-violet-600
                  dark:hover:bg-violet-900/30
                  dark:hover:text-violet-400
                  transition-colors duration-200
                "
              >
                <FiX size={22} />
              </button>
            </div>

            <Left_component />
          </aside>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex">

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <Left_component />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 w-full">
          <Outlet />
        </main>

      </div>
    </div>
  );
};