import { plans } from '@wix/pricing-plans'
import { WixClientType } from './WixClient.base'


/**
 * Plan checkout function to redirect to Wix checkout page
 * @param wixClient - Wix client instance
 * @param planId - Plan ID
 */
export async function planCheckout(wixClient: WixClientType, planId: string) {
  const activePlan = await getActivePlan(wixClient, planId)
  if (activePlan) {
    createRedirect(wixClient, activePlan)
  }
}

/**
 * Get the Wix plan based on plan ID from query parameter
 * @param wixClient - Wix client instance.
 * @param planId - Plan ID
 * @returns Wix plan
 */
export async function getActivePlan(wixClient: WixClientType, planId: string) {
  const planList = await wixClient!.plans
    .queryPublicPlans()
    .eq('_id', planId)
    .find()
  return planList.items[0]
}

/**
 * Create a redirect session for plan checkout
 * @param wixClient - Wix client instance
 * @param plan - Plan for checkout
 */
async function createRedirect(wixClient: WixClientType, plan: plans.Plan) {
  const redirect = await wixClient!.redirects.createRedirectSession({
    paidPlansCheckout: { planId: plan._id },
    callbacks: {
      postFlowUrl: process.env.NEXT_PUBLIC_WIX_POSTFLOW_URL,
      thankYouPageUrl: process.env.NEXT_PUBLIC_WIX_THANKYOU_URL,
    },
  })
  window.location.href = redirect.redirectSession!.fullUrl
}
