'use client'

import React, {ChangeEvent, useMemo} from 'react'
import Photo from '../primitives/Photo'
import { useState, useEffect, useRef, DragEvent } from 'react'


interface ImgData {
  email?: string;
  album?: string;
  imgType?: string;
  title?: string;
  audioType?: string;
  imgId?: string;
}

export interface ImageData {
  path: string
  soundURL: string
}

interface AlbumProps {
  onImageClick: (imageData: ImageData) => void
  isPlaying: boolean
  stop: (id?: string) => void
  PlayPause: () => void
}
//function to handle the drag and drop of images

function Album({ onImageClick, isPlaying, stop, PlayPause }: AlbumProps) {

  const containerRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [displayedImages, setDisplayedImages] = useState<string[]>([])

  const imageArray = useMemo(
    () => [
      'Robert Bell General Store.jpg',
      'Anna Martin Hansen.jpg',
      'mom getting her jersey.jpg',

      'Dad at Victoria Landing.jpg',
      'Family get togethers.jpg',
    ],
    [],
  )

  const itemsPerPage = 18

  const totalItems = imageArray.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const newDisplayedImages = imageArray.slice(startIndex, endIndex)
    setDisplayedImages(newDisplayedImages)
  }, [currentPage, imageArray, itemsPerPage])

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const newDisplayedImages = imageArray.slice(startIndex, endIndex)
    setDisplayedImages(newDisplayedImages)
  }

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const newDisplayedImages = imageArray.slice(startIndex, endIndex)
    setDisplayedImages(newDisplayedImages)
  }

  const handlePhotoClick = (path: string, soundURL:string) => {
    // Invoke the callback with the clicked photo data
    onImageClick({ path , soundURL})

    if (isPlaying) {
      PlayPause()
      stop()
    }
    // PlayPause();
  }


  return (
      <div
          ref={containerRef}
          className="container mx-auto h-full w-full px-5 py-24"
      >

        <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50px",
              width: "w-full",
              border: "1px dotted",
              backgroundColor: "#008080",
              fontSize: "25px"
            }}
        >
            <button>Click or drag and drop photos here</button>
        </div>
        {/* {console.log(displayedImages)} */}
        <div className="-m-4 flex flex-wrap">
          {/* This will load all photos from an array using a map. */}

        {displayedImages.map((path, index) => (
          <div
            key={`${path}-${index}`}
            className="xs:w-1/2 p-2 md:px-6 lg:w-1/3 lg:py-12"
          >
            <Photo
              caption="test"
              URL={`/${path}`}
              ID={`${path}-${index}`}
              title="test"
              onClick={() => handlePhotoClick(path,'')}
              play={true}
            />
          </div>
        ))}
      </div>


        <div className="mt-4 flex justify-center">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            <span className="sr-only">Previous Page of Photos</span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1.5em"
                viewBox="0 0 448 512"
            >
              <path
                  d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
            </svg>
          </button>
          <span className="mx-4">
          Page {currentPage} of {totalPages}
        </span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>
            <span className="sr-only">Next Page of Photos</span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1.5em"
                viewBox="0 0 448 512"
            >
              <path
                  d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
            </svg>
          </button>
        </div>
      </div>
      // {/* </section>     */}
  )
}

export default Album
