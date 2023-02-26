import React from "react";
import { useState, useEffect } from "react";
import { FaUserFriends, FaHandshake, BiLike } from "react-icons/fa";

import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../FirebaseSDK";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { RxCounterClockwiseClock } from "react-icons/rx";
import Spinner from "../Coponents/Spinner";
import { userDataTest } from "../asset/UserDataExample";
import RecentActivitiesCard from "../Coponents/RecentActivitiesCard";
import CoursesList from "../Coponents/CoursesList";
function Profile() {
  // const [activeUser, setActiveUser] = useState();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    return user;
  });
console.log(userData)
  // const [loading, setLoading] = useState(true);
  // const auth = getAuth();
  // const user = auth.currentUser;

  // useEffect(() => {
  //   const fetchUsersData = async () => {
  //     const UsersRef = doc(db, "users", user.uid);
  //     const docSnap = await getDoc(UsersRef);
  //     let userData = {};
  //     if (docSnap.exists()) {
  //       userData = { id: docSnap.id, data: docSnap.data() };
  //     } else {
  //       // doc.data() will be undefined in this case
  //       toast("No such document!");
  //     }
  //     //       console.log(user)
  //     // console.log(auth.currentUser.uid)

  //     setActiveUser(userData.data);
  //   };

  //   fetchUsersData();
  //   setLoading(false);
  // }, [user.data, activeUser, user.uid]);
  useEffect(() => {
    const handleFirstQuestions = () => {
      console.log(userData)
      if (userData.firstLogIn) {
        navigate("/FirstSignUpQuestions");
      }
    };
    handleFirstQuestions();
  });

  const onLogout = () => {
    // auth.signOut();
    navigate("/sign-in");
  };

  if (userData == null) {
    return <Spinner />;
  }

  return (
    <div className="container">
      <div className="row userInfo">
        <div className="col-md-4 animated fadeIn " key={userData.name}>
          <div className="card ">
            <div className="card-body flex-row">
              <div className="avatar w-2/5 ">
                <div className="w-28 rounded-full object-fill">
                  <img
                    src={userData.userImg}
                    className="object-center object-fill"
                    alt=""
                  />
                </div>
              </div>
              <div className="userInfo text-center w-3/5">
                <p className="card-title block underline  ">{userData.name}</p>
                <p className="card-text">
                  {userData.email}
                  <br />
                  <span className="degree">{userData.degree}</span>
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
          <CoursesList/>
        </div>
      </div>
    </div>
  );
}

export default Profile;
