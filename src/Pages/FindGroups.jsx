import React from "react";
import { useState } from "react";
import { RiGroup2Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import NavBar from "../Coponents/NavBar";
import BottumNavigation from "../Coponents/BottumNavBar";
import Map from "../Coponents/Map";
import FillterGroups from "../Coponents/FillterGroups";
import CoursesList from "../Coponents/CoursesList";
import CreateGroupButton from "../Coponents/CreateGroupButton";

//מציאת קבוצה
function FindGroups() {
  const navigate = useNavigate();

  const [activeUser, setActiveUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    return user;
  });
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
      <div className="topNavBar w-full mb-2">
        <NavBar />
      </div>
      <div className=" flex items-center space-x-2 justify-center text-base align-middle mb-5">
        {" "}
        <RiGroup2Fill size={30} className=" mr-2 w-max " />
        <p className=" font-bold text-xl">Find Groups</p>
      </div>
      <div className=" flex justify-center mb-2">
        <label className=" text-lg">here you can find groups or </label>&nbsp;
        <label
          onClick={() => navigate("/createGroups")}
          className=" font-bold text-lg hover:drop-shadow-xl underline"
        >
          Create new+
        </label>
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

      <div className="buttomNavBar w-full sticky bottom-0 pb-4">
        <BottumNavigation />
      </div>
    </div>

  );
}

export default FindGroups;
