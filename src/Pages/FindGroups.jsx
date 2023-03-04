import React from "react";
import { useState, useEffect } from "react";
import { RiGroup2Fill } from "react-icons/ri";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../FirebaseSDK";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../Coponents/Spinner";
import RecentActivitiesCard from "../Coponents/RecentActivitiesCard";
import CoursesList from "../Coponents/CoursesList";
import NavBar from "../Coponents/NavBar";
import BottumNavigation from "../Coponents/BottumNavBar";
import FriendsListCard from "../Coponents/FriendsListCard";
import UserAchievemeant from "../Coponents/UserAchievemeant";
import { TreeSelect } from "primereact/treeselect";
function FindGroups() {
  const [activeUser, setActiveUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    return user;
  });
  const [courses, setCourses] = useState(
    JSON.parse(localStorage.getItem("courses"))
  );
  const [selectedCourses, setSelectedCourses] = useState(null);
  if (activeUser == null) {
    return <Spinner />;
  }
  return (
    <div className="container">
      {/* //TOP NAVBAR */}
      <div className="topNavBar w-full mb-2">
        <NavBar />
      </div>
      <div className=" flex items-center space-x-2 justify-center text-base align-middle mb-5">
        {" "}
        <RiGroup2Fill size={30} className=" mr-2 w-max " />
        <p className=" font-bold text-xl">Find Groups</p>
      </div>
      <div className="card grid justify-center ">
        <TreeSelect
          value={selectedCourses}
          onChange={(e) => setSelectedCourses(e.value)}
          options={courses}
          filter
          className="md:w-20rem"
          placeholder="Select Item"
        ></TreeSelect>
      </div>
      <div className="buttomNavBar w-full  absolute bottom-0 pb-4">
        <BottumNavigation />
      </div>
    </div>
  );
}

export default FindGroups;
