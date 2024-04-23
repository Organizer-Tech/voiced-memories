import { getWixClient, CookieStore } from './WixClient.base'
import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies'
import { createClient, OAuthStrategy, ApiKeyStrategy } from '@wix/sdk'
import { plans, orders } from '@wix/pricing-plans'
import { redirects } from '@wix/redirects'
import { members } from '@wix/members'

// Type for getting cookies for server
export type RequestCookiesGetter = Pick<RequestCookies, 'get'>
const getCookieAdapter = (cookieStore: RequestCookiesGetter): CookieStore => {
  return {
    get: (name) => cookieStore.get(name)?.value,
  }
}

// Get client for Wix API calls from server components
export const getServerWixClient = ({
  cookieStore,
}: {
  cookieStore: RequestCookiesGetter
}) => getWixClient({ cookieStore: getCookieAdapter(cookieStore) })

// Get Wix management client for server components
// Used for API calls that do not require member to be logged in
export async function getWixManagementClient() {
  'use server'
  return process.env.WIX_SITE_ID && process.env.WIX_API_KEY
    ? createClient({
        modules: {
          redirects,
          plans,
          orders,
          members,
        },
        auth: ApiKeyStrategy({
          siteId: process.env.WIX_SITE_ID,
          apiKey: process.env.WIX_API_KEY,
        }),
      })
    : null
}
