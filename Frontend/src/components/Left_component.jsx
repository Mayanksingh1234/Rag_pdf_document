import React from "react";
import { IoHomeOutline } from "react-icons/io5";
import { IoDocumentTextOutline } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export const Left_component = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full w-full text-md text-black dark:text-white p-5">

      <nav className="space-y-1">

        {/* Home */}
        <button
          onClick={() => navigate("/")}
          className="
            w-full
            text-left
            px-4 py-3
            rounded-lg
            hover:text-violet-500
            hover:bg-violet-100
            dark:hover:bg-violet-900/30
            dark:hover:text-violet-400
            transition-colors duration-200
          "
        >
          <div className="flex gap-3 items-center">
            <IoHomeOutline className="size-5" />
            Home
          </div>
        </button>

        {/* Documents */}
        <button
          onClick={() => navigate("/documents")}
          className="
            w-full
            text-left
            px-4 py-3
            rounded-lg
            hover:text-violet-500
            hover:bg-violet-100
            dark:hover:bg-violet-900/30
            dark:hover:text-violet-400
            transition-colors duration-200
          "
        >
          <div className="flex gap-3 items-center">
            <IoDocumentTextOutline className="size-5" />
            Documents
          </div>
        </button>

        {/* Settings */}
        <button
          onClick={() => navigate("/setting")}
          className="
            w-full
            text-left
            px-4 py-3
            rounded-lg
            hover:text-violet-500
            hover:bg-violet-100
            dark:hover:bg-violet-900/30
            dark:hover:text-violet-400
            transition-colors duration-200
          "
        >
          <div className="flex gap-3 items-center">
            <IoMdSettings className="size-5" />
            Settings
          </div>
        </button>

      </nav>

    </div>
  );
};