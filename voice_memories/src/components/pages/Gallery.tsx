'use client'

import React, { useState, useEffect, useRef } from 'react'
import Album, { ImageData } from './Album'
import Photo from '../primitives/Photo'
import {
  PlayIcon,
  PauseIcon,
  StopIcon,
  TrashIcon,
} from '@heroicons/react/20/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faCircle } from '@fortawesome/free-solid-svg-icons'
import useSound from 'use-sound'
import {Howl, Howler} from 'howler';

// @ts-nocheck
// Galley Component used in gallery page
function Gallery() {
  let [activeImage, setActiveImage] = useState<ImageData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false); // New state to track play/pause
  const [isRecording, setIsRecording] = useState(false); //New state to track record/stop record
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  let currentSound = '';
  const [sound, setSound] = useState<Howl>();
  const [src, setSrc] = useState('');
// useffect to create new sound object
  useEffect(() => {
    console.log("new usesound created");
    setSound(new Howl({src}));
    console.log("Sound is:")
    console.log(sound);
    console.log("active image audio url:")
    // @ts-ignore
    console.log(activeImage?.audio)
    console.log("current src is:");
    console.log(src);
  }, [src]);

  const handleImageClick = (imageData: ImageData) => {
    if (imageData.path.includes('Robert')) {
      setSrc('Robert Bell.m4a')
      sound?.stop()
    } else if (imageData.path.includes('jersey')) {
      setSrc('Mom and Baseball.m4a')
      sound?.stop()
    } else if (imageData.path.includes('Anna')) {
      setSrc('Anna and Martin Hanson.m4a')
      sound?.stop()
    } else if (imageData.path.includes('Family')) {
      setSrc('Myliss home coming.m4a')
      sound?.stop()
    } else if (imageData.path.includes('Dad')) {
      setSrc('Dad Victoria Landing.m4a')
      sound?.stop()
    }
    sound?.on("end",function() {
      setIsPlaying(false);
    });
    setActiveImage(imageData)
  }

  const togglePlayPause = () => {
    // if(activeImage?.audio != null){
    setIsPlaying(!isPlaying) // Toggle the playing state
    PlayAudio() //Play/pause audio
    // }
  }


// function to start recording audio
  const startRecording = async () => {
    try {
      console.log("Getting media device");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (event) => {
        chunks.current.push(event.data);
      };
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        console.log(audioRef.current)
        if (audioRef.current) {
          console.log("Audio recorded");
          audioRef.current.src = url;
          audioRef.current.play();
          setSrc(src);
          if(activeImage)
            // @ts-ignore
          activeImage.audio = src;
        }

        chunks.current = [];
      };
      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };
// function to stop recording audio
 const stopRecording = () => {
  if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
    mediaRecorder.current.stop();
    setIsRecording(false);
    if(activeImage && audioRef.current){
      console.log("Setting audio source for active image.")
      // @ts-ignore
    activeImage.audio = audioRef.current.src;
    // setSrc(audioRef.current.src);
    console.log("Active image audio is:")
    // @ts-ignore
    console.log(activeImage.audio)
    }
  }
};
// function to toggle record/stop record
 const toggleRecord = () => {
  setIsRecording(!isRecording);
  if(!isRecording) {
    startRecording();
  }else{
    stopRecording();
  }
}
// function to play/pause audio
  const PlayAudio = () => {
    if (isPlaying) {
      sound?.pause()
    } else {
      console.log("trying to play Howl");
      sound?.play();
    }
  }
//  function to stop audio
  const handleStop = () => {
    sound?.stop();
    setIsPlaying(false);
  }

  const handleDownload = () => {
    // @ts-ignore
    if (activeImage && activeImage.audio) {
      const link = document.createElement('a');
      // @ts-ignore
      link.href = activeImage.audio;
      link.download = 'recorded_audio.mp3'; // Specify the filename for the downloaded file
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error('No audio blob available for download');
    }
  };

  
  // console.log(isPlaying)
  return (
    <section id="features">
      <div className="min-w-screen flex min-h-screen flex-col lg:flex-row">
        <div className="flex flex-1 flex-col bg-cream">
          <div className="flex flex-grow items-center justify-center p-20">
            {activeImage && (
              <Photo
                caption="test"
                URL={`/${activeImage.path}`}
                ID={null}
                title="test"
                // @ts-ignore
                audio = {activeImage?.audio}
                width={window.innerWidth}
                height={window.innerHeight}
                play={isPlaying}
              />
            )}
          </div>
          <div className="flex h-1/5 w-full items-center justify-around">
            <div className="p-2">
              <button
                onClick={togglePlayPause}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-maroon ring-4 ring-white transition hover:bg-maroon"  >

                <span className="sr-only">
                  {isPlaying ? 'Pause Audio' : 'Play Audio'}
                </span>
                {isPlaying ? (
                  <PauseIcon className="h-6 w-6 text-white" />
                ) : (
                  <PlayIcon className="h-6 w-6 text-white" />
                )}
              </button>
            </div>
            <div className="p-2">
              <button
                onClick={toggleRecord}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-maroon ring-4 ring-white transition hover:bg-maroon"
              >
                <span className="sr-only">
                  {isRecording ? 'Pause Recording' : 'Record Audio'}
                </span>
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
              <button className="flex h-12 w-12 items-center justify-center rounded-full bg-maroon ring-4 ring-white transition hover:bg-maroon">
                <span className="sr-only">Delete</span>
                <TrashIcon className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="p-2">
              <button className="flex h-12 w-12 items-center justify-center rounded-full bg-maroon ring-4 ring-white transition hover:bg-maroon">
                <span className="sr-only">Save</span>
                <FontAwesomeIcon icon={faSave} className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>
        </div>
        <div className="w-full overflow-auto bg-maroon lg:w-1/3">
          <Album
            onImageClick={handleImageClick}
            isPlaying
            stop={handleStop}
            PlayPause={togglePlayPause}
          />
        </div>
      </div>
      <button onClick={handleDownload}>Download Audio</button>
      <audio controls ref={audioRef} />
    </section>
    
  )
}

export default Gallery
