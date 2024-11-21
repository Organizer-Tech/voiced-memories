'use client'

import React, { useState, useContext, useEffect } from 'react'
import { Button } from '@/components/primitives/Button'
import { AccountContext } from '@/components/utils/Account'
import { useRouter } from 'next/navigation'
import { TileSpinner } from '@/components/primitives/TileSpinner.tsx/TileSpinner'
import { CognitoUserSession } from 'amazon-cognito-identity-js'
import AsyncPolaroidGallery from '@/components/primitives/PolaroidGallery/AsyncPolaroidGallery'
import {
  getOrder,
} from '@/components/utils/WixMembers'
import {
  getPlanDetails,
  WixPlanID,
  WixPlanDetails,
} from '@/components/utils/WixPlans'
export function ViewGallery() {
  // loggedIn is a boolean that is set to true if the user is logged in
  const [loggedIn, setLoggedIn] = useState(false)
  // logout is a function that logs the user out
  const { logout } = useContext(AccountContext)
  // router is a hook that allows for navigation between pages
  const router = useRouter()
  // session is a state variable that stores the user's session
  const [session, setSession] = useState<CognitoUserSession>()
  // wixPlan is a state variable that stores the user's Wix plan details
  const [wixPlan, setWixPlan] = useState<WixPlanDetails>(null)
  // getSession is a function that gets the user's session
  // getWixOrderId is a function that gets the user's Wix order ID used for fetching the user's plan details
  const {
    getSession,
    getWixOrderId,

  } = useContext(AccountContext)
  // handleLogout is a function that logs the user out and redirects them to the home page
  const handleLogout = () => {
    console.log('Logging out')
    logout()
    sessionStorage.removeItem('FullName')
    sessionStorage.removeItem('Email')
    router.push('/')
  }
// useEffect is a hook that runs once when the component is mounted
  useEffect(() => {
    getSession()
      .then((session) => {
        setSession(session)
        // if session is found, set loggedIn to true and get the user's plan details

        const payload = session.getIdToken().payload
        const name = payload.given_name + ' ' + payload.family_name
        setLoggedIn(true)
        getWixOrderId().then((orderId) => {
          if (!orderId) {
            return
          }
          // get the user's order details
          getOrder(orderId).then((order) => {
            if (!order) {
              return
            }
            // get the user's plan details
            const planDetails = getPlanDetails(order.planId as WixPlanID)
            setWixPlan(planDetails)
          })
        })
      })
      // if session is not found, redirect to home page
      .catch((error) => {
        if (typeof window !== 'undefined') {
          window.location.href = '/' 
        }
      })
  }, [])
  const tier = wixPlan?.tier || 'free';
// sets loading spinner while session is being fetched
  if (!session ) {
    return (
    <>
      <TileSpinner />

      <div className="pb-10 text-center flex justify-center">
        <div className="flex justify-between pr-4">
          <Button
            size="xl"
            className="text-3xl text-white hover:text-gray-200"
            color="gold" variant="outline" 
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
    </>
    )
  }

  
//style for the gallery not going to go into detail
  return (
<>

    <div
      className="flex h-screen flex-col"
      style={{
        backgroundImage: "url('https://wallpapercave.com/wp/wp8522376.jpg')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      {/* if user is on free tier, show message */}
      {wixPlan?.tier === 'free' && (
        <div className="fixed top-0 left-0 right-0 z-50 p-4 bg-black bg-opacity-70 text-white text-center">
          <p>
            You may only view 1 album while on the free tier. Please
            upgrade to the premium tier to view more albums.
          </p>
        </div>
      )}
      <div className="ml-[1%] flex flex-grow items-center pb-[25%]">
        <div className="item-center flex justify-between">
          <AsyncPolaroidGallery
            session={session}
            tier={tier}
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
      color="gold" variant="outline" 
      className="text-3xl text-white hover:text-gray-200"
      onClick={() => router.push('/auth/main')}
    >
      Home
    </Button>
    </div>
    {/* if logged in shows logout button */}
        {loggedIn ? (
          <Button
            size="xl"
            className="text-3xl text-white hover:text-gray-200"
            color="gold" variant="outline" 
            onClick={handleLogout}
          >
            Log Out
          </Button>
        ) : (
          'Please sign in'
        )}
      </div>
    </div>
    
</>
  )
}

export default ViewGallery
