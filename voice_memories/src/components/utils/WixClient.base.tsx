import { createClient, OAuthStrategy, ApiKeyStrategy } from '@wix/sdk'
import { plans, orders } from '@wix/pricing-plans'
import { redirects } from '@wix/redirects'
import { members } from '@wix/members'

// Type for getting cookies for server or client
export type CookieStore = {
  get(name: string): string | undefined
}

// Get refresh token from cookies if available
const getRefreshToken = (cookieStore: CookieStore) =>
  JSON.parse(cookieStore.get('WIX_REFRESH_TOKEN') || '{}')

// Get client for Wix API
export const getWixClient = ({ cookieStore }: { cookieStore: CookieStore }) =>
  process.env.NEXT_PUBLIC_WIX_CLIENT_ID
    ? createClient({
        modules: {
          redirects,
          plans,
          orders,
          members,
        },
        auth: OAuthStrategy({
          clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID,
          tokens: {
            refreshToken: getRefreshToken(cookieStore),
            accessToken: { value: '', expiresAt: 0 },
          },
        }),
      })
    : null

export type WixClientType = ReturnType<typeof getWixClient>
