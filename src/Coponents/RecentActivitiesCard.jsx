import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { RxCounterClockwiseClock } from "react-icons/rx";
import { Avatar } from "@mui/material";

function RecentActivitiesCard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(() => {
    // Read the initial value of the user data from localStorage
    const storedUserData = localStorage.getItem("userData");
    // If there is a stored value, parse it and use it as the initial state
    return JSON.parse(storedUserData);
  });
  const [activitiesTypeGroups, setActivitiesTypeGroups] = useState([]);
  const [activitiesTypeGeneral, setActivitiesTypeGeneral] = useState([]);
  const [btnColorGeneral, setBtnColorGeneral]=useState("btn m-2 text-sm glass text-black");
  const [btnColorGroups, setBtnColorGroups]=useState("btn m-2 ");
  const [type, setType] = useState("General");
//בודק אם יש משתמש ואם יש לו פעילויות אחרונות. ויוצר מערכים לקבוצות וכללי
  useEffect(() => {
    if (userData && userData.recentActivities) {
      const { groups, general } = userData.recentActivities.reduce(
        (acc, item) => {
          if (item.type === "groups") {
            acc.groups.push(item);
          } else {
            acc.general.push(item);
          }
          return acc;
        },
        { groups: [], general: [] }
      );
      setActivitiesTypeGroups(groups);
      setActivitiesTypeGeneral(general);
    }
  }, [userData.recentActivities]);
  const handleGeneralClick = () => {
    setType("General");
  };
  const handleGroupsClick = () => {
    setType("Groups");
  };
//משנה את הצבע בחירה 
  const handleClickGeneral=()=>{
    setBtnColorGeneral("btn m-2 text-sm glass text-black");
    setBtnColorGroups("btn m-2");
    setType("General");

  }
  const handleClickGroups=()=>{
    setBtnColorGeneral("btn m-2 ");
    setBtnColorGroups("btn m-2 text-sm glass text-black");
    setType("Groups");
  }
  if(userData.recentActivities.length==0){
    return (
        <div>
            <div className="flex  items-center space-x-2 justify-center text-base align-middle ">
            {" "}
            <RxCounterClockwiseClock className=" mr-2 w-max " />
            <p className=" font-bold text-xl">Recent Activities</p>
          </div>
          <div className="flex justify-center m-2">
            <button onClick={handleClickGeneral} className={btnColorGeneral}>General</button><button onClick={handleClickGroups} className={btnColorGroups}>Gruops</button>
          </div>
          <div className=" justify-center m-10">
          <p className=" font-bold text-xl"> There are no recent activities yet</p>
          </div>
        </div>
    )
  }

  if (type == "General") {
    return (
        
    <div>
        
        <div className="flex  items-center space-x-2 justify-center text-base align-middle ">
            {" "}
            <RxCounterClockwiseClock className=" mr-2 w-max " />
            <p className=" font-bold text-xl">Recent Activities</p>
          </div>
          <div className="flex justify-center m-2">
            <button onClick={handleClickGeneral} className={btnColorGeneral}>General</button><button onClick={handleClickGroups} className={btnColorGroups}>Gruops</button>
          </div>
        <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th></th>
              <th>Description</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {activitiesTypeGeneral.map((item) => (
              <tr key={uuidv4()}>
                <td><Avatar image={item.icon} size="sm" shape="circle"/></td>
                <td>{item.text}</td>
                <td>{item.timeStamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
      
    );
  } else {
    return (
        <div>
            <div className="flex  items-center space-x-2 justify-center text-base align-middle ">
            {" "}
            <RxCounterClockwiseClock className=" mr-2 w-max " />
            <p className=" font-bold text-xl">Recent Activities</p>
          </div>
          <div className="flex justify-center m-2">
            <button onClick={handleClickGeneral} className={btnColorGeneral}>General</button><button onClick={handleClickGroups} className={btnColorGroups}>Gruops</button>
          </div>
            <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>curse</th>
              <th>subjects</th>
              <th>Description</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {activitiesTypeGroups.map((item) => (
              <tr key={uuidv4()}>
                <td>{item.curse}</td>
                <td>
                  {item.subjects
                    .map((sub, index) => {
                      // Check if this is the last item in the array
                      const isLast = index === item.subjects.length - 1;
                      // Append a "|" character if this is not the last item
                      const separator = isLast ? "" : " | ";
                      // Return the subject name with the separator character
                      return sub.name + separator;
                    })
                    .join("")
                    }
                </td>
                <td>{item.text}</td>
                <td>{item.timeStamp}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        </div>
      
    );
  }
}

export default RecentActivitiesCard;
