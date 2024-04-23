// Wix plan IDs
// Cannot be looked up in Wix, but can be retrieved from the Wix API
export enum WixPlanID {
  STARTER = '312ab361-f430-4467-a276-469ef31a3dc0',
  MONTHLY = 'bdda17c8-99b9-4389-9b2f-cd17aa443b03',
  ANNUAL = '382840ca-81c0-4e08-912c-c19911fa5717',
}

// Type to encapsulate Wix plan details
export type WixPlanDetails = {
  id: WixPlanID
  tier: string
  frequency: string | null
} | null

/**
 * Get the plan details based on the plan ID.
 * @param planId - Plan ID
 * @returns Plan details
 */
export function getPlanDetails(planId: WixPlanID) {
  switch (planId) {
    case WixPlanID.STARTER:
      return {
        id: WixPlanID.STARTER,
        tier: 'free',
        frequency: null,
      } as WixPlanDetails
    case WixPlanID.MONTHLY:
      return {
        id: WixPlanID.MONTHLY,
        tier: 'premium',
        frequency: 'monthly',
      } as WixPlanDetails
    case WixPlanID.ANNUAL:
      return {
        id: WixPlanID.ANNUAL,
        tier: 'premium',
        frequency: 'annual',
      } as WixPlanDetails
    default:
      return null
  }
}
