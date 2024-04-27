'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { getAllSharedUrls } from '@/components/utils/apiFunctions'
import ImageGallery from 'react-image-gallery'
import 'react-image-gallery/styles/css/image-gallery.css'
import {
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  SpeakerWaveIcon,
  PlayIcon,
  PlayPauseIcon,
} from '@heroicons/react/20/solid'
import { TileSpinner } from '@/components/primitives/TileSpinner.tsx/TileSpinner'
// SharedGallery component to display the shared gallery
export default function SharedGallery() {
  const [isLoading, setIsLoading] = useState(true)
  const [photos, setPhotos] = useState<any[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [isAutoplayEnabled, setIsAutoplayEnabled] = useState(false)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [galleryData, setGalleryData] = useState([])
  const searchParams = useSearchParams()
  const id = searchParams.get('id') as string
  const handleVolumeChange = (e) => {
    const volume = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }
  const toggleVolumeSlider = () => {
    setShowVolumeSlider((prevShowVolumeSlider) => !prevShowVolumeSlider)
  }

  const toggleAutoplay = () => {
    setIsAutoplayEnabled(!isAutoplayEnabled)
    if (!isAutoplayEnabled) {
      const currentPhoto = photos[currentSlideIndex]
      console.log('photo: ', currentPhoto)
      if (currentPhoto && currentPhoto.signedAudioUrl) {
        playAudio(currentPhoto.signedAudioUrl)
      }
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
      // Correctly use setIsFullScreen to update the state based on the fullscreen status
      setIsFullScreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullScreenChange)

    return () =>
      document.removeEventListener('fullscreenchange', handleFullScreenChange)
  }, [])

  useEffect(() => {
    audioRef.current = new Audio()

    let isMounted = true

    const fetchData = async () => {
      try {
        if (isMounted) {
          setIsLoading(false)

          const albumPhotos: any[] = await getAllSharedUrls(id as string)
          albumPhotos.sort(compare)

          if (isMounted) {
            setPhotos(albumPhotos)  
          }
        }
      } catch (error) {
        console.error('Error:', error)
        if (error instanceof Response && error.status === 404) {
          alert(
            'The provided link is expired. Please ask the gallery owner for a new share link',
          )
        } else if (isMounted && typeof window !== 'undefined') {
          window.location.href = '/'
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [id])

  useEffect(() => {
    const data = photos.map((photo) => ({
      original: photo.signedPhotoUrl,
      description: '',
      audio: photo.signedAudioUrl,
    }))

    setGalleryData(data)
  }, [photos])

  const compare = (a: any, b: any) => {
    const value1 = a.position
    const value2 = b.position

    if (value1 < value2) {
      return -1
    }

    if (value1 > value2) {
      return 1
    }

    return 0
  }
  useEffect(() => {
    audioRef.current = new Audio()
  }, [id])

  const handleSlide = (currentIndex: number) => {
    setCurrentSlideIndex(currentIndex) // Update current slide index
    const photo = photos[currentIndex]
    if (photo && audioRef.current) {
      if (isAutoplayEnabled) {
        playAudio(photo.signedAudioUrl)
      }
    }
  }

  const playAudio = (audioUrl: string) => {
    const currentAudio = audioRef.current
    currentAudio.pause()
    currentAudio.src = audioUrl
    currentAudio.load()
    currentAudio
      .play()
      .catch((error) => console.error('Audio play failed', error))
  }

  useEffect(() => {
    // This effect runs once after the initial render
    const hideFullScreenButton = () => {
      const fsButton = document.querySelector(
        '.image-gallery-fullscreen-button',
      )
      if (fsButton) {
        // @ts-ignore
        fsButton.style.display = 'none'
      }
    }

    hideFullScreenButton()

    // Optional: Re-apply in case of dynamic content changes
    // You might not need this, depending on how your image gallery works
    const observer = new MutationObserver(hideFullScreenButton)
    observer.observe(document.body, { childList: true, subtree: true })

    // Cleanup
    return () => observer.disconnect()
  }, [])

  if (isLoading || galleryData.length === 0) {
    return <TileSpinner />
  }

  //import and update to fullscreen
  return (
    <div>
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
        <h1 className="m-0">Shared Gallery</h1>
      </div>

      <ImageGallery items={galleryData} onSlide={handleSlide} />
      <div className="flex items-center justify-between">
        <div>
          <button onClick={toggleAutoplay} style={{ marginLeft: '10px' }}>
            {isAutoplayEnabled ? (
              <PlayPauseIcon className="h-6 w-6" />
            ) : (
              <PlayIcon className="h-6 w-6" />
            )}
          </button>
        </div>
        <button onClick={toggleFullScreen} className="mr-2">
          {isFullScreen ? (
            <ArrowsPointingInIcon className="h-6 w-6" />
          ) : (
            <ArrowsPointingOutIcon className="h-6 w-6" />
          )}
        </button>
      </div>
      <button onClick={toggleVolumeSlider} style={{ marginRight: '10px' }}>
        <SpeakerWaveIcon className="ml-4 h-6 w-6" />
      </button>
      {showVolumeSlider && (
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          defaultValue="1"
          onChange={handleVolumeChange}
          style={{ width: '10%', minWidth: '80px' }}
        />
      )}
    </div>
  )
  ;
}
