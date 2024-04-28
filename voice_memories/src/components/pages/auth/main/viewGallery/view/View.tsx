'use client'
import React, { useState, useEffect, useContext, useRef } from 'react'
import ImageGallery from 'react-image-gallery'
import 'react-image-gallery/styles/css/image-gallery.css'
import { AccountContext } from '@/components/utils/Account'
import { getAllUrls, getPhoto } from '@/components/utils/apiFunctions'
import { TileSpinner } from '@/components/primitives/TileSpinner.tsx/TileSpinner'
import { CognitoUserSession } from 'amazon-cognito-identity-js'
import {
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  SpeakerWaveIcon,
  PlayIcon,
  PlayPauseIcon,
} from '@heroicons/react/20/solid'
import { Button } from '@/components/primitives/Button'
import { useRouter } from 'next/navigation'
import Tooltip from '@mui/material/Tooltip'
export function View() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { getSession, logout } = useContext(AccountContext)
  const [session, setSession] = useState<CognitoUserSession | null>(null)
  const [albumName, setAlbumName] = useState('')
  const [photos, setPhotos] = useState<any[]>([])
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
      const currentPhoto = photos[currentSlideIndex]
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

  useEffect(() => {
    audioRef.current = new Audio()

    let isMounted = true

    const updateAlbumFromHash = () => {
      if (typeof window !== 'undefined') {
        const hash = window.location.hash.substring(1)
        setAlbumName(decodeURIComponent(hash))
      }
    }

    const fetchData = async () => {
      try {
        const session = await getSession()
        if (isMounted) {
          setSession(session)
          setLoggedIn(true)
          setIsLoading(false)

          updateAlbumFromHash()

          if (albumName) {
            const email = session.getIdToken().payload.email
            const tokens = {
              access: session.getAccessToken().getJwtToken(),
              id: session.getIdToken().getJwtToken(),
            }

            const data = await getAllUrls(email, tokens)
            if (data[albumName]) {
              const albumPhotos = await Promise.all(
                data[albumName].map(async (photoInfo) => {
                  const res = await getPhoto(photoInfo.url, tokens)
                  return {
                    albumName: albumName,
                    src: res.image,
                    audio: res.audio,
                    position: res.position,
                  }
                }),
              )

              console.log('before sort:', albumPhotos)
              albumPhotos.sort(compare)
              console.log('after sort:', albumPhotos)

              if (isMounted) {
                setPhotos(albumPhotos)
              }
            }
          }
        }
      } catch (error) {
        console.error('Error:', error)
        if (isMounted && typeof window !== 'undefined') {
          window.location.href = '/'
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false

    }
  }, [albumName])

  const galleryData = photos.map((photo) => ({
    original: photo.src,
    description: photo.albumName,
    audio: photo.audio,
  }))
  console.log(galleryData)

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
    const photo = photos[currentIndex]
    if (photo && audioRef.current) {
      if (isAutoplayEnabled) {
        playAudio(photo.audio)
      }
    }
  }

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

  const playAudio = (audioBase64: string) => {
    const audioBlob = base64ToBlob(audioBase64, 'audio/mpeg')
    const audioUrl = URL.createObjectURL(audioBlob)
    const currentAudio = audioRef.current
    currentAudio.pause()
    currentAudio.src = audioUrl
    currentAudio.load()
    currentAudio
      .play()
      .catch((error) => console.error('Audio play failed', error))
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

    // Cleanup
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
  if (isLoading || !session || galleryData.length === 0) {
    return <TileSpinner />
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
          onClick={() => router.push('/auth/main/viewGallery')}
        >
          Back
        </Button>
        <h1 className="m-0">{albumName} Gallery</h1>
      </div>

      <ImageGallery items={galleryData} onSlide={handleSlide} />
      <div className="relative bottom-5 left-5 w-11/12">
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

export default View
