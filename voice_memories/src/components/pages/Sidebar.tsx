/* eslint-disable */
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
// This function is to handle the sidebar on the left side of the page
export function Sidebar() {
    return (
        <div className="h-dvh w-1/6 fixed overflow-auto bg-[#008080] flex flex-col justify-between items-center">
               
               <div className="flex flex-col gap-8 mt-48">
                <Link href="/#pricing">
                    <span className="text-2xl text-white">Pricing</span>
                </Link>
          
                <Link href="/#about">
                    <span className="text-2xl text-white">About Us</span>
                </Link>
                <Link href="/#privacy">
                    <span className="text-2xl text-white">Privacy</span>
                </Link>
            </div>
                <div  className="w-[1/6vw] h-[1/6vw]">
                <Image
                    src="/voiced_memories_logo_green_bg.png"
                    alt="Description of the image"
                    className="w-full h-full object-contain"
                    
                    height={300}
                    width={300}
                    // sizes="(max-width: 300px) 100vw"
                />
            </div>
            <div className="mb-12">
                <Link href='https://www.photocollections.ca/'>
                <Image
                    src="/PhotoCollections_LQ.jpg"
                    height={700}
                    width={300}
                    alt="Description of the image"
                    sizes="(max-width: 300px) 100vw"
                />
                </Link>
            </div>

        </div>
    )
}