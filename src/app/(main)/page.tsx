import { Privacy } from '@/components/pages/Privacy';
import { Hero } from '@/components/pages/Main';
import { Pricing } from '@/components/pages/Pricing';
import { About } from '@/components/pages/AboutUs';
import Head from 'next/head';
import { type Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Gallery',
  icons: '/microphone-icon.svg',
}
export default function Home() {
  return (
    <>
      <Head>
      <link rel="icon" href="/microphone-icon.svg" type="image/svg+xml" />
        <meta name="p:domain_verify" content="88bc86a6d63c58e88c487a8f85bb88d9"/>
      </Head>
      <Hero />
      <Pricing />
      <About />
      <Privacy />
    </>
  );
}