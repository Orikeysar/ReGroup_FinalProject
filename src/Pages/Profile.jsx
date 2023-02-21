import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAuth, updateProfile } from 'firebase/auth'
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  deleteDoc,
} from 'firebase/firestore'
import { db } from '../FirebaseSDK'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { RxCounterClockwiseClock } from "react-icons/rx";
import { Divider } from '@mui/material'
function Profile() {
  

  const auth = getAuth() 
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(true)
  const [activeUser, setActiveUser] = useState({})
  const [changeDetails, setChangeDetails] = useState(false)
//insrt user to formData 
  const [formData, setFormData] = useState({
    name: auth.currentUser?.displayName,
    email: auth.currentUser?.email,
  })
  const { name, email } = formData

 

  useEffect(() => {

    const fetchUsersData = async () => {
      const UsersRef = doc(db, 'users', auth.currentUser.uid)
   

      const docSnap  = await getDoc(UsersRef)
      let user = {}
     
      if (docSnap.exists()) {
        
         user = 
          { id: docSnap.id,
            data: docSnap.data(),
          }
           
          
        
        }
       else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
//       console.log(user)
// console.log(auth.currentUser.uid)

setActiveUser(user.data)
console.log(user.data)
      setLoading(false)
    }

    fetchUsersData()
    console.log(activeUser)
  }, [auth.currentUser.uid])

  const onLogout = () => {
    auth.signOut()
    navigate('/')
  }
  return (
    <div className='container'>

    <div className="row userInfo">
   
      <div className="col-md-4 animated fadeIn " key={activeUser.name}>
        <div className="card ">
          <div className="card-body flex-row">
            <div className="avatar w-2/5 ">
              <div className='w-28 rounded-full object-fill'>
              <img
                src={activeUser.userImg}
                className="object-center object-fill"
                alt=""
              />
              </div>
            </div>
            <div className='userInfo text-center w-3/5'>
            <p className="card-title block underline  ">
              {activeUser.name}
            </p>
            <p className="card-text">
              {activeUser.email}
              <br />
              <span className="degree">{activeUser.Degree}</span>
            </p>
            <button type='button' className='logOut btn-xs border-gray-500 bg-gray-600 text-white rounded-md mt-2 ' onClick={onLogout}>
          Logout
        </button>
            </div>
          </div>
        </div>
      </div>
    
  </div>
  {/* //LAST ACTIVITIES  */}
   <div className='lastActivities  mt-4 mb-4'>

    <div className='activitiesHeader items-center grid grid-cols-3  '>
      <div></div>
      <div className='flex items-center align-middle '> <RxCounterClockwiseClock className=' mr-2 w-max '/>
    <p className=' font-bold text-lg' >Recent Activities</p>  </div>
      <div></div>
   
    </div>



   </div>
  </div>
  )
}

export default Profile