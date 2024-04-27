'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getAllUrls, getPhoto } from '@/components/utils/apiFunctions'
import { TileSpinner } from '@/components/primitives/TileSpinner.tsx/TileSpinner'
import { Button } from '@/components/primitives/Button'
import { useRouter } from 'next/navigation'
import { Alert } from '@mui/material'
const PolaroidGallery = ({ session, size, imageSize, className, textSize }) => {
    const [photos, setPhotos] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true);
    const [noPhotos, setNoPhotos] = useState(false);
    const router = useRouter()
    const fetchGalleryData = async () => {
        try {
            const email = session?.getIdToken().payload.email
            const tokens = {
                access: session?.getAccessToken().getJwtToken() as string,
                id: session?.getIdToken().getJwtToken() as string,
            }

            const data = await getAllUrls(email, tokens)

            for (const [key, value] of Object.entries(data)) {
                const url = (value as any)[0].url
                const res = await fetchPhoto(url)
                const base64 = res.image

                const album = {
                    albumName: key,
                    src: base64,
                }

                setPhotos((photos) => {
                  const existingNames = photos.map((photo) => photo.albumName);
                  if (!existingNames.includes(album.albumName)) {
                    return [...photos, album];
                  }
                  return photos;
                });
            }
        } catch (error) {
          if (error instanceof Response && error.status === 404) {
            setNoPhotos(true);
          }
          console.error('Error fetching gallery data:', error)
        }
    }

    const fetchPhoto = async (url: string) => {
        const tokens = {
            access: session?.getAccessToken().getJwtToken() as string,
            id: session?.getIdToken().getJwtToken() as string,
        }

        return await getPhoto(url, tokens)
    }
    //import test
    useEffect(() => {
        fetchGalleryData()
    }, [])

    if (noPhotos) {
      return (
        <div className="flex items-center justify-center min-h-screen">
        <div className="absolute inset-0 flex items-center justify-center">
          <Alert severity="error">No albums were found for the current user. Please return to home and create a gallery</Alert>
          <div className="pb-10 text-center flex justify-center fixed bottom-0 w-full">
          <Button 
            size="xl"
            className="text-3xl text-white hover:text-gray-200"
            onClick={() => router.push('/auth/main')}
          >
            Return to Home
          </Button>
          </div>
        </div>
        </div>
      );
    }
    if (photos.length === 0 || !photos) {
        return (
          <div className="flex items-center justify-center min-h-screen">
          <div className="absolute inset-0 flex items-center justify-center">
            <TileSpinner />
            <div className="pb-10 text-center flex justify-center fixed bottom-0 w-full">
            <Button 
              size="xl"
              className="text-3xl text-white hover:text-gray-200"
              onClick={() => router.push('/auth/main')}
            >
              Return to Home
            </Button>
            </div>
          </div>
          </div>
        );
      }
    return (
        <div
            className={`font-custom flex w-full bg-cover bg-repeat p-4 text-black ${textSize}`}
        >
            <ul className="absolute m-0 p-0">
                {photos.map((photo, index) => (
                    <li
                        key={index}
                        className={`border-12 relative inline-block list-none border-white bg-white text-center shadow-lg transition-all duration-1000 ease-in-out ${className}`}
                        style={{ top: '30px' }}
                        onMouseOver={(e) => (e.currentTarget.style.top = '0px')}
                        onMouseOut={(e) => (e.currentTarget.style.top = '30px')}
                    >
                        <Link
                            href={`/auth/main/editGallery#${photo.albumName}`}
                            passHref
                            legacyBehavior
                        >
                            <a>
                                {photo.src ? (
                                    <Image
                                        src={photo.src}
                                        width={size}
                                        height={size}
                                        alt={`image #${index + 1}`}
                                    />
                                ) : (
                                    <Image
                                        loader={() =>
                                            `https://unsplash.it/${imageSize}/${imageSize}`
                                        }
                                        src={`https://unsplash.it/${imageSize}/${imageSize}`}
                                        width={size}
                                        height={size}
                                        alt={`image #${index + 1}`}
                                    />
                                )}
                                <p className="m-0">{photo.albumName}</p>
                            </a>
                        </Link>
                    </li>
                ))}
            </ul>
            <div className="light"></div>
            <style jsx global>{`
        .font-custom {
          font-family: 'Homemade Apple', cursive;
        }

        .rotate-10 {
          transform: rotate(10deg);
        }

        .rotate-20 {
          transform: rotate(20deg);
        }

        .rotate-0 {
          transform: rotate(0deg);
        }

        .-rotate-10 {
          transform: rotate(-10deg);
        }

        .shadow-lg {
          box-shadow: 0 0 15px 0px #555;
        }

        .light {
          border-radius: 50%;
          position: absolute;
          left: 0;
          right: 0;
          width: 700px;
          height: 700px;
          background: #fff;
          filter: blur(100px);
          opacity: 0.3;
          pointer-events: none;
        }
      `}</style>
        </div>
    )
}

export default PolaroidGallery