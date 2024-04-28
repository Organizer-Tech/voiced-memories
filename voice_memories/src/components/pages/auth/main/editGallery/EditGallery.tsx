'use client'

import React, {useContext, useEffect, useRef, useState} from 'react'
import EditGalleryAlbum, {getCurrentAudio, getCurrentPhoto, getCurrentURL, ImageData, ImgData} from "@/components/pages/auth/main/editGallery/EditGalleryAlbum";
import Photo, {PhotoProps} from '@/components/primitives/Photo'
import {
    PlayIcon,
    PauseIcon,
    StopIcon,
    TrashIcon,
} from '@heroicons/react/20/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faCircle } from '@fortawesome/free-solid-svg-icons'
import {deletePhoto, updatePhoto} from "@/components/utils/apiFunctions";
import {AccountContext} from "@/components/utils/Account";
import {CognitoUserSession} from "amazon-cognito-identity-js";
import { FloatingPortal } from '@floating-ui/react';
import { ConfirmationModal } from '@/components/primitives/ConfirmationModal/ConfirmationModal';


function EditGallery() {
    // States
    const [loggedIn, setLoggedIn] = useState(false); // Set but not referenced
    const [isLoading, setIsLoading] = useState(true); // Set but not referenced
    const [session, setSession] = useState<CognitoUserSession | null>(null);
    const [activeImage, setActiveImage] = useState<PhotoProps | null>(null);
    const [isPlaying, setIsPlaying] = useState(false) // New state to track play/pause
    const [isRecording, setIsRecording] = useState(false); //New state to track record/stop record
    const [albumName, setAlbumName]=useState('')
    const [imgData,setImgData] = useState<ImgData | null>(null);
    const [activeSound, setActiveSound] = useState<HTMLAudioElement | null>(null)
    const [alreadyUploaded,setAlreadyUploaded] = useState(false); // Unused
    const [sound, setSound] = useState<Howl>(); // Unused
    const [src, setSrc] = useState(null); // Set but not referenced
    const [oldsrc, setOldSrc] = useState(null); // Set but not referenced
    const [recordClick, setRecordClick] = useState(false);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    
    // Refs
    const audioRef = useRef<HTMLAudioElement>(null) // Unused
    const mediaRecorder = useRef<MediaRecorder | null>(null)
    const chunks = useRef<Blob[]>([])
    const blobRef = useRef<Blob>(null)

    // Context
    const { getSession, logout } = useContext(AccountContext)

    let currentImage: string;
    let currentSound = '';
    let currentAudio: HTMLAudioElement | null;
    
    // Unused
    function extractFileType(dataUrl: string): string | null {

        const parts = dataUrl.split(',');
        if (parts.length < 2) {
          return null; 
        }
        
     
        const prefix = parts[0];
        const typeParts = prefix.split(';');
        if (typeParts.length < 1) {
          return null;
        }
      
        // Extract the media type from the first part (e.g., 'image/jpeg')
        const mediaType = typeParts[0].substring(typeParts[0].indexOf(':') + 1);
      
        return mediaType || null; // Return the media type, or null if not found
      }
    
    /**
     * Creates a blob from a base64 string
     * @param base64 Base64 string of a file
     * @param mimeType Mime type of the file
     * @returns Blob object representing the file
     */
    const base64ToBlob = (base64: string, mimeType: string) => {
        const byteCharacters = atob(base64)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        console.log("Creating new Blob")
        return new Blob([byteArray], { type: mimeType })
      }

    /**
     * Moves photo from side bar to main display and loads any associated audio
     * @param photo PhotoProps object with all photo data
     */  
    const handleImageClick = (photo: PhotoProps) => {
        console.log("imageClicked")
        // Pause the current audio
        activeSound?.pause();
        if(activeSound){
            activeSound.src = null;
        }
        setIsPlaying(false);

        // Set the new image and audio
        currentImage = getCurrentPhoto();
        currentSound = getCurrentAudio();
        var audioBlob;
        var audioUrl;

        // If there is audio, create a new audio blob and load it
        if(currentSound){
            audioBlob = base64ToBlob(currentSound, 'audio/wav');
            audioUrl = URL.createObjectURL(audioBlob);
            currentAudio = new Audio(audioUrl);
            setActiveSound(currentAudio);
        }
        //@ts-ignore src does exist, but TS doesn't know that
        document.getElementById("activeImage").src = currentImage;
        setActiveImage(photo);
   
      
    }
    
    // Set the image dimensions on page load and add listener for resizing
    useEffect(() => {
        const updateDimensions = () => {
            setImageDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);

        return () => {
            activeSound?.pause();
            window.removeEventListener('resize', updateDimensions);
        }
    }, []); 

    /**
     * Toggles the play/pause state of the audio
     */
    const togglePlayPause = () => {
        if(activeImage && activeImage.audio){
        setIsPlaying(!isPlaying) // Toggle the playing state
        PlayAudio() //Play/pause audio
        }

    }

    /**
     * Begins the recording
     */
    const startRecording = async () => {
        try {
          console.log("Getting media device");
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          console.log(stream)
          mediaRecorder.current = new MediaRecorder(stream); 
          // Add event listeners for the media recorder
          mediaRecorder.current.ondataavailable = (event) => {
            console.log("Current Chunks");
            console.log(chunks.current)
            chunks.current.push(event.data);
          };
          mediaRecorder.current.onstop = () => {
            // Create blob from recorded chunks
            const blob = new Blob(chunks.current, { type: 'audio/wav' });
            blobRef.current = blob;
            const url = URL.createObjectURL(blob);
            console.log("Blob MIME type:", blob.type); 
            // Set states for the new audio
            console.log("Audio recorded");
            setActiveSound(new Audio(url))
            setSrc(url);
            // Reset the chunks
            chunks.current = [];
          };

          // Start recording
          mediaRecorder.current.start();
          setIsRecording(true);
        } catch (error) {
          console.error('Error starting recording:', error);
        }
      };
    /**
     * Stop recording 
     */
    const stopRecording = () => {
      // Check if the media recorder is active
      if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
        // Stop the media recorder
        mediaRecorder.current.stop();
        setIsRecording(false);

        // Log the recorded audio information
        if(activeImage && activeImage.audio){
            console.log("Active image audio is:")
            console.log(activeImage.audio)
        }
      }
    };

    /** 
     * Changes recording state
     */
     const toggleRecord = () => {
        // Check if there is an active image
        if (activeImage !== null){
            // Toggle the recording state
            setIsRecording(!isRecording);
            // Start or stop recording
            if (!isRecording) {
                startRecording();
            } else {
                stopRecording();
            }
        }
    }

    /** 
     * Plays audio if activeSound is set
     */
    const PlayAudio = () => {
        if (!isPlaying) {
            console.log("playing audio")
            console.log(activeSound)
            activeSound?.play()
        } else {
            activeSound?.pause()
        }
    }

    /** 
     * Stops audio and resets the current time of audio to 0
     */
    const handleStop = () => {
        activeSound.pause();
        activeSound.currentTime = 0;
        setIsPlaying(false)
    }

    // Add event listener for when audio ends
    if (activeSound) activeSound.addEventListener('ended', handleStop);


    /**
     * Deletes image
     */
    const deleteImage = async () => {
        console.log(getCurrentURL())
        // Get the current Cognito session and set related states
        const session = await getSession();
        setSession(session);
        setLoggedIn(true);
        setIsLoading(false);
        // If there is a session, delete the photo and reload the page
        if (session != null) {
            const tokens = {
                access: session.getAccessToken().getJwtToken(),
                id: session.getIdToken().getJwtToken(),
            };
            deletePhoto(getCurrentURL(), tokens);
            window.location.reload();
        }
    }


    /**
     * Creates a file from a blob. Used for downloading audio
     * @param blob Audio blob
     * @param filename What you want to name the file
     * @param mimeType Same as filetype should be (audio/*) where * is any audio extension.
     * @returns File object from Blob
     */
    function createAudioFileFromBlob(blob: Blob, filename: string, mimeType: string): Promise<File> {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          // When the FileReader has data loaded, create a new file from the array buffer
          fileReader.onload = () => {
            const arrayBuffer = fileReader.result as ArrayBuffer;
            const file = new File([arrayBuffer], filename, { type: mimeType });
            resolve(file); 
          };
          // Reject if fails
          fileReader.onerror = () => {
            reject(fileReader.error); 
          };
          // Load blob data into the file reader
          fileReader.readAsArrayBuffer(blob); 
        });
      }


    /**
     * Handles clicking of confirmation button on confirmation Modal when recording audio
     */
    const handleConfirmRecord = async () => {
        // Get the current Cognito session and set related states
        const session = await getSession();
        setSession(session);
        setLoggedIn(true);
        setIsLoading(false);
        // If there is a session, create a new audio file from the blob and update the photo
        if (session != null) {
            const tokens = {
                access: session.getAccessToken().getJwtToken(),
                id: session.getIdToken().getJwtToken(),
            };
            if(blobRef.current) {
                // Create a new audio file from the recording blob
                createAudioFileFromBlob(blobRef.current, 'audio.wav', 'audio/wav' )
                .then(async (file) => {
                    // Use the audio buffer as needed
                    console.log("File:", file);
                    // Create URL for the audio file to be used as a source
                    activeSound.src = URL.createObjectURL(blobRef.current)
                    console.log(`imgdata = ${imgData}`)
                    // Create ImgData object to update the photo
                    const img: ImgData = {
                        email: session.getIdToken().payload.email,
                        album: albumName,
                        audioType: getFileExtension(file.name),  
                        title: 'test',                   
                        imgType: getFileExtension(activeImage.path),
                        imgId: 'test',

                    }
                    console.log(img.audioType)
                    console.log(img.imgId)

                    // Update the photo entry in AWS with the new audio file
                    await updatePhoto(getCurrentURL(),img,tokens,undefined,file)
                    window.location.reload();
                })
                .catch((error) => {
                    console.error("Error creating audio file:", error);
                });
            }
        }
        setRecordClick(false)
    }

    /**
     * Handles clicking of cancel button on confirmation Modal when recording audio
     */
    const handleCancelRecord = () => {

        if(activeSound)
        activeSound.src = currentAudio?.src
        setRecordClick(false)   
     }

     /**
      * Toggles the record click state
      */
     const toggleRecordClick = () => {
        console.log(`Record cLicked`)
        if(activeImage !== null) {
            // Save old audio
            if (activeImage.audio) setOldSrc(activeImage.audio)
            // Toggle the record click state
            setRecordClick(!recordClick);
        }
    }

    /**
     * Updates the album name
     * @param newAlbumName New name for the album
     */
    const updateAlbumName = (newAlbumName:string) => {
        setAlbumName(newAlbumName)
    };

    /**
     * Updates the image data
     * @param newImgData New ImgData object to update the image
     */
    const updateImageData = (newImgData:ImgData) => { // Unused
        setImgData(newImgData)
    }

    /**
     * Gets the file extension of a file
     * @param filename Name of the file
     * @returns File extension
     */
    function getFileExtension(filename: String) {
        return '.' + filename.split('.').pop()
    }

    return (
        <section id="features">
            <div className="min-w-screen flex min-h-screen flex-col lg:flex-row">
                <div className="flex flex-1 flex-col bg-cream">
                    <div className="flex items-center justify-center pr-32 pl-32 pt-2">
                    <img
                            alt=""
                            src={currentImage || null}
                            height={imageDimensions.height}
                            width={imageDimensions.width}
                            id="activeImage"
                        />

                    </div>
                    <div className="flex p-5 w-full items-center justify-around">
                        <div className="p-2">
                            {/* Play/Pause Button */}
                            <button
                                onClick={togglePlayPause}
                                className="flex h-12 w-12 items-center justify-center rounded-full bg-maroon ring-4 ring-white transition hover:bg-maroon"
                            >
                                <span className="sr-only">
                                    {isPlaying ? 'Pause Audio' : 'Play Audio'}
                                </span>
                                {isPlaying ? (
                                    <PauseIcon className="h-6 w-6 text-white" />
                                ) : (
                                    <PlayIcon className="h-6 w-6 text-white"/>
                                    
                                )}
                            </button>
                        </div>
                        <div className="p-2">
                            {/* Record Button */}
                            <button
                                onClick={toggleRecordClick} 
                                className="flex h-12 w-12 items-center justify-center rounded-full bg-maroon ring-4 ring-white transition hover:bg-maroon"
                            >
                            {/* <audio ref={audioRef} /> */}
                                <span className="sr-only">
                                    {isRecording ? 'Pause Recording' : 'Record Audio'}
                                </span>
                                {/* Change icon based on recording state */}
                                {isRecording ? (
                                    <StopIcon className="h-6 w-6 text-white" />
                                ) : (
                                    <FontAwesomeIcon
                                        icon={faCircle}
                                        className="h-6 w-6 text-red-500"
                                    />
                                )}
                            </button>
                        </div>
                        <div className="p-2">
                            {/* Delete Button */}
                            <button 
                                onClick={deleteImage} 
                                className="flex h-12 w-12 items-center justify-center rounded-full bg-maroon ring-4 ring-white transition hover:bg-maroon"
                            >
                                <span className="sr-only">Delete</span>
                                <TrashIcon className="h-6 w-6 text-white" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="w-full overflow-auto bg-maroon lg:w-1/3">
                    {/* Sidebar, displays photos in album */}
                    <EditGalleryAlbum
                        onImageClick={handleImageClick}
                        isPlaying
                        stop={handleStop}
                        PlayPause={togglePlayPause}
                        imagePath={getCurrentPhoto()}
                        updateAlbumName = {updateAlbumName}
                        />
                </div>
                <div>
                    {/* Confirmation Modal for recording audio */}
                    <FloatingPortal>
                        <ConfirmationModal
                            title="Recording Interface"
                            body={
                                <>
                                    <p className="pb-3 text-center">
                                    Please select what you would like to do:{' '}
                                    
                                    </p>
                                <p className="font-bold">{}</p>
                                </>
                            }
                            isOpen={recordClick !== false}
                            onClose={handleCancelRecord}
                            onConfirm={handleConfirmRecord}
                            onRecord={toggleRecord}
                            isRecording = {isRecording}
                            audioRef = {activeSound ? (
                                activeSound
                            ): (
                                null
                            )}
                            photo = {activeImage}
                            albumName={albumName}
                            session = {session}
                        />
                    </FloatingPortal>
                </div>
            </div>

        </section>
      
    )
}

export default EditGallery