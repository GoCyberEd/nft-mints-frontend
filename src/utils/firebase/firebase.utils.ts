import { Dispatch, SetStateAction } from 'react';
import { initializeApp } from 'firebase/app';
import { FileValidated } from "@dropzone-ui/react";
//import { getFirestore, collection, addDoc, getDoc, getDocs, doc, setDoc, query, where, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const config = {
  apiKey: "AIzaSyBWy1CmEMkX0RuoPq1GAI67gbA6youPEms",
  authDomain: "nft-mints-20f17.firebaseapp.com",
  projectId: "nft-mints-20f17",
  storageBucket: "nft-mints-20f17.appspot.com",
  databaseURL: 'gs://nft-mints-20f17.appspot.com',
  messagingSenderId: "913579668003",
  appId: "1:913579668003:web:f9caae72c8a03249253796"
};

initializeApp(config);

export const storage = getStorage();


/**
 * Stores a media file in firebase's storage
 * @param files {Array<FileValidated} A array of files to be uploaded
 * @param setProgress {Dispatch<SetStateAction<number>>} Hook that updates progress bar 
 * @param setFilesUrl {Dispatch<SetStateAction<string[]>>} Hook that updates that saves 
 *                    each file Firabase Storage's url.
 */
export const addFilesToStorage = async (files: Array<FileValidated>, 
  setProgress: Dispatch<SetStateAction<number>>,setFilesUrl : Dispatch<SetStateAction<string[]>>) : Promise<Array<string>> => { //setFilesUrl : Dispatch<SetStateAction<string[]>>
  let promises: Array<any> = []; //Promise<any[]> = [];
  const STORAGE_FOLDER = process.env.REACT_APP_FIREBASE_STORAGE_FOLDER
  const fileUrl : Array<string> = [];
  files.forEach((file) => {
    console.log("file to upload: ", file.file.name)
    const storageRef = ref(storage,`/${STORAGE_FOLDER}/${Date.now()}${file.file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file.file);
    promises.push(uploadTask);
    uploadTask.on(
      "state_changed", 
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(progress);
      }, (error) => {
        console.log(error); //throw error(error);
    }, async () => {
      await getDownloadURL(uploadTask.snapshot.ref).then((urls) => {
        console.log(urls);
        fileUrl.push(urls);
      })
    })
  });

  Promise.all(promises!).then((x) => {

    setTimeout(function() {
      
      console.log('after all promises',fileUrl[0]);
      setFilesUrl(fileUrl);
      console.log(x);
      //your code to be executed after 1 second
    }, 2000);



   
  }); 
  // .then(() => {
  //   setFilesUrl(fileUrl);
  // });
  //console.log('result',{result});
  return fileUrl;
};
  