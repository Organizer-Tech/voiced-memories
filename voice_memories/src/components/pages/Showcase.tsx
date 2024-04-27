'use client'
import React, { useState, useEffect, useContext, useRef } from 'react'
import ImageGallery from 'react-image-gallery'
import Tooltip from '@mui/material/Tooltip'
import 'react-image-gallery/styles/css/image-gallery.css'


import {
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  SpeakerWaveIcon,
  PlayIcon,
  PlayPauseIcon,
} from '@heroicons/react/20/solid'
import { Button } from '@/components/primitives/Button'
import { useRouter } from 'next/navigation'
export function Showcase() {
  const [albumName, setAlbumName] = useState('Showcase Collection')
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [isAutoplayEnabled, setIsAutoplayEnabled] = useState(false)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [currentVolume, setCurrentVolume] = useState(100)
  const router = useRouter()
  const handleVolumeChange = (e) => {
    const volume = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
    setCurrentVolume(Math.floor(volume*100))
  }
  const toggleVolumeSlider = () => {
    setShowVolumeSlider((prevShowVolumeSlider) => !prevShowVolumeSlider)
  }

  const toggleAutoplay = () => {
    setIsAutoplayEnabled(!isAutoplayEnabled)
    if (!isAutoplayEnabled) {
      const currentPhoto = photoGallery[currentSlideIndex]
      if (currentPhoto && currentPhoto.audio) {
        playAudio(currentPhoto.audio)
      }
    } else {
      audioRef.current.pause()
    }
  }

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .catch((e) => console.error(e))
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((e) => console.error(e))
      }
    }
  }

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullScreenChange)

    return () =>
      document.removeEventListener('fullscreenchange', handleFullScreenChange)
  }, [])

 const photoGallery = [{src: '/Dad_at_Victoria_Landing.jpg', albumName: "Showcase Collection", audio: "/Dad_Victoria_Landing.m4a" },
  {src: 'mom_getting_her_jersey.jpg', albumName: "Showcase Collection", audio: '/Mom_and_Baseball.m4a'},
  {src: 'Family_Gathering.jpg', albumName: "Showcase Collection", audio: '/Family_Gathering.m4a'},
  {src: 'Anna_Martin_Hansen.jpg', albumName: "Showcase Collection", audio: '/Anna_and_Martin_Hanson.m4a'},
  {src: 'Robert_Bell_General_Store.jpg', albumName: "Showcase Collection", audio: '/Robert_Bell.m4a'},
  {src: 'Family_Travel.jpg', albumName: "Showcase Collection", audio: '/Family_Travel.m4a'},
  {src: 'Monica.jpg', albumName: "Showcase Collection", audio: '/Monica.m4a'},
 ]

  const galleryData = photoGallery.map((photo) => ({
    original: photo.src,
    description: photo.albumName,
    audio: photo.audio,
  }))

  useEffect(() => {
    audioRef.current = new Audio()
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [albumName])

  const handleSlide = (currentIndex: number) => {
    setCurrentSlideIndex(currentIndex)
    const photo = photoGallery[currentIndex]
    if (photo && audioRef.current) {
      if (isAutoplayEnabled) {
        playAudio(photo.audio)
      }
    }
  }

  const playAudio = (audioUrl: string) => {
    const currentAudio = audioRef.current;
    currentAudio.pause();
    currentAudio.src = audioUrl;  // Set the source directly to the audio file URL
    currentAudio.load();          // Load the audio file
    currentAudio.play().catch((error) => console.error('Audio play failed', error));  // Attempt to play the audio
  }
  useEffect(() => {
    const hideFullScreenButton = () => {
      const fsButton = document.querySelector(
        '.image-gallery-fullscreen-button',
      ) as HTMLElement
      if (fsButton) {
        fsButton.style.display = 'none'
      }
    }

    hideFullScreenButton()

    const observer = new MutationObserver(hideFullScreenButton)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  const base64ToBlob = (base64, mimeType) => {
    const byteCharacters = atob(base64)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    return new Blob([byteArray], { type: mimeType })
  }
  return (
    <div className="relative min-h-screen flex flex-col">
      <style jsx>{`
        .image-gallery-fullscreen-button {
          display: none !important;
        }
      `}</style>
      <style jsx>{`
        .image-gallery-autoplay-button {
          display: none !important;
        }
      `}</style>
      <style jsx>{`
        .image-gallery-play-button {
          display: none !important;
          height: 0;
          width: 0;
        }
      `}</style>
      <style jsx>{`
        .image-gallery-play-button .image-gallery-svg {
          display: none !important;
        }
      `}</style>
      <style jsx>{`
        .image-gallery-svg {
          display: none !important;
          height: 0;
          width: 0;
        }
      `}</style>
      <style jsx>{`
        .image-gallery-icon:hover {
          display: none !important;
        }
      `}</style>
      <style jsx global>{`
        .image-gallery-icon.image-gallery-play-button {
          display: none !important;
        }
      `}</style>
      <div className="flex items-center space-x-4">
        <Button
          color="black"
          size="sm"
          className="mt-.5"
          onClick={() => router.push('/')}
        >
          Back
        </Button>
        <h1 className="m-0">{albumName} Gallery</h1>
      </div>

      <ImageGallery items={galleryData} onSlide={handleSlide} />
      <div className="absolute bottom-5 left-5 w-11/12">
        <div className="relative top-0">
          <Tooltip title={isAutoplayEnabled ? "Disable Autoplay" : "Enable Autoplay"} placement="right">
            <button onClick={toggleAutoplay} style={{ marginLeft: '10px' }}>
              {isAutoplayEnabled ? (
                <PlayPauseIcon className="h-6 w-6" />
              ) : (
                <PlayIcon className="h-6 w-6" />
              )}
            </button>
          </Tooltip>
        </div>
        <div className="relative bottom-0">
          <Tooltip title="Volume" placement="right">
            <button onClick={toggleVolumeSlider} style={{ marginRight: '10px' }}>
              <SpeakerWaveIcon className="ml-4 h-6 w-6" />
            </button>
          </Tooltip>
          {showVolumeSlider && (
            <Tooltip title={currentVolume} placement="right">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  defaultValue="1"
                  onChange={handleVolumeChange}
                  style={{ width: '10%', minWidth: '80px' }}
                />
              </Tooltip>
          )}
        </div>
      </div>
      <div className="absolute bottom-5 right-5">
        <Tooltip title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"} placement="left">
          <button onClick={toggleFullScreen} className="mr-2">
            {isFullScreen ? (
              <ArrowsPointingInIcon className="h-6 w-6" />
            ) : (
              <ArrowsPointingOutIcon className="h-6 w-6" />
            )}
          </button>
        </Tooltip>
      </div>
    </div>
  )
}

export default Showcase
