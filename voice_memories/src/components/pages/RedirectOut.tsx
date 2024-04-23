'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { getBrowserWixClient } from '../utils/WixClient.browser'
import { planCheckout } from '../utils/WixCheckout'
import { useContext, useEffect, useState } from 'react'
import { TileSpinner } from '@/components/primitives/TileSpinner.tsx/TileSpinner'
import { AccountContext } from '../utils/Account'
import {
  getOrdersByMember,
  getMemberByEmail,
  cancelMembership,
  getOrder,
} from '../utils/WixMembers'
import { orders } from '@wix/pricing-plans'
import { WixPlanID } from '../utils/WixPlans'

export default function RedirectOutPage() {
  // Get planId from URL query params
  const searchParams = useSearchParams()
  const planId = searchParams.get('planId')

  // Set up Wix client, context, router and states
  const wixClient = getBrowserWixClient()
  const { getSession, getUserAttributes, updateUserAttribute } =
    useContext(AccountContext)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<orders.Order[]>([])

  useEffect(() => {
    // Check if user is logged in
    getSession()
      .then(() => {
        // Check if user has existing orders
        checkWixOrders().then((orders) => {
          if (orders.length > 0) {
            setOrders(orders)
          }
          // Set loading to false
          setLoading(false)
        })
      })
      .catch(() => {
        // Redirect to login page if user is not logged in
        router.push(`/AccountLogin?planId=${planId}`)
        return
      })
  }, [])

  /**
   * Checks if user has existing orders in Wix.
   * @returns Array of orders
   */
  async function checkWixOrders(): Promise<orders.Order[]> {
    const userAttributes = await getUserAttributes() // Get user attributes from Cognito
    // Check if user has a Wix order ID and get the order if it exists
    if (userAttributes.wixOrderId) {
      return [await getOrder(userAttributes.wixOrderId)]
    }
    // Check if user has a Wix member ID and get orders by member ID
    let memberId = userAttributes.wixMemberId
    if (!memberId && userAttributes.wixEmail) {
      memberId = (await getMemberByEmail(userAttributes.wixEmail))._id
    }
    if (memberId) {
      return await getOrdersByMember(memberId)
    }
    return []
  }

  /**
   * Handles the click event for the Continue to Wix Checkout button.
   */
  async function handleClick() {
    if (loading) return // Prevent multiple clicks
    setLoading(true) // Set loading to true to trigger spinner

    // Make sure planId is not null
    if (!planId) {
      router.push('/PlanSelect')
      return
    }
    // Cancel existing plans if they exist
    for (const order of orders) {
      // Determine tier based on plan ID
      let tier = null
      if (order.planId == WixPlanID.STARTER) {
        tier = 'free'
      } else if (
        order.planId == WixPlanID.ANNUAL ||
        order.planId == WixPlanID.MONTHLY
      ) {
        tier = 'premium'
      }
      // Cancel membership
      try {
        await cancelMembership(order._id, tier)
        // Clear user attributes
        updateUserAttribute('custom:wixMemberId', '')
        updateUserAttribute('custom:wixOrderId', '')
        updateUserAttribute('custom:memberTier', '')
      } catch (err) {
        let message = 'Unknown error'
        if (err instanceof Error) message = err.message
        console.log(`Error cancelling membership:\n${message}`)
        alert(`Could not cancel existing plan. Please try again.`)
        setLoading(false)
        return
      }
    }
    // Redirect to Wix checkout
    planCheckout(wixClient, planId)
  }
  // Show spinner while loading
  if (loading) {
    return <TileSpinner />
  }
  // Render page content
  return (
    <>
      <div
        id="redirectOut"
        className="bg-teal pb-5 pl-8 pt-5 text-xl font-semibold text-gray-300"
      >
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
              You will be redirected to Wix for checkout
            </h1>
            <p className="py-5 text-xl leading-normal text-gray-500 lg:text-xl xl:text-2xl dark:text-gray-300">
              Subscriptions and billing for Voiced Memories are managed by Wix.
              You will be redirected to a checkout page. Please continue from that
              page to complete your purchase.
            </p>
            {orders.length > 0 && (
              <h2 className="text-xl font-bold leading-snug tracking-tight text-red-500 lg:text-xl lg:leading-tight xl:text-2xl xl:leading-tight">
                Your existing plan will be cancelled and replaced with the plan
                chosen here
              </h2>
            )}

            <div className="flex flex-col items-start space-y-3 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
              <a
                onClick={handleClick}
                className="cursor-pointer rounded-md bg-maroon px-8 py-4 text-center text-lg font-medium text-white "
              >
                Continue to Wix Checkout
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
