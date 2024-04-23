'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  getMemberTier,
  getMemberByOrderId,
  getEmailByMember,
} from '../utils/WixMembers'
import { useContext, useEffect, useState } from 'react'
import { AccountContext } from '../utils/Account'

export default function RedirectInPage() {
  // Get planOrderId from URL query params
  const searchParams = useSearchParams()
  const planOrderId = searchParams.get('planOrderId')
  // Set up context and states
  const { getSession, updateUserAttribute } = useContext(AccountContext)
  const [linkURL, setLinkURL] = useState('/AccountLogin')

  useEffect(() => {
    // Get user session
    getSession()
      .then((session) => {
        // Update user attributes with planOrderId, memberTier, memberId, and email
        if (planOrderId) {
          updateUserAttribute('custom:wixOrderId', planOrderId)
          getMemberTier(planOrderId).then((memberTier) => {
            if (memberTier) {
              updateUserAttribute('custom:memberTier', memberTier)
            }
          })
          getMemberByOrderId(planOrderId).then((memberId) => {
            if (memberId) {
              updateUserAttribute('custom:wixMemberId', memberId)
              getEmailByMember(memberId).then((email) => {
                updateUserAttribute('custom:wixEmail', email)
              })
            }
          })
        }
        // Set link URL to main page if user is logged in
        setLinkURL('/auth/main')
      })
      .catch(() => {
        // Set link URL to login page if user is not logged in
        setLinkURL(`/AccountLogin?orderId=${planOrderId}`)
      })
  }, [])

  // Render the page
  return (
    <>
      <div className="bg-teal pb-5 pl-8 pt-5 text-xl font-semibold text-cream">
        <Link href="/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          Home
        </Link>
      </div>
      <div className="container mx-auto flex flex-wrap bg-cream p-8 xl:px-0">
        <div className="flex w-full items-center lg:w-1/2">
          <div className="mb-8 max-w-2xl">
            <h1 className="text-4xl font-bold leading-snug tracking-tight text-gray-800 lg:text-4xl lg:leading-tight xl:text-6xl xl:leading-tight dark:text-white">
              Thank you for your purchase!
            </h1>
            <p className="py-5 text-xl leading-normal text-gray-500 lg:text-xl xl:text-2xl dark:text-gray-300">
              For your records, your order number is:
            </p>
            <p className="pb-5 text-xl font-bold leading-normal text-gray-500 lg:text-xl xl:text-2xl dark:text-gray-300">
              {planOrderId}
            </p>

            <div className="flex cursor-pointer flex-col items-start space-y-3 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
              <Link
                className="cursor-pointer rounded-md bg-maroon px-8 py-4 text-center text-lg font-medium text-cream"
                href={linkURL}
              >
                Continue to Voiced Memories
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
