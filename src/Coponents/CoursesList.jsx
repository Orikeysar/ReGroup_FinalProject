import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { GiBookmarklet } from "react-icons/gi";
import MultiSelectCheckBox from "../Coponents/MultiSelectCheckBox.jsx";
import { FaTrash } from "react-icons/fa";
import "primeicons/primeicons.css";

function CoursesList() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(() => {
    // Read the initial value of the user data from localStorage
    const storedUserData = localStorage.getItem("userData");
    // If there is a stored value, parse it and use it as the initial state
    return JSON.parse(storedUserData);
  });
  const [couresUserList, setCoursesUserList] = useState(userData.courses);
  const [selectedCourses, setSelectedCourses] = useState(userData.courses);
  
  const handleSelectedCourses = (selectedCourses) => {
    setSelectedCourses(selectedCourses);
    setCoursesUserList(selectedCourses);
  };
  const handleDelete = (id) => {
    const updatedCourses = couresUserList.filter((course) => course.id !== id);
    const user = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      degree: userData.degree,
      courses: updatedCourses,
      firstLogIn: false,
      userImg: userData.userImg,
      recentActivities: userData.recentActivities,
    };

    localStorage.setItem("userData", JSON.stringify(user));
    setCoursesUserList(updatedCourses);
    setSelectedCourses(updatedCourses);
  };


  if (couresUserList.length==0 || !couresUserList) {
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
                <tr className="hover-row" key={uuidv4()}>
                  <td>{item.id}</td>
                  <td>
                    <span
                      onClick={() => handleDelete(item.id)}
                      className="pi pi-trash icon"
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
