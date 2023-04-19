import React from "react";
import { useState, useEffect } from "react";
import { RiGroup2Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import NavBar from "../Coponents/navbars/NavBar";
import { Modal, Box } from "@mui/material";
import Map from "../Coponents/GroupsComponents/Map";
import FillterGroups from "../Coponents/GroupsComponents/FillterGroups";
import CoursesList from "../Coponents/GroupsComponents/CoursesList";
import CreateGroupButton from "../Coponents/GroupsComponents/CreateGroupButton";
//מציאת קבוצה
function FindGroups() {
  const navigate = useNavigate();

  const [activeUser, setActiveUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    return user;
  });
  //מודל מידע ראשוני
  const [displayPopUp, setDisplayPopUp] = useState(true);
  // when pop-up is closed this function triggers
  const closePopUp = () => {
    // setting key "seenPopUp" with value true into localStorage
    localStorage.setItem("seenPopUpFindGroup", true);
    // setting state to false to not display pop-up
    setDisplayPopUp(false);
  };

  // check if  user seen and closed the pop-up
  useEffect(() => {
    // getting value of "seenPopUp" key from localStorage
    let returningUser = localStorage.getItem("seenPopUpFindGroup");
    // setting the opposite to state, false for returning user, true for a new user
    setDisplayPopUp(!returningUser);
  }, []);
  //אחראי על הסטייל של המודל הראשוני
  const PopUpInfoStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 300,
    height: 400,
    boxShadow: 24,
    padding: 2,
    textAlign: "center",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 0 20px rgba(0,0,0,0.3)",
  };

  //מציג את הדיב של קבלת התראות על קבוצות
  const [groupsAlert, setGroupsAlert] = useState(false);
  //יצירת מערך ופונקציה שנשלח לקומפוננט פילטרגרופ כדי לקבל את הקבוצות שנשלח למפה
  const [fillteredGroups, setFillteredGroups] = useState([]);
  const handleFillterGroups = (fillteredGroups) => {
    setFillteredGroups(fillteredGroups);
  };
  return (
    <div className="container">
      {/* //TOP NAVBAR */}
      <div className="topNavBar w-full mb-24">
        <NavBar />
      </div>
      {/* הצגת המודל הראשוני עם המידע  */}
      <div className=" float-none">
          {displayPopUp && (
            <Modal
              open={true}
              // once pop-up will close "closePopUp" function will be executed
              onClose={closePopUp}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={PopUpInfoStyle}>
                {/* what user will see in the modal is defined below */}
                <img src="https://firebasestorage.googleapis.com/v0/b/regroup-a4654.appspot.com/o/images%2Fjoin.png?alt=media&token=4395691e-43bf-4f76-9dab-a5aae3841bec" className=" flex rounded-2xl h-20 w-20 mb-2 mx-auto"/>
                <h1>Join to a new group</h1>
                <p className="mt-2">
                Here you can find a groups to join in, you can join one group at a time .
                </p>
                <p className="mt-2">
                With the help of advanced filters, you can quickly find a group suitable for your educational needs.
                </p>
                <button className="mt-2" onClick={closePopUp}>
                  OK
                </button>
              </Box>
            </Modal>
          )}
        </div>
        <div className="rounded-xl flex items-center space-x-2 justify-center text-base align-middle  ">
          <img
            className=" w-10 h-10 rounded-full "
            src="https://firebasestorage.googleapis.com/v0/b/regroup-a4654.appspot.com/o/images%2Fjoin.png?alt=media&token=4395691e-43bf-4f76-9dab-a5aae3841bec"
            alt="Users Recored"
          />{" "}
          <p className=" font-bold text-xl">Find Groups</p>
        </div>
      <div>
        {/* סינון קבוצות */}
        <FillterGroups handleFillterGroups={handleFillterGroups} />
      </div>
      <button className="btn btn-md mb-2 ml-1" onClick={()=>setGroupsAlert(!groupsAlert)}>
        set alert
      </button>
      {groupsAlert ? (
        <div className="text-center m-2 border rounded-xl bg-gray-100">
          <p className="text-red-400 text-sm mt-2 mb-2">
            *in this section you can choose courses that you want to get elart
            for!
            <br /> groups who opened with this choosen course as title .
          </p>
          <CoursesList />
        </div>
      ) : null}
<CreateGroupButton/>
      <div className=" p-1 drop-shadow-xl">
        {/* יצירת מפה ושליחת הקבוצות */}
        <Map filteredGroups={fillteredGroups} isMarkerShown />
      </div>


    </div>
  );
}

export default FindGroups;
