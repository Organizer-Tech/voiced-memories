import { Metadata } from 'next'

import { Settings } from '@/components/pages/auth/main/settings/Settings'
import { Account } from '@/components/utils/Account'
import Head from 'next/head';
export const metadata: Metadata = {
  title: 'Settings',
  icons: '/microphone-icon.svg',
}

export default function SettingsPage() {
  return (
    <>
                  <Head>
      <link rel="icon" href="/microphone-icon.svg" type="image/svg+xml" />
        <meta name="p:domain_verify" content="88bc86a6d63c58e88c487a8f85bb88d9"/>
      </Head>
    <Account>
      <Settings />
    </Account>
    </>
  )
}
