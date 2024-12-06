'use client'

import React, { useState, useContext, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/primitives/Button'
import { Card } from '@/components/primitives/Card'
import { Container } from '../../Container'
import { AccountContext } from '@/components/utils/Account'
import { useRouter } from 'next/navigation'
import { TileSpinner } from '@/components/primitives/TileSpinner.tsx/TileSpinner'
import PolaroidGallery from '@/components/primitives/PolaroidGallery'
export function Main() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { getSession, logout } = useContext(AccountContext)
  const router = useRouter()
  useEffect(() => {
    getSession().then((session) => {
      setLoggedIn(true)
    })
  }, [])

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
        setLoggedIn(true)
        
      })
      .catch((error) => {
        // Redirect if not logged in
        if (typeof window !== 'undefined') {
          window.location.href = '/'
        }
      })
  }, [])

  //tile spinner while loading
  if (!loggedIn) {
    return <TileSpinner />
  }
  // code for fixing issue
  //Code fix for issue
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight
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
      {/* sets and displays the navigation buttons as polaroid gallery */}
      <div className="ml-[12%] flex flex-grow items-center pb-[25%]">
        {screenWidth > 600 && (
          <PolaroidGallery
            buttons={[
              {
                name: 'Create Gallery',
                size: screenWidth * 0.16,
                link: '/auth/main/createGallery',
                imageSize: 200,
                className: '-rotate-10',
              },
              {
                name: 'Edit Galleries',
                size: screenWidth * 0.16,
                link: '/auth/main/userGallery',
                imageSize: 400,
                className: 'rotate-10',
              },
              {
                name: 'View Galleries',
                size: screenWidth * 0.16,
                link: '/auth/main/viewGallery',
                imageSize: 250,
                className: 'rotate-0',
              },
              {
                name: 'Settings',
                size: screenWidth * 0.16,
                link: '/auth/main/settings#general',
                imageSize: 350,
                className: 'rotate-20',
              },
            ]}
            textSize="text-2xl"
          />
        )}
        {/* adjusts for smaller screens */}
        {screenWidth <= 600 && (
          <>
            <div className="item-center flex justify-between">
              <PolaroidGallery
                buttons={[
                  {
                    name: 'Create Gallery',
                    size: screenWidth * 0.18,
                    link: '/auth/main/createGallery',
                    imageSize: 200,
                    className: '-rotate-10',
                  },
                  {
                    name: 'Edit Galleries',
                    size: screenWidth * 0.18,
                    link: '/auth/main/userGallery',
                    imageSize: 400,
                    className: 'rotate-10',
                  },
                  {
                    name: 'View Galleries',
                    size: screenWidth * 0.18,
                    link: '/auth/main/viewGallery',
                    imageSize: 250,
                    className: 'rotate-0',
                  },
                  {
                    name: 'Settings',
                    size: screenWidth * 0.18,
                    link: '/auth/main/settings#general',
                    imageSize: 350,
                    className: 'rotate-20',
                  },
                ]}
                textSize={'text-1xl'}
              />
            </div>
          </>
        )}
      </div>
{/* login button */}
      <div className="pb-10 text-center">
        {loggedIn ? (
          <Button
            size="xl"
            className="text-3xl text-white hover:text-gray-200"
            onClick={handleLogout}
            color="gold" variant="outline" 
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
export default Main
