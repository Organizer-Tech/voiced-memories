import {
  PencilSquareIcon,
  PlayIcon,
  StopIcon,
} from '@heroicons/react/24/outline'
import React, {
  ChangeEvent,
  DragEvent,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Button } from '@/components/primitives/Button'
import { Modal } from '@/components/primitives/Modal'
import { EjectIcon } from '@/components/primitives/ConfirmationModal/EjectIcon'
import { StopCircleIcon } from '@heroicons/react/20/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faCircle } from '@fortawesome/free-solid-svg-icons'
import { CognitoUserSession } from 'amazon-cognito-identity-js'
import { AccountContext } from '@/components/utils/Account'
import { getAllUrls, getPhoto, postPhoto, createShareableLink, deletePhoto, updatePhoto} from '@/components/utils/apiFunctions'
import {ImgData} from  '@/components/pages/auth/main/editGallery/EditGalleryAlbum'
import {PhotoProps} from '@/components/primitives/Photo/index'

import { ToastContainer, Zoom, toast, useToast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ConfirmationModalProps {
  title: string
  body: React.ReactElement | string
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  onRecord?: () => void
  isRecording?: boolean
  albumName?: string
  audioRef?:HTMLAudioElement
  photo?: PhotoProps
  session?: CognitoUserSession
}

export const ConfirmationModal = ({
  title,
  body,
  isOpen,
  onClose,
  onConfirm,
  onRecord,
  isRecording,
  albumName,
  audioRef,
  photo,
}: ConfirmationModalProps) => {
  const isDeleteModal = title.toLowerCase().includes('delete')
  const isEditModal = title.toLowerCase().includes('edit')
  const isRecordModal = title.toLowerCase().includes('recording')
  const [loggedIn, setLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
 const { getSession, logout } = useContext(AccountContext) 
  const [session, setSession] = useState<CognitoUserSession | null>(null)
  const [dragIsOver, setDragIsOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [file, setFile] = useState<string | undefined>(undefined);
  const uploadRef = useRef<HTMLInputElement>(null);
  
  const toastError = () => {
    toast.error('File of incorrect type. Please drag and drop an audio file.', {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: "dark",
      transition: Zoom,
      });
  }

  // Define the event handlers
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setDragIsOver(true);
  };
  
  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setDragIsOver(false);
  };
  
  function getFileExtension(filename: String) {
    return '.' + filename.split('.').pop()
  }
  

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
      console.log("File dropped");
      event.preventDefault();
      setDragIsOver(false);
      // Fetch the files
      const droppedFiles = Array.from(event.dataTransfer.files);
      console.log(droppedFiles[0].type.includes("audio/"))
      if(droppedFiles[0].type.includes("audio/")){
      setFiles(droppedFiles);
      console.log(`droppedfile: ${droppedFiles[0]}`);
      setFile(URL.createObjectURL(droppedFiles[0]));
      const session = await getSession();
      setSession(session);
      setLoggedIn(true);
      setIsLoading(false);
      console.log(`session ${session}`)
      if (session != null) {
          const imgData: ImgData = {
              email: session.getIdToken().payload.email,
              album: albumName,
              imgType: getFileExtension(photo.path),
              title: "Test",
              audioType: getFileExtension(droppedFiles[0].name),
              imgId: "test"
          }
          const tokens = {
              access: session.getAccessToken().getJwtToken(),
              id: session.getIdToken().getJwtToken(),
          };
          console.log(`calling update Photo`)
          await updatePhoto(photo.URL,imgData, tokens,undefined, droppedFiles[0]);
          window.location.reload()
  }
}else {
       toastError();
}
}
  
  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    console.log(e.target.files)
    setFile(URL.createObjectURL(e.target.files[0]))

    const session = await getSession();
    setSession(session);
    setLoggedIn(true);
    setIsLoading(false);
    if (session != null) {
      const imgData: ImgData = {
        email: session.getIdToken().payload.email,
        album: albumName,
        imgType: getFileExtension(photo.path),
        title: 'Test',
        audioType:getFileExtension(e.target.files[0].name),
        imgId: 'test',
      }
      const tokens = {
        access: session.getAccessToken().getJwtToken(),
        id: session.getIdToken().getJwtToken(),
      }
      console.log(`calling update Photo`)
      await updatePhoto(photo.URL,imgData, tokens,undefined, e.target.files[0])
      window.location.reload()
    }
  }



  return (
    <Modal title={title} isOpen={isOpen} handleClose={onClose}>
      <div className="mt-3" >
        {typeof body === 'string' ? (
          <div className="mt-2 max-w-xl text-gray-500">
            <p>{body}</p>
          </div>
        ) : (
          body
        )}
      </div>

      <div className="mt-5 justify-end">

        {isDeleteModal && (
          <Button className="flex items-center" onClick={onConfirm} color="red">
            <span className="mr-2">Delete</span>{' '}
            <EjectIcon className="h-5 w-5" />
          </Button>
        )}
        {isEditModal && (
          <Button
            className="flex items-center"
            onClick={onConfirm}
            color="blue"
          >
            <span className="mr-2">Confirm</span>{' '}
            <PencilSquareIcon className="h-5 w-5" />
          </Button>
        )}


          {isRecordModal && (
            <div className="flex justify-center mb-3">
              <span className="bg-">Current Audio:</span>
              {audioRef? ( <audio controls src = {audioRef.src}></audio>

              ):
              (
                <audio controls ></audio>
              )}
            </div>
          )}

        {isRecordModal && (
          <Button className=" mb-2 flex items-center" onClick = {onRecord} color="black">
             <span className="mr-2">
             {isRecording ? 'Stop Recording' : 'Record Audio'}
              </span>
                                <span className="sr-only">
                                    {isRecording ? 'Pause Recording' : 'Record Audio'}
                                </span>
                                    {isRecording ? (
                                    <StopCircleIcon className="h-0 w-0 text-black" />
                                ) : (
                                    <FontAwesomeIcon
                                        icon={faCircle}
                                        className="h-6 w-6 text-red-500"
                                    />
                                )}
                            </Button>
        )}
         
        {isRecordModal && ( 
              <div className="inline-flex relative items-center justify-center w-full">
              <hr className="w-96 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
              <span className="px-3 text-3xl font-medium absolute text-gray-900 bg-white dark:text-black">or</span>
          </div>
        )}

          {isRecordModal && (
    
         <div
         onDragOver={handleDragOver}
         onDragLeave={handleDragLeave}
         onDrop={handleDrop}
         style={{
             display: "flex",
             justifyContent: "center",
             alignItems: "center",
             height: "50px",
             width: "w-full",
             border: "1px dotted",
             backgroundColor: dragIsOver ? "#F1F2EE" : "#008080",
             fontSize: "22px",
             marginTop: ".5rem" // Added margin-top

         }}
     >
         <button onClick={() => uploadRef.current?.click()}>Click or drag and drop audio here</button>

         <input
             type="file"
             ref={uploadRef}
             onChange={handleChange}
             style={{display: 'none'}}
             accept = "audio/*"
         />
          
        </div>
      
      
        )}

{isRecordModal && (
          <Button className="mr-2 mt-2 flex items-center" onClick={onConfirm} color="green">
          <span className=""> Confirm </span>{' '}
        </Button>
        )}

        <Button
          color="gray"
          className="mr-3 bg-gray-300 text-black"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
      <ToastContainer/>
    </Modal>
  )
}

