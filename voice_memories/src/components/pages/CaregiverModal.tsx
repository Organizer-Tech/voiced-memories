import { useState } from "react";


export function CareGiverModel(){
    return (
        <div>
            <div className="flex h-screen flex-col items-center">
                <h1 className="bold text-center text-3xl">Managing Content For Person 1</h1>
                <br />
                <div className="flex flex-row justify-center overflow-x-auto border-2 border-blue-300">
                    <div className="px-2">
                        <button className="border-2 border-yellow-400">
                            <img src="" alt="Photo uploaded" />
                        </button>
                    </div>
                    <div className="px-2">
                        <button className="border-2 border-yellow-400">
                            <img src="" alt="Photo uploaded" />
                        </button>
                    </div>
                    <div className="px-2">
                        <button className="border-2 border-yellow-400">
                            <img src="" alt="Photo uploaded" />
                        </button>
                    </div>
                    <div className="px-2">
                        <button className="border-2 border-yellow-400">
                            <img src="" alt="Photo uploaded" />
                        </button>
                    </div>
                    <div className="px-2">
                        <button className="border-2 border-yellow-400">
                            <img src="" alt="Photo uploaded" />
                        </button>
                    </div>
                    <div className="px-2">
                        <button className="border-2 border-yellow-400">
                            <img src="" alt="Photo uploaded" />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <h1 className="bold text-xl">Choose an Album to upload the Photos too:</h1>
                    <div className="flex max-h-52 w-80 flex-col items-center overflow-y-auto rounded-md border-2 border-gray-400">
                        <button className="my-1 w-1/2 rounded-md border-2 border-yellow-400 bg-black p-2 text-white hover:bg-slate-500">
                            Christmas 04
                        </button>
                        <button className="my-1 w-1/2 rounded-md border-2 border-yellow-400 bg-black p-2 text-white hover:bg-slate-500">
                            New Years 21
                        </button>
                        <button className="my-1 w-1/2 rounded-md border-2 border-yellow-400 bg-black p-2 text-white hover:bg-slate-500">
                            Thanksgiving 87
                        </button>
                        <button className="my-1 w-1/2 rounded-md border-2 border-yellow-400 bg-black p-2 text-white hover:bg-slate-500">
                            Birthday Party
                        </button>
                        <button className="my-1 w-1/2 rounded-md border-2 border-yellow-400 bg-black p-2 text-white hover:bg-slate-500">
                            Birthday Party 2002
                        </button>
                        <button className="my-1 w-1/2 rounded-md border-2 border-yellow-400 bg-black p-2 text-white hover:bg-slate-500">
                            Halloween
                        </button>
                        <button className="my-1 w-1/2 rounded-md border-2 border-yellow-400 bg-black p-2 text-white hover:bg-slate-500">
                            Thanksgiving 87
                        </button>
                    </div>
                </div>
                <div className="mt-12 flex h-1/4 flex-col items-center">
                    <div className="mb-1">
                        <button className="w-52 rounded-md border-2 border-yellow-400 bg-black py-2 text-white hover:bg-slate-500">
                            Upload Photos
                        </button>
                        <button className="w-52 rounded-md border-2 border-yellow-400 bg-black py-2 text-white hover:bg-slate-500">
                            Upload PDF Documents
                        </button>
                    </div>
                    <button className="w-52 rounded-md border-2 border-yellow-400 bg-black py-2 text-white hover:bg-slate-500">Upload Voice Recording</button>
                </div>

                <div className="flex justify-center pb-10 text-center">
                    <div className="flex justify-between pr-4">
                        <button className="rounded-md border-2 border-yellow-400 bg-black text-3xl text-white hover:bg-slate-400 hover:text-black">
                            Home
                        </button>
                    </div>
                    <div className="flex justify-between pr-4">
                        <button className="hover:text-blackrounded-md border-2 border-yellow-400 bg-black text-3xl text-white hover:bg-slate-400">
                            Logout
                        </button>
                    </div>
                </div>

            </div>
        </div>
)


}

