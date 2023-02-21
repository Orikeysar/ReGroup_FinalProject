import React from 'react'
import { FaFacebookF } from "react-icons/fa";

import {useNavigate } from 'react-router-dom'
import { getAuth,signInWithPopup,FacebookAuthProvider, } from 'firebase/auth'
import { doc,setDoc,getDoc,serverTimestamp } from 'firebase/firestore'
import { db } from '../FirebaseSDK'
import { toast } from 'react-toastify'
function FacebookSign() {
    const navigate = useNavigate()
  

 const onFaceBookClick=async()=>{
 try{
 const auth =getAuth()
 const provider = new FacebookAuthProvider()
 const result = await signInWithPopup(auth,provider)
 // The signed-in user info.
 const user = result.user
 
    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const accessToken = credential.accessToken;
 //Check for user
 const docRef = doc(db,'users','user.uid')
 const docSnap = await getDoc(docRef)
//Check if user exists,if not, create user
 if(!docSnap.exists()){

  await setDoc(doc(db,'users',user.uid),{

    name: user.displayName,
    email:user.email,
    timestamp:serverTimestamp()
 })
 }
 navigate('/')
 toast.success('Authorize with google good job')
 }catch(error){
 toast.error('Could not Authorize with google')
}

    }
  return (
<div className='socialLogin mb-3 mt-3 text-center w-full'>
  
  <button className='socialIconDiv btn-primary w-full min-h-12 max-h-12 bg-blue-500' onClick={onFaceBookClick}>
   <p className='text-center'>  Sign in with Facebook<FaFacebookF className=' relative left-1/2 w-6 h-6'/> </p> 
  </button>
 </div>
  )
}

export default FacebookSign