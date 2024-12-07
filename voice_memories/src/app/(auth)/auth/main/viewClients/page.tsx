import { ViewClients } from '@/components/pages/auth/main/viewClients/ViewClients';
import { type Metadata } from 'next'
import Head from "next/head";
import { Account } from "@/components/utils/Account";

export const metadata: Metadata = {
    title: 'Clients',
    icons: '/microphone-icon.svg',
}

//Defines the viewClients page using the ViewClients page component
export default function viewClients(){
    return (<>
        <Head>
            <link rel="icon" href="/microphone-icon.svg" type="image/svg+xml" />
            <meta name="p:domain_verify" content="88bc86a6d63c58e88c487a8f85bb88d9"/>
        </Head>
        <Account>
            <ViewClients/>
        </Account>
    </>)
}