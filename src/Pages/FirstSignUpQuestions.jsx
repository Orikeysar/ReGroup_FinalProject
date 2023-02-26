import React, { useState, useEffect } from "react";
import MultiSelectCheckBox from "../Coponents/MultiSelectCheckBox.jsx";
import { userDataTest } from "../asset/UserDataExample";
import { useNavigate } from "react-router-dom";


//מציג שאלון ראשוני למשתמש
function FirstSignUpQuestions() {
  // באישור שליחה של המשתמש ניצור אובייקט חדש של יוזר ונעדכן את הלוקל סטורג 
  const onSubmitForm = (event) => {
    event.preventDefault();
    const user = {
      id: userData.id,
      name: name,
      email: userData.email,
      degree: degree,
      courses: selectedCourses,
      firstLogIn: false,
      userImg: img,
      recentActivities:userData.recentActivities
    };
    
    console.log(user)
    localStorage.setItem("userData", JSON.stringify(user));
    navigate("/");

  };
  const navigate = useNavigate();

  const [userData, setUserData] = useState(() => {
    // Read the initial value of the user data from localStorage
    const storedUserData = localStorage.getItem("userData");
    // If there is a stored value, parse it and use it as the initial state
    return storedUserData ? JSON.parse(storedUserData) : {};
  });
  

  const [name, setName] = useState(userData.name);
  const [img, setImg] = useState(userData.userImg);
  const [degree, setDegree] = useState(userData.degree);
  const [selectedCourses, setSelectedCourses] = useState([]);

  const handleSelectedCourses = (selectedCourses) => {
    setSelectedCourses(selectedCourses);
  };
  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handleImgChange = (e) => {
    setImg(e.target.value);
  };
  const handleDegreeChange = (e) => {
    setDegree(e.target.value);
  };


  return (
    <div className="hero sizeForm">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl text-gray-600 font-bold">Welcome !</h1>
          <p className="py-6  text-gray-600">
            One more step and you're done. Please fill in the following details:
          </p>
          <form style={{ display: "grid" }} onSubmit={onSubmitForm}>
            <img
              onChange={handleImgChange}
              style={{
                borderRadius: 30 + "%",
                width: 120,
                height: 120,
                justifySelf: "center",
              }}
              src={userData.userImg}
            ></img>
            <div
              style={{ margin: 15, justifySelf: "center", width: 290 }}
              className="form-control"
            >
              <label className="input-group input-group-md">
                <span>Full Name</span>
                <input
                  type="text"
                  placeholder={userData.name}
                  className="input input-bordered input-md"
                  onChange={handleNameChange}
                />
              </label>
            </div>
            <div
              style={{ justifySelf: "center", margin: 15, width: 290 }}
              className=" form-control"
            >
              <label className="input-group input-group-md">
                <span style={{ width: 96.16 }}>Degree</span>
                <input
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered input-md"
                  onChange={handleDegreeChange}
                />
              </label>
            </div>
            {/*שולח מערך ריק של קורסים ומחזיר לנו מערך של אובייקטים של קורסים ומרנדר דרופדאון של בחירת קורסים*/}
            <div style={{ margin: 15, justifySelf: "center", width: 290 }}>
              <MultiSelectCheckBox
                selectedCourses={selectedCourses}
                handleSelectedCourses={handleSelectedCourses}
              ></MultiSelectCheckBox>
              
            </div>
            <button
            style={{ margin: 10, width:100,justifySelf: "center" }}
            className="btn btn-primary bg-gray-700"
          >
            submit
          </button>
          </form>
         
        </div>
      </div>
    </div>
  );
}

export default FirstSignUpQuestions;
