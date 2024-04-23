import { type Metadata } from 'next'
import { Main } from '@/components/pages/auth/main/AuthMain'
import { Account } from '@/components/utils/Account'
import React from 'react'
import Head from 'next/head';
export const metadata: Metadata = {
  title: 'Main Page',
  icons: '/microphone-icon.svg',
}

export default function MAIN_PAGE() {
  return (
    <>
          <Head>
      <link rel="icon" href="/microphone-icon.svg" type="image/svg+xml" />
        <meta name="p:domain_verify" content="88bc86a6d63c58e88c487a8f85bb88d9"/>
      </Head>
      <Account>
        <Main />
      </Account>
    </>
  )
}
