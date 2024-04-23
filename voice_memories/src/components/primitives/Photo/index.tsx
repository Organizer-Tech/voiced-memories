'use client'
import internal from 'stream'
import { sizes } from '../../types'
import Image from 'next/image'
import React, { useEffect } from 'react'
import useState from 'react'

// import audio from 'test_audio.mpeg'

export interface PhotoProps {
  //Custom component for images

  //size of image
  size?: sizes | 'none'

  //width of image in px
  width?: number

  //height of image in px
  height?: number

  //URL location of photo
  URL: string 

  //title of image
  title: string

  //caption of image
  caption?: string

  //audio string src
  audio?: string | ''

  fill?: boolean

  onClick?: () => void

  play: boolean

  ID: string | null

  path? : string
  
  audioType?: string
  imgType?:string
}

export function Photo({
  size = 'none',
  width = -1,
  height = -1,
  URL,
  title,
  caption = '',
  fill = false,
  audio = './test_audio.mp3',
  onClick,
  play = false,
  ID = null,
  audioType = '.mp3',
  imgType = '.jpeg'
}: PhotoProps) {
  const [sfx] = React.useState<HTMLAudioElement | null>(
    typeof Audio !== 'undefined' ? new Audio(URL) : null,
  )
  if (play) {
    if (width == -1 || height == -1) {
      fill = true
      return (
        <div id="galleryPhoto" className="relative flex">
          {/* <Image alt="gallery" className="absolute inset-0 w-full h-full object-cover object-center" src={ca} fill={true} objectFit='contain' /> */}
          <Image
            src={URL}
            alt={caption}
            fill={fill}
            style={{ objectFit: 'contain' }}
          />
          <div className="relative z-10 w-full border-4  border-gray-200 bg-transparent px-8 py-10 opacity-0 hover:opacity-100">
            {/* This button makes it so that the click on background shows photo*/}
            <button
              className="invisible-button"
              onClick={onClick}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                padding: 0,
                margin: 0,
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
              }}
            />
            {/* <h2 className="tracking-widest text-sm title-font font-medium text-indigo-500 mb-1">{title}</h2> */}
            {/* <h1 className="title-font text-lg font-medium text-gray-900 mb-3">{title}</h1> */}
            {/* <p className="leading-relaxed">{caption}</p> */}
            {/* <PlayAudio></PlayAudio> */}
          </div>
        </div>
      )
    } else {
      return (
        <div id="galleryPhoto" className="relative flex">
          {/* <Image alt="gallery" className="absolute inset-0 w-full h-full object-cover object-center" src={ca} fill={true} objectFit='contain' /> */}
          <Image
            src={URL}
            alt={caption}
            width={width}
            height={height}
            style={{ objectFit: 'contain' }}
          />
          </div>
      )
    }
  } else {
    if (width == -1 || height == -1) {
      fill = true
      return (
        <div className="relative flex">
          {/* <Image alt="gallery" className="absolute inset-0 w-full h-full object-cover object-center" src={ca} fill={true} objectFit='contain' /> */}
          <Image
            src={URL}
            alt={caption}
            fill={fill}
            style={{ objectFit: 'contain' }}
          />
          {/* <div className="relative z-10 w-full border-4  border-gray-200 bg-transparent px-8 py-10 opacity-0 hover:opacity-100"> */}
          {/* <h2 className="tracking-widest text-sm title-font font-medium text-indigo-500 mb-1">{title}</h2> */}
          {/* <h1 className="title-font text-lg font-medium text-gray-900 mb-3">{title}</h1> */}
          {/* <p className="leading-relaxed">{caption}</p> */}
          {/* </div> */}
        </div>
      )
    } else {
      return (
        <div className="relative flex">
          {/* <Image alt="gallery" className="absolute inset-0 w-full h-full object-cover object-center" src={ca} fill={true} objectFit='contain' /> */}
          <Image
            src={URL}
            alt={caption}
            width={width}
            height={height}
            style={{ objectFit: 'contain' }}
          />
          {/* <div className="relative z-10 w-full border-4  border-gray-200 bg-white px-8 py-10 opacity-0 hover:opacity-25"> */}
          {/* <h2 className="tracking-widest text-sm title-font font-medium text-indigo-500 mb-1">{title}</h2> */}
          {/* <h1 className="title-font text-lg font-medium text-gray-900 mb-3">{title}</h1> */}
          {/* <p className="leading-relaxed">{caption}</p> */}
          {/* </div> */}
        </div>
      )
    }
  }
}

export default Photo
