/* eslint-disable */
import React from 'react'
import { Container } from '@/components/pages/Container'
import { Card } from '@/components/primitives/Card'
import Image from 'next/image'
import { NavLinks } from '@/components/pages/NavLinks'
import { Button } from '@/components/primitives/Button'
import { useEffect } from 'react'
import Link from 'next/link'
import { WixPlanID } from '@/components/utils/WixPlans'
export function Hero() {
  const planId = WixPlanID.STARTER
//Hero component export and formatting This is the top of the front page
  return (
    <div className="flex min-h-screen">
      <div className="w-2/3 bg-cream">
        <Container>
          <div className="flex h-full justify-center pt-2">
            <Image
              src="/Logo.jpg"
              height={100}
              width={200}
              alt="Description of the image"
            />
          </div>
          <div className="flex h-full justify-center pt-4">
            <p className="text-2xl font-bold text-red-800">
              Bring Your Photos to Life with Your Voice
            </p>
          </div>
          <div className="flex h-full justify-center">
            <div className="pt-5">
              <Image
                src="/Main_Page_Photo.jpg"
                height={700}
                width={700}
                alt="Description of the image"
              />
            </div>
          </div>
          <div className="flex h-full justify-center pt-6">
            <p className="text-lg italic text-red-800">
              Relive and share your voiced memories like never before.
            </p>
          </div>
          <div className="flex h-full justify-center p-6">
            <Card className="flex items-center justify-center bg-[#008080] p-8 text-2xl text-white">
              Easily upload your cherished photos <br /> and add personal audio
              messages.
            </Card>
          </div>
        </Container>
      </div>
      <div className="w-1/3">
        <div>
          <div className="flex justify-center pt-2">
            <Link href="/AccountLogin">
              <Button color="gold"  variant="outline" size="lg">
                Log in
              </Button>
            </Link>
            <div className="mx-4"></div>
            <Link href="mailto:karen@photocollections.ca">
              <Button color="gold" variant="outline" size="lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
        <Card className="mt-10 flex items-center justify-center bg-[#008080] p-8 text-lg text-white">
          <div className="w-full text-center">
            <span className="text-2xl font-semibold underline">
              Key Features
            </span>
            <div className="feature flex items-center justify-center">
              <img
                src="/key.svg"
                width={20}
                height={20}
                alt="Secure Storage Icon"
                className="mr-2 h-4 w-4"
              />
              <span>Secure Storage</span>
            </div>
            <div className="feature flex items-center justify-center">
              <img
                src="/key.svg"
                width={20}
                height={20}
                alt="Secure Storage Icon"
                className="mr-2 h-4 w-4"
              />
              <span>Easy Sharing</span>
            </div>
            <div className="feature flex items-center justify-center">
              <img
                src="/key.svg"
                width={20}
                height={20}
                alt="Secure Storage Icon"
                className="mr-2 h-4 w-4"
              />
              <span>Audio Integration</span>
            </div>
            <div className="feature flex items-center justify-center">
              <img
                src="/key.svg"
                width={20}
                height={20}
                alt="Secure Storage Icon"
                className="mr-2 h-4 w-4"
              />
              <span>Easy Upload</span>
            </div>
          </div>
        </Card>
        <Link href={`https://youtu.be/Rqy8GP9S2-0`}>
        <div className="flex w-full justify-center pt-8">
          <Card className="flex w-full items-center justify-center bg-black p-8 text-lg text-white border-2"
          style={{ borderColor: "#EACB1B" }}>
            Learn More{' '}
          </Card>
        </div>
        </Link>
        <Link href={`/showcase`}>
          <div className="flex w-full justify-center pt-8">
          <Card className="flex w-full items-center justify-center bg-black p-8 text-lg text-white border-2"
          style={{ borderColor: "#EACB1B" }}>
              Showcase Gallery{' '}
            </Card>
          </div>
        </Link>
        <Link href={`/Checkout?planId=${planId}`}>
          <div className="flex w-full justify-center pt-8">
          <Card className="flex w-full items-center justify-center bg-black p-8 text-lg text-white border-2"
          style={{ borderColor: "#EACB1B" }}>
              Get Started{' '}
            </Card>
          </div>
        </Link>
        <div className="flex w-full justify-center pt-16">
          <Card className="flex items-center justify-center bg-[#008080] p-8 text-lg text-white">
            "ALWAYS a pleasure to work with Karen. My photos and treasures that
            are cherished by myself—are professional treated like "gold" by
            Karen and her staff too This professionalism and heartfelt caring
            means the world to me.​ Thank you for everything." -Susie
          </Card>
        </div>
      </div>
    </div>
  )
}
