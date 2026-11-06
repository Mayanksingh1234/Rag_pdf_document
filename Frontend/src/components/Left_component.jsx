import React,{useState} from 'react'
import { LuCirclePlus } from "react-icons/lu";
import { IoHomeOutline } from "react-icons/io5";
import { IoDocumentTextOutline } from "react-icons/io5";
import { RiChatSmile3Line } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import { SiFormbricks } from "react-icons/si";
export const Left_component = () => {
  const [open,setOpen] =useState(false);
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



    <div className={`
          fixed md:static top-0 left-0 z-50
          h-screen w-64 bg-white dark:bg-gray-900
          text-black dark:text-white p-5
          transform transition-transform duration-500
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}>
        <aside className="w-50 text-black dark:text-white flex flex-col p-5">

        <nav className="space-y-2">
          <button className="w-full text-left px-4 py-2 hover:text-violet-500 transition hover:bg-violet-100 p-2 rounded-lg">
            <div className='flex gap-2 items-center '>

           <LuCirclePlus className="hover:text-violet-500 size-4 lg:size-5 md:size-3 "/>New Chat
            </div>
          </button>
          
          <button className="w-full text-left px-4 py-2  hover:text-violet-500 transition hover:bg-violet-100 p-2 rounded-lg">
           <div className='flex gap-2 items-center'>

           <IoHomeOutline className="hover:text-violet-500 size-4 lg:size-5 md:size-3 "/>Dashboard
            </div>
          </button>

          <button className="w-full text-left px-4 py-2  hover:text-violet-500 transition hover:bg-violet-100 p-2 rounded-lg">
           <div className='flex gap-2 items-center'>

           <IoDocumentTextOutline className="hover:text-violet-500 size-4 lg:size-5 md:size-3 "/>Documents
            </div>
          </button>

          <button className="w-full text-left px-4 py-2  hover:text-violet-500 transition hover:bg-violet-100 p-2 rounded-lg">
           <div className='flex gap-2 items-center'>

           <RiChatSmile3Line className="hover:text-violet-500 size-4 lg:size-5 md:size-3 "/>Chats
            </div>
            
          </button>

          <button className="w-full text-left px-4 py-2  hover:text-violet-500 transition hover:bg-violet-100 p-2 rounded-lg">
           <div className='flex gap-2 items-center'>

           <IoMdSettings  className="hover:text-violet-500 size-4 lg:size-5 md:size-3 "/>Settings
            </div>
          </button>
        </nav>
      </aside>
    </div>
    </>
  )
}
