import React from "react";
import { useState, useEffect } from "react";
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
import { getAuth } from "firebase/auth";
import {
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../FirebaseSDK";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
<<<<<<< Updated upstream
import { RxCounterClockwiseClock } from "react-icons/rx";
import Spinner from "../Coponents/Spinner"
function Profile() {

 const navigate = useNavigate();
;
 const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const user = auth.currentUser;
=======
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
>>>>>>> Stashed changes




 const [activeUser, setActiveUser] = useState(null)
  
  

  useEffect(() => {
<<<<<<< Updated upstream
   
    const fetchUsersData = async () => {
      
        const UsersRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(UsersRef);
        let userData = {};
        if (docSnap.exists()) {
          userData = { id: docSnap.id, data: docSnap.data() };
        } else {
          // doc.data() will be undefined in this case
          toast("No such document!");
        }
        //       console.log(user)
        // console.log(auth.currentUser.uid)

        setActiveUser(userData.data);
      
    
=======
    setComponentChoosen(localStorage.getItem("componentChoosen"))

    const handleFirstQuestions = () => {
      console.log(userData)
      if (userData.firstLogIn) {
        navigate("/FirstSignUpQuestions");
      }
>>>>>>> Stashed changes
    };


    fetchUsersData();
        setLoading(false);
  }, [user.data, activeUser, user.uid]);
  const handleFirstQuestions=()=>{
    if(activeUser.firstLogIn){

      navigate("/FirstSignUpQuestions");
      
    }
  }
  handleFirstQuestions();

  const onLogout = () => {
    auth.signOut();
    navigate("/sign-in");
  };

<<<<<<< Updated upstream
  if(activeUser == null){
=======


  if (userData == null) {
    return <Spinner />;
  }
>>>>>>> Stashed changes

    return <Spinner/>
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
<<<<<<< Updated upstream
      <div className="lastActivities  mt-4 mb-4">
        <div className="activitiesHeade   ">
          <div></div>
          <div className="flex  items-center space-x-2 justify-center text-base align-middle ">
            {" "}
            <RxCounterClockwiseClock className=" mr-2 w-max " />
            <p className=" font-bold text-lg">Recent Activities</p>{" "}
          </div>
          <div></div>
=======
      <div className=" mt-4 mb-4">
        <div>


        {componentChoosen === "RecentActivities" ? <RecentActivitiesCard/> :(
          componentChoosen === "CoursesList"  )? <CoursesList/> : (
          componentChoosen === "FriendsList" ) ? <FriendsListCard/> : <UserAchievemeant/>
        }
      


          
>>>>>>> Stashed changes
        </div>
      </div>
      <div className="buttomNavBar w-full  absolute bottom-0 pb-4">
          <BottomNavigation/>
        </div>
    </div>
  );
}

export default Profile;
