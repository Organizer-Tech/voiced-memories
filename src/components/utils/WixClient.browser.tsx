import { getWixClient } from './WixClient.base'
import Cookies from 'js-cookie'

// Get Wix client for browser
export const getBrowserWixClient = () => getWixClient({ cookieStore: Cookies })
