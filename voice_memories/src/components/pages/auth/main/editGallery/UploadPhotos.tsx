import React, {useContext, useEffect, useRef, useState} from 'react'
import JSZip from "jszip"
import fs from "fs"


export default function UploadPhotos(){
    const [photosSelected, setPhotosSelected] = useState([]);
    const [uploadError, setUploadError] = useState(false);

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
            zip.forEach(async (fileName) => {
                if(fileName.match("/\.(jpg|png|jpeg)")){
                    const file = zipObj.file(fileName);
                    //Load the file as a blob
                    const imgBlob = await file.async('blob');
                    //Convert from blob into object
                    const imgURL = URL.createObjectURL(imgBlob);

                    //Save the image URL into the photos selected array
                    photosSelected.push(imgURL);
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

    function confirmPhotos(){
    }
    return (
        <div onClick={toggleErrorMsg}>
            <h1> Choose Photos to Upload</h1>
            {toggleErrorMsg && <p> Some Files were not decompressed correctly</p>}
            <div>
                <ul>
                {
                    photosSelected.map((photoURL) =>
                        <li>
                            <img src = {photoURL.imageURL}></img>
                        </li>     
                    )
                }
                </ul>
            </div>
            <div id = "zipUpload" onDrop = {decompressZip}>
                Drag a .zip file here with you're photos
            </div>
            <p>Or Select photos individually from your computer</p>
            <label htmlFor='computerUploads'>Upload Photos from your computer</label>
            <input id = "computerUploads" type = "file" multiple/>
            <div>
                <button> Confirm Uploaded Photos</button>
                <button disabled> Remove Selected Photos</button>
            </div>
        </div>
    )
}