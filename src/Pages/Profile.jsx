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
import { RxCounterClockwiseClock } from "react-icons/rx";
import Spinner from "../Coponents/Spinner"
function Profile() {

 const navigate = useNavigate();
;
 const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const user = auth.currentUser;




 const [activeUser, setActiveUser] = useState(null)
  
  

  useEffect(() => {
   
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

  if(activeUser == null){

    return <Spinner/>
  }
  return (
    <div className="container">
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
      <div className="lastActivities  mt-4 mb-4">
        <div className="activitiesHeade   ">
          <div></div>
          <div className="flex  items-center space-x-2 justify-center text-base align-middle ">
            {" "}
            <RxCounterClockwiseClock className=" mr-2 w-max " />
            <p className=" font-bold text-lg">Recent Activities</p>{" "}
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
