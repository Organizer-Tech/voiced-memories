'use client'

import React, {
  ChangeEvent,
  DragEvent,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import Photo, { PhotoProps } from '@/components/primitives/Photo'
import {
  getAllUrls,
  getPhoto,
  postPhoto,
  createShareableLink,
  updatePhoto,
  deletePhoto,
} from '@/components/utils/apiFunctions'
import { AccountContext } from '@/components/utils/Account'
import { CognitoUserSession } from 'amazon-cognito-identity-js'
import { Button } from '@/components/primitives/Button'
import { useRouter } from 'next/navigation'
import { color } from 'framer-motion'
import { FloatingPortal } from '@floating-ui/react'
import { ConfirmationModal } from '@/components/primitives/ConfirmationModal/ConfirmationModal'
import { TileSpinner } from '@/components/primitives/TileSpinner.tsx/TileSpinner'
import { Alert } from '@mui/material'

// Album component to display the user's gallery
export interface ImgData {
  email?: string
  album?: string
  imgType?: string
  title?: string
  audioType?: string
  imgId?: string
  audio?: string
  position?: number
}
// AuthTokens interface
interface AuthTokens {
  access: string
  id: string
}
// GalleryItem interface
interface GalleryItem {
  original: string
  description: string
  audio: string
  url: string
  rotation?:number
}

// Album component props
export interface ImageData {
  path: string
  audio: string
}
// Album component props
interface AlbumProps {
  onImageClick: (photo: PhotoProps) => void
  isPlaying: boolean
  stop: (id?: string) => void
  PlayPause: () => void
  imagePath: string
  albumName?: string
  updateAlbumName?: (newAlbumName: string) => void
}

let currentPhoto: string
let currentURL: string
let currentSound: string
let currentIndex: number | null = null

function setCurrentPhoto(i: string) {
  currentPhoto = i
}

function setCurrentPhotoID(url: string) {
  currentURL = url
}
function setCurrentAudio(audio: string) {
  currentSound = audio
}
function setCurrentIndex(index: number){
  currentIndex = index
}
export function getCurrentPhoto(): string {
  return currentPhoto
}

export function getCurrentURL(): string {
  return currentURL
}
export function getCurrentAudio(): string {
  return currentSound
}

export function getCurrentIndex(): number | null {
  return currentIndex
}

function Album({
  onImageClick,
  isPlaying,
  stop,
  PlayPause,
  updateAlbumName,
}: AlbumProps) {
  // States
  const [loggedIn, setLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true) // Set but not read
  const [session, setSession] = useState<CognitoUserSession | null>(null)
  const [albumName, setAlbumName] = useState('')
  const [photos, setPhotos] = useState<any[]>([])
  const [file, setFile] = useState<string | undefined>(undefined) // Set but not read
  const [shareableLink, setShareableLink] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [currentPage, setCurrentPage] = useState(1) // Read but not set
  const [galleryData, setGalleryData] = useState<GalleryItem[]>([])
  const [displayedImages, setDisplayedImages] = useState<GalleryItem[]>([]) // Set but not read
  const [noPhotos, setNoPhotos] = useState(false) 
  const [isEditing, setIsEditing] = useState(false)
  const [newName, setNewName] = useState('')

  // Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { getSession, logout } = useContext(AccountContext)

  // Constants
  const router = useRouter()
  const itemsPerPage = 18
  const totalItems = galleryData.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // var currentPage = 1;
  // const [startIndex, setStartIndex] = useState(0);
  // const [endIndex, setEndIndex] = useState(9);

  useEffect(() => {
    // Create new audio element for page
    audioRef.current = new Audio() // This will only execute client-side

    let isMounted = true
    // Function to update the album name from the hash
    const updateAlbumFromHash = () => {
      if (typeof window !== 'undefined') {
        const hash = window.location.hash.substring(1)
        setAlbumName(decodeURIComponent(hash))
        updateAlbumName(decodeURIComponent(hash))
      }
    }
    // Function to fetch data
    const fetchData = async () => {
      try {
        // Get Cognito session and set related states
        const session = await getSession()
        if (isMounted) {
          setSession(session)
          setLoggedIn(true)
          setIsLoading(false)
          updateAlbumFromHash()

          // If the album name is set, fetch the photos
          if (albumName) {
            const email = session.getIdToken().payload.email
            const tokens = {
              access: session.getAccessToken().getJwtToken(),
              id: session.getIdToken().getJwtToken(),
            }

            // Get all the URLs for the album
            const data = await getAllUrls(email, tokens)

            // If retrieval is successful, map over the data to get the photo info
            if (data[albumName]) {
              const albumPhotos = await Promise.all(
                data[albumName].map(async (photoInfo) => {
                  const res = await getPhoto(photoInfo.url, tokens)

                  return {
                    albumName: albumName,
                    src: res.image,
                    audio: res.audio,
                    url: photoInfo.url,
                    audioType: photoInfo.audioType,
                    imgType: photoInfo.imgType,
                    position: photoInfo.position,
                  }
                }),
              )
              // Photos are sorted by position
              albumPhotos.sort(compare)
              setLoaded(true)
              if (isMounted) {
                setPhotos(albumPhotos)
                setLoaded(true)
              }
              setLoaded(true)
            } else {
              setLoaded(true)
            }
          }
        }
      } catch (error) {
        setLoaded(true)
        if (error instanceof Response && error.status === 404) {
          console.log('No photos found, new user')
          setNoPhotos(true)
        } else {
          console.error('Error:', error)
          if (isMounted && typeof window !== 'undefined' && !session) {
            window.location.href = '/'
          }
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [albumName])

  // Function to compare the position of photos
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

  const handleLogout = () => {
    logout()
    sessionStorage.removeItem('FullName')
    sessionStorage.removeItem('Email')
    router.push('/')
  }
  const handleSaveName = () => {
  updateAlbumName(newName); // Save new name using the provided function
  setIsEditing(false); // Hide the text box after saving
  window.location.reload()
  //router.push("/auth/main/editGallery#" + newName)
  }
   //Implement rotateImage meta data by 90 degs clockwise
   const rotateImage = async () => {
    if (currentIndex !== null) {
      const updatedPhotos = [...photos]
      updatedPhotos[currentIndex] = {
        ...updatedPhotos[currentIndex],
        rotation: (updatedPhotos[currentIndex].rotation || 0) + 90,
      }
      setPhotos(updatedPhotos)

      if (session) {
        const tokens = {
          access: session.getAccessToken().getJwtToken(),
          id: session.getIdToken().getJwtToken(),
        }

        const imgData = {
          email: session.getIdToken().payload.email,
          album: albumName,
          rotation: updatedPhotos[currentIndex].rotation,
        }
        await updatePhoto(updatedPhotos[currentIndex].url, imgData, tokens)
      }
    }
  }


  useEffect(() => {
    if (session) {
      const email = session.getIdToken().payload.email // Retrieve the email from session tokens.
      const tokens = {
        access: session.getAccessToken().getJwtToken(), // Retrieve the access token.
        id: session.getIdToken().getJwtToken(), // Retrieve the ID token.
      }

      // Map over the photos array to create a new format for gallery data.
      const updatedGalleryData = photos.map((photo) => ({
        original: photo.src,
        description: photo.albumName,
        audio: photo.audio,
        url: photo.url,
        audioType: photo.audioType,
        imgType: photo.imgType,
        rotation: photo.rotation || 0,
      }))

      setGalleryData(updatedGalleryData) // Update the state with the new gallery data.
    }
  }, [photos, session])

  //let image = async (JSON.parse(await getAlbumUrls(email, albumName, tokens)));

  // Unused, test data
  const imageArray = useMemo(
    () => [
      galleryData,
      'test_atom.svg',
      'test_atom.svg',
      'test_atom.svg',

      'test_android.svg',
      'test_android.svg',
      'test_android.svg',

      'test_ca.svg',
      'test_ca.svg',
      'test_ca.svg',

      'test_atom.svg',
      'test_atom.svg',
      'test_atom.svg',

      'test_jpg.jpg',
      'test_jpg.jpg',
      'test_jpg.jpg',

      'test_ca.svg',
      'test_ca.svg',
      'test_ca.svg',

      'test_android.svg',
      'test_android.svg',
      'test_android.svg',

      'test_jpg.jpg',
      'test_jpg.jpg',
      'test_jpg.jpg',
    ],
    [],
  )
  // Function to handle the page change
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const newDisplayedImages = galleryData.slice(startIndex, endIndex)
    setDisplayedImages(newDisplayedImages)
  }, [currentPage, galleryData])

  // Ref for the file upload input
  const uploadRef = useRef<HTMLInputElement>(null)

  /**
   * Gets the file extension from a file name
   * @param filename Name of the file
   * @returns File extension
   */
  function getFileExtension(filename: String) {
    return '.' + filename.split('.').pop()
  }

  /**
   * Converts a Base64 string to a Blob
   * @param base64 Base64 string representation of the file
   * @param mimeType Mime type of the file
   * @returns Blob representation of the file
   */
  const base64ToBlob = (base64, mimeType) => {
    const byteCharacters = atob(base64)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    return new Blob([byteArray], { type: mimeType })
  }

  /**
   * Plays the audio file associated with the photo on load
   * @param currentIndex Index of currently selected photo
   */
  const handleGallery = (currentIndex: number) => {
    // Unused
    const photo = photos[currentIndex]
    if (photo && audioRef.current) {
      window.location.hash = encodeURIComponent(photo.albumName)
      const audioBase64 = photo.audio
      const audioType = photo.audioType
      if (audioBase64) {
        // Convert Base64 string to a blob
        const audioBlob = base64ToBlob(audioBase64, audioType) // You might need to adjust the MIME type
        const audioUrl = URL.createObjectURL(audioBlob)

        const currentAudio = audioRef.current
        currentAudio.pause()
        currentAudio.src = audioUrl
        currentAudio.load() // In case the browser needs to load the audio file again
        currentAudio
          .play()
          .catch((error) => console.error('Audio play failed', error))
      }
    }
  }

  /**
   * Load photo when clicked
   * @param path Path of the photo
   * @param url URL of the photo (AWS)
   * @param audio Base64 representation of the audio file
   * @param audioType Audio file type (e.g. .mp3)
   * @returns Path of the current photo
   */
  const handlePhotoClick = (
    path: string,
    url: string,
    audio: string,
    audioType: string,
    index: number,
  ) => {
    // Invoke the callback with the clicked photo data
    setCurrentPhoto(path)
    setCurrentPhotoID(url)
    setCurrentAudio(audio)
    setCurrentIndex(index)
    let p: PhotoProps = {
      URL: url,
      title: '',
      play: false,
      ID: '',
      path: path,
      audio: audio,
      audioType: audioType,
    }
    onImageClick(p)
    if (!isPlaying) {
      PlayPause()
      stop()
    }
    return currentPhoto
    // PlayPause();
  }

  /**
   * Create a shareable link for the gallery
   */
  const handleShare = async () => {
    // Check if user is logged in
    if (session) {
      // Get the email and album name
      const email = session.getIdToken().payload.email
      const album = photos[0].albumName
      const tokens = {
        access: session.getAccessToken().getJwtToken(),
        id: session.getIdToken().getJwtToken(),
      }
      const link = await createShareableLink(email, album, tokens)
      setShareableLink(link)
    }
    //display link
  }

  const [dragIsOver, setDragIsOver] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  // Define the event handlers
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragIsOver(true)
  }

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragIsOver(false)
  }

  /**
   * Handles a file being dropped into onto upload button
   * @param event Drag event
   */
  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragIsOver(false)
    // Fetch the files
    const droppedFiles = Array.from(event.dataTransfer.files)
    setFiles(droppedFiles)
    setFile(URL.createObjectURL(droppedFiles[0]))
    if (session != null) {
      // Create the image data for AWS call
      const imgData: ImgData = {
        email: session.getIdToken().payload.email,
        album: albumName,
        imgType: getFileExtension(droppedFiles[0].name),
        title: 'Test',
        audioType: '.mp3',
        imgId: 'test',
        position: photos.length,
      }
      const tokens = {
        access: session.getAccessToken().getJwtToken(),
        id: session.getIdToken().getJwtToken(),
      }
      // Send the photo to AWS
      await postPhoto(imgData, tokens, droppedFiles[0])
      window.location.reload()
    }
  }

  /**
   * Handles a file being selected from the file input
   * @param e Change event
   */
  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setFile(URL.createObjectURL(e.target.files[0]))
    if (session != null) {
      // Create the image data for AWS call
      const imgData: ImgData = {
        email: session.getIdToken().payload.email,
        album: albumName,
        imgType: getFileExtension(e.target.files[0].name),
        title: 'Test',
        audioType: '.mp3',
        imgId: 'test',
        position: photos.length,
      }
      const tokens = {
        access: session.getAccessToken().getJwtToken(),
        id: session.getIdToken().getJwtToken(),
      }
      // Send the photo to AWS
      await postPhoto(imgData, tokens, e.target.files[0])
      window.location.reload()
    }
  }

  /**
   * Function to move the image to the left
   * @param index Index of the photo to move
   */
  const moveLeft = (index: number) => {
    const tokens = {
      access: session.getAccessToken().getJwtToken(),
      id: session.getIdToken().getJwtToken(),
    }

    const imgData1 = {
      email: session.getIdToken().payload.email,
      album: albumName,
      position: index - 1,
    }

    const imgData2 = {
      email: session.getIdToken().payload.email,
      album: albumName,
      position: index,
    }

    if (index > 0) {
      const newData = [...galleryData]
      ;[newData[index], newData[index - 1]] = [
        newData[index - 1],
        newData[index],
      ] // Swap elements
      setGalleryData(newData) // Update the state
      updatePhoto(newData[index - 1].url, imgData1, tokens)
      updatePhoto(newData[index].url, imgData2, tokens)
    }
  }

  /**
   * Function to move the image to the right
   * @param index Index of the photo to move
   */
  const moveRight = (index: number) => {
    const tokens = {
      access: session.getAccessToken().getJwtToken(),
      id: session.getIdToken().getJwtToken(),
    }

    const imgData1 = {
      email: session.getIdToken().payload.email,
      album: albumName,
      position: index + 1,
    }

    const imgData2 = {
      email: session.getIdToken().payload.email,
      album: albumName,
      position: index,
    }

    if (index < galleryData.length - 1) {
      const newData = [...galleryData]
      ;[newData[index], newData[index + 1]] = [
        newData[index + 1],
        newData[index],
      ] // Swap elements
      setGalleryData(newData) // Update the state
      updatePhoto(newData[index + 1].url, imgData1, tokens)
      updatePhoto(newData[index].url, imgData2, tokens)
    }
  }

  // Render the album component
  if (loaded === false) {
    return (
      <>
        <TileSpinner />

        <div className="mt-10 flex justify-center text-center">
          <div className="flex justify-between pr-4">
            <Button
              size="xl"
              className="text-3xl text-white hover:text-gray-200"
              backgroundColor={'#008080'}
              onClick={() => router.push('/auth/main')}
            >
              Home
            </Button>
          </div>
          <div className="flex justify-between pr-4">
            <Button
              size="xl"
              className="text-3xl text-white hover:text-gray-200"
              backgroundColor={'#008080'}
              onClick={() => router.push('/auth/main/userGallery')}
            >
              Gallery
            </Button>
          </div>
          <div className="flex justify-between pr-4">
            {photos.length > 0 && (
              <Button
                size="xl"
                className="text-3xl text-white hover:text-gray-200"
                backgroundColor={'#008080'}
                onClick={() => handleShare()}
              >
                Share
              </Button>
            )}
          </div>
          {loggedIn ? (
            <Button
              size="xl"
              className="text-3xl text-white hover:text-gray-200"
              backgroundColor={'#008080'}
              onClick={handleLogout}
            >
              Log Out
            </Button>
          ) : (
            'Please sign in'
          )}
        </div>
      </>
    )
  }
  return (
    <div
      ref={containerRef}
      className="container mx-auto h-full w-full px-5 py-24"
    >
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50px',
          width: 'w-full',
          border: '1px dotted',
          backgroundColor: dragIsOver ? '#F1F2EE' : '#008080',
          fontSize: '25px',
        }}
      >
        <button onClick={() => uploadRef.current?.click()}>
          Click or drag and drop photos here
        </button>

        <input
          type="file"
          accept="images/*"
          ref={uploadRef}
          onChange={handleChange}
          style={{ display: 'none' }}
        />
      </div>
      <div className="-m-4 flex flex-wrap">
        {galleryData.map((path, index) => (
          <div
            key={`${path}-${index}`}
            className="xs:w-1/2 p-2 md:px-6 lg:w-1/3 lg:py-12"
          >
            <div
        className="transform transition-transform duration-500"
        style={{ transform: `rotate(${path.rotation}deg)` }}
      >
            <Photo
              caption="test"
              URL={path.original}
              ID={`${path}-${index}`}
              title="test"
              onClick={() =>
                handlePhotoClick(path.original, path.url, path.audio, '.mp3',index)
              }
              play={true}
            />
            </div>
            {index > 0 && (
              <Button
                title="move-left"
                size="xs"
                onClick={() => moveLeft(index)}
              >
                {' '}
                {'<'}{' '}
              </Button>
            )}
            {index < galleryData.length - 1 && (
              <Button
                title="move-right"
                size="xs"
                onClick={() => moveRight(index)}
              >
                {' '}
                {'>'}{' '}
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 space-y-4 text-center">
        <div className="flex justify-between pr-4">
          <Button
            size="xl"
            className="text-3xl text-white hover:text-gray-200"
            color="gold" variant="outline" 
            onClick={() => router.push('/auth/main')}
          >
            Home
          </Button>
        </div>
        <div className="flex justify-between pr-4">
          <Button
            size="xl"
            className="text-3xl text-white hover:text-gray-200"
            color="gold" variant="outline"
            onClick={() => router.push('/auth/main/userGallery')}
          >
            Gallery
          </Button>
        </div>

        <div className="flex items-center gap-2 mt-6">
        {isEditing ? (
          <>
            <input
              type="text"
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              placeholder="Enter new gallery name"
              className="border p-2 rounded"
            />
            <Button onClick={handleSaveName} 
            className="text-3xl text-white hover:text-gray-200"
            color="gold" variant="outline" 
            >
              Save
            </Button>
          </>
        ) : (
          <Button 
          onClick={() => setIsEditing(true)} 
          className="text-3xl text-white hover:text-gray-200"
              color="gold" variant="outline" 
          >
            Edit Gallery
          </Button>
        )}
      </div>
        {photos.length > 0 && (
        <div className="flex justify-between pr-4">
            <Button
              size="xl"
              className="text-3xl text-white hover:text-gray-200"
              color="gold" variant="outline" 
              onClick={() => handleShare()}
            >
              Share
            </Button>
        </div>
        )}
        {loggedIn ? (
          <div className="flex justify-between pr-4">
              <Button
              className="text-3xl text-white hover:text-gray-200"
                color="gold" variant="outline" size="lg"
                onClick={handleLogout}
              >
                Log Out
              </Button>
          </div>
          ) : (
            'Please sign in' 
          )}
     
            <div className="flex justify-between">
              <Button
                size = "xl"
                className="text-3xl text-white hover:text-gray-200"
                color="gold" variant="outline" 
                onClick = {() => rotateImage()}
              >
                Rotate Photo
              </Button>
            </div>
      </div>
      
      {noPhotos && (
        <div className="mt-10">
          <Alert severity='info'>Photos must be uploaded to an album before it is saved</Alert>
        </div>
      )}
      <FloatingPortal>
        <ConfirmationModal
          title="Shareable Link"
          body={
            <>
              <p className="pb-3 text-center">
                Here&apos;s a URL that you can give to friends and family so
                that they can view this gallery.{' '}
                <span className="font-bold underline italic text-red-500">
                <br></br>This link will expire after 7 days.
                </span>
              </p>
              <p className="font-bold">{shareableLink}</p>
            </>
          }
          isOpen={shareableLink !== ''}
          onClose={() => setShareableLink('')}
          onConfirm={() => setShareableLink('')}
        ></ConfirmationModal>
      </FloatingPortal>
    </div>
  )
}

export default Album
