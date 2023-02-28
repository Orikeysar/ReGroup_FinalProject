import React from "react";
import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import {
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../FirebaseSDK";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../Coponents/Spinner";
import RecentActivitiesCard from "../Coponents/RecentActivitiesCard";
import CoursesList from "../Coponents/CoursesList";
import NavBar from "../Coponents/NavBar";
import  BottomNavigation  from "../Coponents/BottumNavBar";
import FriendsListCard from "../Coponents/FriendsListCard"
import UserAchievemeant from '../Coponents/UserAchievemeant'
function Profile() {
  // const [activeUser, setActiveUser] = useState();
  const navigate = useNavigate();
const [componentChoosen, setComponentChoosen] = useState(localStorage.getItem("componentChoosen"));
  const [userData, setUserData] = useState(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    return user;
  });
console.log(userData)
  // const [loading, setLoading] = useState(true);
  // const auth = getAuth();
  // const user = auth.currentUser;




 const [activeUser, setActiveUser] = useState(userData)
  
  

  useEffect(() => {
    setComponentChoosen(localStorage.getItem("componentChoosen"))
   
    
    const handleFirstQuestions = () => {
      console.log(userData)
      if (userData.firstLogIn) {
        navigate("/FirstSignUpQuestions");
      }
    };
    handleFirstQuestions();
  }, [activeUser, userData, navigate]);

  

  const onLogout = () => {
    // auth.signOut();
    navigate("/sign-in");
   };



    if (userData == null) {
    return <Spinner />;
  }

  return (
    <div className="container">
      {/* //TOP NAVBAR */}
      <div className="topNavBar w-full mb-2">
           <NavBar />
         </div>
      <div className="row userInfo">
        <div className="col-md-4 animated fadeIn " key={activeUser.name}>
          <div className="card ">
            <div className="card-body flex-row">
              <div className="avatar w-2/5 ">
                <div className="w-28 rounded-full object-fill">
                  <img
                    src={activeUser.userImg}
                    className="object-center object-fill"
                    alt=""
                  />
                </div>
              </div>
              <div className="userInfo text-center w-3/5">
                <p className="card-title block underline  ">
                  {activeUser.name}
                </p>
                <p className="card-text">
                  {activeUser.email}
                  <br />
                  <span className="degree">{activeUser.Degree}</span>
                </p>
                <button
                  type="button"
                  className="logOut btn-xs border-gray-500 bg-gray-600 text-white rounded-md mt-2 "
                  onClick={onLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* //LAST ACTIVITIES  */}
      <div className=" mt-4 mb-4">
        <div>


        {componentChoosen === "RecentActivities" ? <RecentActivitiesCard/> :(
          componentChoosen === "CoursesList"  )? <CoursesList/> : (
          componentChoosen === "FriendsList" ) ? <FriendsListCard/> : <UserAchievemeant/>
        }
      


          
        </div>
      </div>
      <div className="buttomNavBar w-full  absolute bottom-0 pb-4">
          <BottomNavigation/>
        </div>
    </div>
  );
}

export default Profile;
