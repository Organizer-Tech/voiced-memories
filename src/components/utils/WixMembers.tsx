'use server'

import { createClient, OAuthStrategy } from '@wix/sdk'
import { redirects } from '@wix/redirects'
import { members } from '@wix/members'
import { WixPlanID } from './WixPlans'
import { WixClientType } from './WixClient.base'
import {
  CancellationEffectiveAt,
  OrderStatus,
} from '@wix/pricing-plans/build/cjs/src/pricing-plans-v2-order.universal'
import { Set } from '@wix/members/build/cjs/src/members-v1-member.universal'
import { getWixManagementClient } from './WixClient.server'


/**
 * Check if member is logged into Wix and get member details.
 * @param wixClient - Wix client instance.
 * @returns Member details
 */
export async function getMember(wixClient: WixClientType) {
  let member: members.Member | null = null
  if (wixClient!.auth.loggedIn()) {
    member = (await wixClient!.members.getCurrentMember()).member || null
  }
  return member
}

/**
 * Get the order details by order ID.
 * @param orderId - Order ID
 * @returns Order details
 */
export async function getOrder(orderId: string) {
  const wixManagementClient = await getWixManagementClient()
  try {
    const orderResponse =
      await wixManagementClient?.orders.managementGetOrder(orderId)
    return orderResponse?.order
  } catch (err) {
    let message = 'Unknown error'
    if (err instanceof Error) message = err.message
    console.log(`Error getting order:\n${message}`)
    return null
  }
}

/**
 * Get the member tier based on the order ID.
 * @param orderId - Order ID
 * @returns Member tier
 */
export async function getMemberTier(orderId: string) {
  const order = await getOrder(orderId)
  if (!order) {
    return null
  }
  const planId = order.planId
  if (planId == WixPlanID.STARTER) {
    return 'free'
  } else if (planId == WixPlanID.ANNUAL || planId == WixPlanID.MONTHLY) {
    return 'premium'
  }
  return null
}

/**
 * Cancel the membership based on the order ID and tier.
 * @param orderId - Order ID
 * @param tier - Member tier
 */
export async function cancelMembership(
  orderId: string,
  tier: string | null = '',
) {
  const wixManagementClient = await getWixManagementClient()
  await wixManagementClient?.orders.cancelOrder(
    orderId,
    tier == 'free'
      ? CancellationEffectiveAt.IMMEDIATELY
      : CancellationEffectiveAt.NEXT_PAYMENT_DATE,
  )
}

/**
 * Get member details by member ID.
 * @param memberId - Member ID
 * @returns Member details
 */
export async function getMemberById(memberId: string) {
  const wixManagementClient = await getWixManagementClient()
  try {
    const member = await wixManagementClient?.members.getMember(memberId, {
      fieldSet: Set.FULL,
    }) // Set.FULL returns all fields
    return member
  } catch (err) {
    let message = 'Unknown error'
    if (err instanceof Error) message = err.message
    console.log(`Error getting member by ID:\n${message}`)
    return null
  }
}

/**
 * Get the member email by member ID.
 * @param memberId - Member ID
 * @returns Member email
 */
export async function getEmailByMember(memberId: string) {
  const member = await getMemberById(memberId)
  return member.loginEmail
}

/**
 * Get member details by email.
 * @param email - Member email
 * @returns Member details
 */
export async function getMemberByEmail(email: string) {
  const wixManagementClient = await getWixManagementClient()
  try {
    const members = await wixManagementClient.members
      .queryMembers({
        fieldSet: Set.FULL,
      })
      .eq('loginEmail', email)
      .find()
    if (members.length > 0) {
      return members.items[0]
    }
    return null
  } catch (err) {
    let message = 'Unknown error'
    if (err instanceof Error) message = err.message
    console.log(`Error getting member by email:\n${message}`)
    return null
  }
}

/**
 * Get the orders by member ID.
 * @param memberId - Member ID
 * @returns Array of orders
 */
export async function getOrdersByMember(memberId: string) {
  const wixManagementClient = await getWixManagementClient()
  try {
    // Get all orders by member ID
    const orderResponse = await wixManagementClient.orders.managementListOrders(
      {
        buyerIds: [memberId],
      },
    )
    // Filter active orders outside of query because the API is currently broken
    if (orderResponse.orders.length > 0) {
      const orders = orderResponse.orders.filter(
        (order) => order.status == OrderStatus.ACTIVE,
      )
      return orders
    }
    // Return empty array if no orders found
    return []
  } catch (err) {
    let message = 'Unknown error'
    if (err instanceof Error) message = err.message
    console.log(`Error getting member orders:\n${message}`)
    return []
  }
}

/**
 * Get the member ID by order ID.
 * @param orderId - Order ID
 * @returns Member ID
 */
export async function getMemberByOrderId(orderId: string) {
  const order = await getOrder(orderId)
  if (!order) {
    return null
  }
  return order.buyer?.memberId
}
