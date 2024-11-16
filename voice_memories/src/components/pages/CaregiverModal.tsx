import { useState } from "react";
import {useRouter} from "next/router";
import { AccountContext } from "../utils/Account";
import { useContext } from "react";

//Functions that will be needed to retrieve client photos and information
const getClientImages = () => {
}
const uploadPhoto = () => {
}
const uploadPDF = () =>{
}
const uploadVoiceRecording  = () =>{
}
const addPhotosToAlbum = () => {
}

export function CareGiverModel({pageRouter}){
    //Functions

    const { getSession, logout } = useContext(AccountContext);
    const logOutUser = () => {
        logout();
        //Remove from session Storage
        sessionStorage.removeItem('FullName');
        sessionStorage.removeItem('Email');
        //Route back to the LoginPage
        pageRouter.push("/AccountLogin");
    }

    return (
        <div className = "bg-primaryDarkGray border-2 border-black rounded-none h-screen">
            <div className="flex h-screen flex-col items-center">
                <h1 className="underline font-bold text-center text-2xl">Managing Content For Person 1</h1>
                <br />
                <div className="flex flex-row justify-center overflow-x-auto border-2 border-gold">
                    <div className="px-2">
                        <button className="border-2 border-gold">
                            <img src="" alt="Photo uploaded" />
                        </button>
                    </div>
                    <div className="px-2">
                        <button className="border-2 border-gold">
                            <img src="" alt="Photo uploaded" />
                        </button>
                    </div>
                    <div className="px-2">
                        <button className="border-2 border-gold">
                            <img src="" alt="Photo uploaded" />
                        </button>
                    </div>
                    <div className="px-2">
                        <button className="border-2 border-gold">
                            <img src="" alt="Photo uploaded" />
                        </button>
                    </div>
                    <div className="px-2">
                        <button className="border-2 border-gold">
                            <img src="" alt="Photo uploaded" />
                        </button>
                    </div>
                    <div className="px-2">
                        <button className="border-2 border-gold">
                            <img src="" alt="Photo uploaded" />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <h1 className="font-bold text-xl">Choose an Album to upload the Photos too:</h1>
                    <div className="flex max-h-52 w-80 flex-col items-center overflow-y-auto rounded-md border-2 border-black">
                        <button className="my-1 w-1/2 rounded-md border-2 border-gold bg-black p-2 text-white hover:bg-slate-500">
                            Christmas 04
                        </button>
                        <button className="my-1 w-1/2 rounded-md border-2 border-gold bg-black p-2 text-white hover:bg-slate-500">
                            New Years 21
                        </button>
                        <button className="my-1 w-1/2 rounded-md border-2 border-gold bg-black p-2 text-white hover:bg-slate-500">
                            Thanksgiving 87
                        </button>
                        <button className="my-1 w-1/2 rounded-md border-2 border-gold bg-black p-2 text-white hover:bg-slate-500">
                            Birthday Party
                        </button>
                        <button className="my-1 w-1/2 rounded-md border-2 border-gold bg-black p-2 text-white hover:bg-slate-500">
                            Birthday Party 2002
                        </button>
                        <button className="my-1 w-1/2 rounded-md border-2 border-gold bg-black p-2 text-white hover:bg-slate-500">
                            Halloween
                        </button>
                        <button className="my-1 w-1/2 rounded-md border-2 border-gold bg-black p-2 text-white hover:bg-slate-500">
                            Thanksgiving 87
                        </button>
                    </div>
                </div>
                <div className="mt-12 flex h-1/4 flex-col items-center">
                    <div className="mb-1">
                        <button className="w-52 mr-2 rounded-md border-2 border-gold bg-black py-2 text-white hover:bg-slate-500">
                            Upload Photos
                        </button>
                        <button className="w-52 rounded-md border-2 border-gold bg-black py-2 text-white hover:bg-slate-500">
                            Upload PDF Documents
                        </button>
                    </div>
                    <button className="w-52 rounded-md border-2 border-gold bg-black py-2 text-white hover:bg-slate-500">Upload Voice Recording</button>
                </div>

                <div className = "flex justify-center text-center pb-10 ">
                    <div className="justify-between flex pr-4">
                        <button className="text-3xl w-52 h-16 rounded-md border-2 border-gold bg-black py-2 text-white hover:bg-slate-500" 
                            onClick={() => pageRouter.push('/auth/main')}>
                            Home
                        </button>
                    </div>
                <div className="justify-between flex pr-4">
                    <button className="text-3xl w-52 h-16 rounded-md border-2 border-gold bg-black py-2 text-white hover:bg-slate-500"
                        onClick={logOutUser}>
                        Logout
                    </button>
                </div>
            </div>
            </div>
        </div>

    )
}

