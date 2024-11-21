import React, {useContext, useEffect, useRef, useState} from 'react'
import JSZip from "jszip"


export default function UploadPhotos({photoUploadHandler, fileExtensionHandler, mouseHandler}){
    const [uploadError, setUploadError] = useState(false);
    //Receive a reference to an underlying DOM Element
    const photoUploadRef = useRef(null);

    async function decompressZip(e){
        const draggedItems = e.dataTransfer.files;
        const zipFiles = [];
        
        //User can drag multiple .zip files (if needed)
        for(const file of draggedItems){
            if(file.name.endsWith(".zip")){
                zipFiles.push(file);
            }else{
                setUploadError(true);
                return;
            }
        }

        const zipObj = new JSZip();
        for(const zipFile of zipFiles){

            //Decompress the zip file
            let zip = await zipObj.loadAsync(zipFile);

            //For each file convert into images from blobs
            Object.keys(zip.files).forEach(async (fileName) =>{
                let file = zip.files[fileName];
                //Removes the relative folder path to the file
                const fileNameOnly = file.name.split("/").pop();
                const extension = fileExtensionHandler(fileNameOnly);
                if(!(fileNameOnly.startsWith("._")) && extension.match(/\.(png|jpg|jpeg)$/)){
                    //Load the file as a blob to then convert into a blob
                    const imgBlob = await file.async('blob');           
                    const sendFile = new File([imgBlob], fileNameOnly, {type: "image/" + extension.split(".").pop()});
                    
                    //Create a fake event that will call the photo upload handler for each image
                    let mimicChangeEv = new Event("change", {bubbles: true});
                    //Reset the value in case a previous image is inside the input element
                    photoUploadRef.current.value = "";
                    const transferFile = new DataTransfer();
                    transferFile.items.add(sendFile);
                    photoUploadRef.current.files = transferFile.files;
                    photoUploadRef.current.dispatchEvent(mimicChangeEv); 
                }
            });
        }     
    }

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

    return (
        <div onClick={toggleErrorMsg} className = "flex flex-col justify-center text-2xl">
            {uploadError && <p className = "text-red-600 font-bold italic"> Ensure only zip files are dragged here</p>}
            <div id = "zipUpload" onDragOver={mouseHandler} onDrop = {(event) => {mouseHandler(event); decompressZip(event);}} 
                className = "text-white text-center mb-6 py-4 border-2 h-24 border-dashed font-bold">
                Drag a .zip file here with you're photos
            </div>
            <div className = "text-white border-2 border-yellow-400 text-center h-24 py-2 font-bold" 
                onClick = {uploadSinglePhoto}>
                or click here to select photos individually from your computer
                <input type = "file" accept ="images/*" ref = {photoUploadRef} onChange = {photoUploadHandler} className = "hidden"/> 
            </div>
        </div>
    )
}