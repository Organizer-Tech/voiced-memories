'use client'
//Libraries and components needed
import React, { useState, useContext, useEffect } from 'react'
import { Button } from '@/components/primitives/Button'
import { TileSpinner } from '@/components/primitives/TileSpinner.tsx/TileSpinner'
import { AuthLayout } from '@/components/pages/AuthLayout'
import { useRouter } from 'next/navigation'
//Logging out the user through AWS
import { AccountContext } from '@/components/utils/Account'

//pageRouter determines where pages should be navigated to
const pageRouter = useRouter();

const removeContent = () => {} //Show a page for removing content(similar to removing photos from gallery)
const addContent = () => {} //Show a page for adding content(similar to current gallery)
const logOut = () => {}


export function ViewClients(){
    const currPerson = useState("");
    //Person {num} will be replaced once the functionality for accessing clients
    //is implemented. Currently being used as a placeholder
    //Will also be buttons instead of divs
    return(
        <div> 
            <h1 className="justify-center text-center text-5xl">Manage Clients</h1>
            <h1 className='text-3xl'>Your Current Clients:</h1>

            <div className='flex flex-row'>
                <div className='flex flex-col w-min'> 
                    <div className='rounded-md hover:bg-slate-500 w-52 border text-center'>Person 1 Name</div>
                    <div className='rounded-md my-3 hover:bg-slate-500 w-52 border text-center'>Person 2 Name</div>
                    <div className='rounded-md hover:bg-slate-500 w-52 border text-center'>Person 3 Name</div>
                    <div className='rounded-md my-3 hover:bg-slate-500 w-52 border text-center'>Person 4 Name</div>
                    <div className='rounded-md my-3 hover:bg-slate-500 w-52 border text-center'>Person 5 Name</div>
                </div>

                <div className='flex flex-col flex-grow'>
                    <h1 className='text-center text-xl underline'>Manage settings for {"currPerson"}</h1>
                    <button className="mt-5 rounded-md w-1/2 mx-auto hover:bg-slate-500 border">Upload Photos/Audio</button>
                </div>
            </div>

            <div className = "flex justify-center text-center pb-10">
                <div className="justify-between flex pr-4">
                    <Button size = "xl" 
                            className="text-3xl hover:text-gray-400 text-black border border-black "
                            onClick={() => pageRouter.push('/auth/main')}
                    >Home
                    </Button>
                </div>

                <div className="justify-between flex pr-4">
                    <Button size = "xl" 
                            className="text-3xl hover:text-gray-400 text-black border border-black "
                            onClick={() => pageRouter.push('/AccountLogin')} //page.tsx
                    >Logout
                    </Button>
                </div>
            </div>
        </div>
    )
   
}
