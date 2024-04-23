/* eslint-disable */
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
// This function is to handle the sidebar on the left side of the page
export function Sidebar() {
    return (
        <div className="h-full w-1/6 fixed overflow-auto bg-[#008080]">
                <div className='pt-48 flex justify-center'>
                <Link href="/#pricing">
                    <span className="text-2xl text-white">Pricing</span>
                </Link>
            </div>
            <div className='pt-12 flex justify-center'>
                <Link href="/#about">
                    <span className="text-2xl text-white">About Us</span>
                </Link>
            </div>
            <div className='pt-12 flex justify-center'>
                <Link href="/#privacy">
                    <span className="text-2xl text-white">Privacy</span>
                </Link>
            </div>
            <div className='pt-12 flex justify-center'>
                <Image
                    src="/Logo.jpg"
                    height={700}
                    width={300}
                    alt="Description of the image"
                    sizes="(max-width: 300px) 100vw"
                />
            </div>
            <div className="flex justify-center pt-12 pb-12">
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