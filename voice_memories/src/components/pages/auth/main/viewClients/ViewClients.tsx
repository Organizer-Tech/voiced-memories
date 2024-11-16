'use client'
//Libraries and components needed
import React, { useState, useContext, useEffect } from 'react'
import { Button } from '@/components/primitives/Button'
import { TileSpinner } from '@/components/primitives/TileSpinner.tsx/TileSpinner'
import { AuthLayout } from '@/components/pages/AuthLayout'
import { useRouter } from 'next/navigation'
import { CareGiverModel } from '@/components/pages/CaregiverModal'

//Logging out the user through AWS
import { AccountContext } from '@/components/utils/Account'

const removeContent = () => {} //Show a page for removing content(similar to removing photos from gallery)
const addContent = () => {} //Show a page for adding content(similar to current gallery)

export function ViewClients(){
    const currPerson = useState("");
    //pageRouter determines where pages should be navigated to
    const pageRouter = useRouter();
    const {logout } = useContext(AccountContext)

    const [isUploading, setIsUploading] = useState(false);

    function setLoading(enable){
        //Prevent doing a re-render of the Client Model Component
        if(!isUploading && !enable){
            return;
        }
        setIsUploading(enable);
    }


    const logOutUser = () => {
        logout();
        //Remove the user name and email from the current session
        sessionStorage.removeItem('FullName');
        sessionStorage.removeItem('Email');
        //Route back to login page
        pageRouter.push('/AccountLogin');
    }

    //If images begin to push the client component modal change overflow-y-hidden to the y-scroll instead
    return(
        <div className = "flex h-screen flex-col overflow-y-hidden"
        style={{
            backgroundImage: "url('https://wallpapercave.com/wp/wp8522376.jpg')",
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center', 
        }}> 
            <h1 className="border border-black font-bold bg-opacity-70 justify-center bg-primaryLightBlue rounded-md text-center text-4xl">Manage Clients</h1>
            <div className='flex flex-row flex-auto flex-wrap'>
                <div className='flex flex-col w-min border-4 border-primaryBlue rounded-md overflow-y-auto max-h-96 bg-primaryDarkGray'> 
                    <h1 className='text-xl text-center font-bold'>Your Clients:</h1>
                    <button className='w-52 rounded-md border-2 text-center border-gold 
                    hover:bg-primaryGray hover:text-black bg-black text-white' onClick={() => setLoading(false)} >Person 1 Name</button>
                    <button className='my-3 w-52 rounded-md border-2 text-center border-gold 
                    hover:bg-primaryGray hover:text-black bg-black text-white' onClick={() => setLoading(false)}>Person 2 Name</button>
                    <button className='w-52 rounded-md border-2 text-center border-gold 
                    hover:bg-primaryGray hover:text-black bg-black text-white' onClick={() => setLoading(false)}>Person 3 Name</button>
                    <button className='my-3 w-52 rounded-md border-2 text-center border-gold 
                    hover:bg-primaryGray hover:text-black bg-black text-white' onClick={() => setLoading(false)}>Person 4 Name</button>
                    <button className='w-52 rounded-md border-2 text-center border-gold 
                    hover:bg-primaryGray hover:text-black bg-black text-white' onClick={() => setLoading(false)}>Person 5 Name</button>
                    <button className='my-3 w-52 rounded-md border-2 text-center border-gold
                    hover:bg-primaryGray hover:text-black bg-black text-white' onClick={() => setLoading(false)}>Person 6 Name</button>
                    <button className='w-52 rounded-md border-2 text-center border-gold 
                    hover:bg-primaryGray hover:text-black bg-black text-white' onClick={() => setLoading(false)}>Person 7 Name</button>
                    <button className='my-3 w-52 rounded-md border-2 text-center border-gold
                    hover:bg-primaryGray hover:text-black bg-black text-white' onClick={() => setLoading(false)}>Placeholder Name</button>

                    <button className='w-52 rounded-md border-2 text-center border-gold
                    hover:bg-primaryGray hover:text-black bg-black text-white' onClick={() => setLoading(false)}>Person 8 Name</button>
                    <button className='my-3 w-52 rounded-md border-2 text-center border-gold
                    hover:bg-primaryGray hover:text-black bg-black text-white' onClick={() => setLoading(false)}>Person 9 Name</button>
                    <button className='w-52 rounded-md border-2 text-center border-gold
                    hover:bg-primaryGray hover:text-black bg-black text-white' onClick={() => setLoading(false)}>Person 10 Name</button>  
                </div>

                <div className='flex flex-col flex-grow max-h-96 bg-primaryBlue bg-opacity-85 rounded-md'>
                    {!isUploading ? 
                        <>
                            <h1 className='text-center text-xl underline font-bold'>Manage Settings for Person 1</h1>
                            <button className="mt-5 text-white rounded-md h-1/6 w-1/6 mx-auto hover:bg-primaryGray 
                            hover:text-black border-2 border-gold bg-black"
                            onClick={() => setLoading(true)}
                            >Upload Photos/Audio</button>
                        </>
                    :
                        <CareGiverModel pageRouter={pageRouter}></CareGiverModel>
                    }
                </div>
            </div>

            {!isUploading &&
                <div className = "flex justify-center text-center pb-10 ">
                    <div className="justify-between flex pr-4">
                        <Button size = "xl" 
                                className="text-3xl hover:text-primaryGray text-white border-2 border-gold "
                                onClick={() => pageRouter.push('/auth/main')} //point to main page with all items
                        >Home
                        </Button>
                    </div>

                    <div className="justify-between flex pr-4">
                        <Button size = "xl" 
                                className="text-3xl hover:text-primaryGray text-white border-2 border-gold "
                                onClick={logOutUser} //page.tsx Logout user here
                        >Logout
                        </Button>
                    </div>
                </div>
            }
        </div>
    )
   
}
