import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Left_component } from "../components/Left_component";

export const Mainoutlet = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 m-0 p-2 md:p-4 lg:px-6 lg:py-4">

      {/* Static Navbar */}
      <Navbar />

      <div className="flex">

        {/* Static Sidebar */}
        <div className="w-64 shrink-0">
          <Left_component />
        </div>

        {/* Changing Body */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>

      </div>

    </div>
  );
};