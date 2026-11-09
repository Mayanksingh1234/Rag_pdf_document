import React,{useState} from 'react'
import { LuCirclePlus } from "react-icons/lu";
import { IoHomeOutline } from "react-icons/io5";
import { IoDocumentTextOutline } from "react-icons/io5";
import { RiChatSmile3Line } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import { SiFormbricks } from "react-icons/si";
import { useNavigate } from "react-router-dom";
export const Left_component = () => {
  const [open,setOpen] =useState(false);
  const navigate = useNavigate();
  return (
    <>
    <div className='md:hidden p-2 shadow block'>
      <button onClick={()=>setOpen(true)}>
        <SiFormbricks className='size-6 text-violet-500'/>
      </button>
    </div>
    {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}



    <div
  className={`
    fixed md:static top-0 left-0 z-50
    h-screen w-64
    bg-white dark:bg-gray-900
    text-black dark:text-white
    transform transition-transform duration-500
    ${open ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
  `}
>
  <aside className="h-screen w-full text-md text-black dark:text-white p-5">

    <nav className="space-y-1">

      {/* New Chat */}

      {/* Dashboard */}
      <button
        onClick={() => navigate("/")}
        className="w-full text-left px-4 py-3 hover:text-violet-500 transition hover:bg-violet-100 rounded-lg"
      >
        <div className="flex gap-3 items-center">
          <IoHomeOutline className="size-5" />
          Home
        </div>
      </button>

      {/* Documents */}
      <button
        onClick={() => navigate("/documents")}
        className="w-full text-left px-4 py-3 hover:text-violet-500 transition hover:bg-violet-100 rounded-lg"
      >
        <div className="flex gap-3 items-center">
          <IoDocumentTextOutline className="size-5" />
          Documents
        </div>
      </button>

      {/* Settings */}
      <button onClick={()=>navigate("/setting")}
        className="w-full text-left px-4 py-3 hover:text-violet-500 transition hover:bg-violet-100 rounded-lg"
      >
        <div className="flex gap-3 items-center">
          <IoMdSettings className="size-5" />
          Settings
        </div>
      </button>

    </nav>

  </aside>
</div>
    </>
  )
}
