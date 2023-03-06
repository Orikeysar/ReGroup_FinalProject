
import React from "react";
import { useState, useEffect } from "react";
import { RiGroup2Fill } from "react-icons/ri";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../FirebaseSDK";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../Coponents/Spinner";

import NavBar from "../Coponents/NavBar";
import BottumNavigation from "../Coponents/BottumNavBar";

import MyAddGroupMapComponent from "../Coponents/MyAddGroupMapComponent ";

function AddGroup() {
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
            <p className=" font-bold text-xl">Create Groups</p>
          </div>
          <div className=" flex justify-center mb-2">
            <label className=" text-lg">here you can go back to find groups</label>&nbsp;
            <label onClick={()=>console.log("Find group")} className=" font-bold text-lg hover:drop-shadow-xl underline">Find Group</label>
          </div>
          <div className=" p-1 drop-shadow-xl">
             <MyAddGroupMapComponent isMarkerShown/>
          </div>
         
          <div className="buttomNavBar w-full  absolute bottom-0 pb-4">
            <BottumNavigation />
          </div>
        </div>
      );
}

export default AddGroup