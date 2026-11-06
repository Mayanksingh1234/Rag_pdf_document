import React from 'react'
import { IoChatbubbleEllipses } from "react-icons/io5";
import { CiDark } from "react-icons/ci";
import { MdPersonOutline } from "react-icons/md";
import { Link } from 'react-router';

export const Navbar = () => {
  return (
    <div className='flex justify-between items-center p-2 '>
        <div className='flex items-center gap-2'>

        <div className='bg-violet-500 p-2 rounded-xl'>

        <IoChatbubbleEllipses className='text-white size:4 md:size-6'/>
        </div>
        <h1 className='text-l md:text-xl font-bold'>PDF Assistant</h1>
        </div>

        <div className='flex items-center gap-5 md:gap-6 lg:gap-8'>
            <div  className='cursor-pointer'>

                <CiDark className='size-5 md:size-5 lg:size-7'/>
            </div>
            <div className='cursor-pointer'>

                <Link to='Signup' >
                    <MdPersonOutline className='size-6 md:size-7 lg:size-9 text-violet-500'>
                    </MdPersonOutline>
                    </Link>

            </div>

        </div>
    </div>
  )
}
