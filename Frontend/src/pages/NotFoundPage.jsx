import React from "react";
import { useNavigate } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-6">

      <div className="text-center">

        <div className="text-8xl md:text-9xl font-bold text-violet-600">
          404
        </div>

        <h1 className="mt-4 text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
          Page Not Found
        </h1>

        <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <button
          onClick={() => navigate("/")}
          className=" mt-7 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-700 transition
          "
        >
          <IoHomeOutline size={18} />
          Back to Home
        </button>

      </div>

    </div>
  );
};