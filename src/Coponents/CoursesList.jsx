import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { GiBookmarklet } from "react-icons/gi";
import MultiSelectCheckBox from "../Coponents/MultiSelectCheckBox.jsx";
import { FaTrash } from "react-icons/fa";
import "primeicons/primeicons.css";
import { doc, setDoc } from "firebase/firestore"; 
import {db} from "../FirebaseSDK"
import { getAuth } from "firebase/auth";

function CoursesList() {
  const auth = getAuth();
  
  const navigate = useNavigate();
  const [activeUser, setActiveUser] = useState(() => {
    // Read the initial value of the user data from localStorage
    const storedactiveUser = localStorage.getItem("activeUser");
    // If there is a stored value, parse it and use it as the initial state
    return JSON.parse(storedactiveUser);
  });
  const [couresUserList, setCoursesUserList] = useState(activeUser.courses);
  const [selectedCourses, setSelectedCourses] = useState(activeUser.courses);
  
  const handleSelectedCourses =async (selectedCourses) => {
    setSelectedCourses(selectedCourses);
    setCoursesUserList(selectedCourses);
  
    let user = {
      name: activeUser.name,
      email: activeUser.email,
      degree: activeUser.degree,
      friendsList:activeUser.friendsList , 
      courses: selectedCourses,
      userImg: activeUser.userImg,
      recentActivities: activeUser.recentActivities,
      points: activeUser.points,
    userAchievements: activeUser.userAchievements,

    };
    localStorage.setItem("activeUser", JSON.stringify(user));
    await setDoc(doc(db, "users", auth.currentUser.uid), user);


  };
  const handleDelete = async(id) => {
    const updatedCourses = couresUserList.filter((course) => course.id !== id);
      let user = {
      name: activeUser.name,
      email: activeUser.email,
      degree: activeUser.degree,
      friendsList:activeUser.friendsList , 
      courses: selectedCourses,
      userImg: activeUser.userImg,
      recentActivities: activeUser.recentActivities,
      points: activeUser.points,
    userAchievements: activeUser.userAchievements,
    
    };

    localStorage.setItem("activeUser", JSON.stringify(user));
    setCoursesUserList(updatedCourses);
    setSelectedCourses(updatedCourses);
    const response= await setDoc(doc(db, "users", auth.currentUser.uid), user);
    console.log(response)

  };


  if (couresUserList.length === 0 || !couresUserList) {
    return (
      <div>
        <div className="flex  items-center space-x-2 justify-center text-base align-middle ">
          {" "}
          <GiBookmarklet size={30} className=" mr-2 w-max " />
          <p className=" font-bold text-xl">Courses List</p>
        </div>
        <div className=" flex my-5 justify-center">
          <MultiSelectCheckBox
            selectedCourses={selectedCourses}
            handleSelectedCourses={handleSelectedCourses}
            onChange={handleSelectedCourses}
          />
        </div>
        <div className=" justify-center m-10">
          <p className=" font-bold text-xl">
            You have not selected courses 
          </p>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className="flex  items-center space-x-2 justify-center text-base align-middle ">
          {" "}
          <GiBookmarklet size={30} className=" mr-2 w-max " />
          <p className=" font-bold text-xl">Courses List</p>
        </div>
        <div  className="Multi-w-80 flex my-5  justify-center">
          <MultiSelectCheckBox
            selectedCourses={selectedCourses}
            handleSelectedCourses={handleSelectedCourses}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="table w-4/5	ml-10">
            <tbody> 
              {couresUserList.map((item) => (
                <tr className="hover-row text-center" key={uuidv4()}>
                  <td className="text-left">{item.id}</td>
                  <td>
                    <span
                      onClick={() => handleDelete(item.id)}
                      className="pi pi-trash icon self-center"
                    ></span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default CoursesList;
