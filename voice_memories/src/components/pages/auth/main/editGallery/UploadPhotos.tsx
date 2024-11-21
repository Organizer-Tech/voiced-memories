import React, {useContext, useEffect, useRef, useState} from 'react'
import JSZip from "jszip"
import fs from "fs"


export default function UploadPhotos({photoUploadHandler}){
    const [photosSelected, setPhotosSelected] = useState([]);
    const [uploadError, setUploadError] = useState(false);
    //Receive a reference to an underlying DOM Element
    const photoUploadRef = useRef(null);
    const zipUploadRef = useRef(null);

    function removePhotosSelected(photo){

    }
    async function decompressZip(e){
        const draggedItems = e.dataTransfer.files;
        const zipFiles = [];
        
        //User can drag multiple .zip files (if needed)
        for(const file of draggedItems){
            if(file.name.endsWith(".zip")){
                zipFiles.push(file);
            }else{
                setUploadError(true);
            }
        }

        const zipObj = new JSZip();
        for(const zipFile of zipFiles){

            //Decompress the zip file
            let zip = await zipObj.loadAsync(zipFile);

            //For each file convert into images from blobs
            Object.keys(zip.files).forEach(async (fileName) =>{
                let file = zip.files[fileName];
                if(fileName.match("/\.(jpg|png|jpeg)")){
                    //Load the file as a blob
                    const imgBlob = await file.async('blob');
                    //Convert from blob into object
                    const imgURL = URL.createObjectURL(imgBlob);
                   
                    //Save the image URL into the photos selected array
                    setPhotosSelected((prevItems) => [...prevItems,imgURL]);
                    console.log(imgURL);
                }else{
                    setUploadError(true);
                }
            });
        }
    }

    //Toggle the error message visibility to either true or false
    function toggleErrorMsg(){
        if(toggleErrorMsg){
            setUploadError(false);
        }
    }

    function uploadSinglePhoto(){
        //Trigger the hidden input button click event 
        photoUploadRef.current.click();
        //Once the user chooses a single photo, the onChange event of the hidden input is fired
    }

    function uploadZipFile(){
        //Trigger hidden input button click event
        zipUploadRef.current.onDrop();
    }

    return (
        <div onClick={toggleErrorMsg} className = "flex flex-col justify-center text-2xl">
            {uploadError && <p className = "text-red-600 font-bold italic"> Some Files were not decompressed correctly</p>}
            <div id = "zipUpload" onDragOver={(event) => {event.preventDefault()}} onDrop = {uploadZipFile} className = "text-white text-center mb-6 py-4 border-2 h-24 border-dashed font-bold">
                Drag a .zip file here with you're photos
                <input type = "file" accept ="images/*" ref = {zipUploadRef} onChange = {decompressZip} className = "hidden"/> 
            </div>
            <div className = "text-white border-2 border-yellow-400 text-center h-24 py-2 font-bold" 
                onClick = {uploadSinglePhoto}>
                or click here to select photos individually from your computer
                <input type = "file" accept ="images/*" ref = {photoUploadRef} onChange = {photoUploadHandler} className = "hidden"/> 
            </div>
        </div>
    )
}