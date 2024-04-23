'use client'

import React, { useState, useContext, useEffect } from 'react'
import { Button } from '@/components/primitives/Button'
import { AccountContext } from '@/components/utils/Account'
import { useRouter } from 'next/navigation'
import { TileSpinner } from '@/components/primitives/TileSpinner.tsx/TileSpinner'
import PolaroidGallery from '@/components/primitives/PolaroidGallery'
import { CognitoUserSession } from 'amazon-cognito-identity-js'
import { getAllUrls, getPhoto } from '@/components/utils/apiFunctions'
import ViewGallery_Page from '@/app/(auth)/auth/main/viewGallery/page'
import AsyncEditPolaroidGallery from '@/components/primitives/PolaroidGallery/AsyncEditPolaroidGallery'
export function UserGallery() {
    const [loggedIn, setLoggedIn] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const { getSession, logout } = useContext(AccountContext)
    const router = useRouter()
    const [session, setSession] = useState<CognitoUserSession>()

    const handleLogout = () => {
        console.log('Logging out')
        logout()
        sessionStorage.removeItem('FullName')
        sessionStorage.removeItem('Email')
        router.push('/')
    }

    useEffect(() => {
        getSession()
            .then((session) => {
                setSession(session)
                setLoggedIn(true)
            })
            .catch((error) => {
                if (typeof window !== 'undefined') {
                    window.location.href = '/'
                }
            })
    }, [])

    if (!session) {
        return <TileSpinner />
    }


    return (

        <div
            className="flex h-screen flex-col"
            style={{
                backgroundImage: "url('https://wallpapercave.com/wp/wp8522376.jpg')",
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
            }}
        >
      <div className="ml-[1%] flex flex-grow items-center pb-[25%]">
        <div className="item-center flex justify-between">
                    <AsyncEditPolaroidGallery
                        session={session}
                        size={window.innerWidth * 0.08}
                        imageSize={150}
                        className={'rotate-10'}
                        textSize={'text-1x1'}
                    />
                </div>
            </div>

            <div className="pb-10 text-center flex justify-center">
                <div className="flex justify-between pr-4">
                    <Button
                        size="xl"
                        className="text-3xl text-white hover:text-gray-200"
                        onClick={() => router.push('/auth/main')}
                    >
                        Home
                    </Button>
                </div>
                {loggedIn ? (
                    <Button
                        size="xl"
                        className="text-3xl text-white hover:text-gray-200"
                        onClick={handleLogout}
                    >
                        Log Out
                    </Button>
                ) : (
                    'Please sign in'
                )}
            </div>
        </div>
    )
}

export default UserGallery