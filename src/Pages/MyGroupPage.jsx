import React from "react";
import Map from "../Coponents/Map";
import BottumNavigation from "../Coponents/BottumNavBar";
import { useState, useEffect } from "react";
import { db } from "../FirebaseSDK";
import NavBar from "../Coponents/NavBar";
import { Avatar } from "primereact/avatar";
import { uuidv4 } from "@firebase/util";
import { collection, onSnapshot, query } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { BsFilePerson } from "react-icons/bs";
import { FaAudioDescription } from "react-icons/fa";

import Chip from "@mui/material/Chip";
import randomColor from "randomcolor";
import FillterGroups from "../Coponents/FillterGroups";

function MyGroupPage() {
  const navigate = useNavigate();
  //

  //מושך מהלוקל את פרטי המשתמש המחובר
  const [activeUser, setActiveUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    return user;
  });
  //אתחול משתמנים לגישה לדאטה
  const [activeGroups, setActiveGroups] = useState([]);
  const colRef = collection(db, "activeGroups");
  const q = query(colRef);

  //מאזין שמושך את הקבוצות הקיימות מהדאטה
  onSnapshot(q, (snapshot) => {
    let newActiveGroups = [];
    snapshot.docs.forEach((doc, index) => {
      newActiveGroups.push({ ...doc.data(), id: doc.id, index });
    });

    if (JSON.stringify(newActiveGroups) !== JSON.stringify(activeGroups)) {
      setActiveGroups(newActiveGroups);
      
    }
  });

  //פונקציה שמסדרת את זמן הקבוצה
  const handleGroupTime = (timeStamp) => {
    if (timeStamp != null || timeStamp != undefined) {
      let time = timeStamp.toDate();
      let hours = time.getHours();
      let minutes = time.getMinutes();
      time = hours + ":" + minutes;
      return time;
    }
  };
  //get all the filters from FiltterGroup component
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedNumber, setSelectedNumber] = useState([]);
  const handleFillterGroups = (
    filteredGroups,
    selectedCourse,
    selectedSubjects,
    selectedNumber
  ) => {
    setFilteredGroups(filteredGroups);
    setSelectedCourse(selectedCourse);
    setSelectedSubjects(selectedSubjects);
    setSelectedNumber(selectedNumber);
  };
  const [groupCardList, setGroupCardList] = useState([]);

  const moveCardToTop = (cardId) => {
    const cardIndex = groupCardList.findIndex((card) => card.id === cardId);
    if (cardIndex !== -1) {
      const card = groupCardList[cardIndex];
      const updatedCardList = [
        card,
        ...groupCardList.slice(0, cardIndex),
        ...groupCardList.slice(cardIndex + 1),
      ];
      setGroupCardList(updatedCardList);
    }
  };

  
   
 

  //תופס את לחיצת הכפתור עריכה על כרטיס הקבוצה
  const handleEditManagerGroup = (group) => {};

  return (
    <div className="container">
      {/* //TOP NAVBAR */}
      <div className="topNavBar w-full mb-2">
        <NavBar />
      </div>
      <div className="row userInfo">
        <div className="">
          <FillterGroups handleFillterGroups={handleFillterGroups} />
        </div>
        <div className="col-md-4 animated fadeIn ">
          {activeGroups == null || activeGroups.length === 0
            ? "you nor in group"
            : activeGroups.map((group) => {
              
                if (group.participants.length > 0) {
                  return group.participants.map((participant) => {
                    if (participant.userRef === activeUser.userRef) {
                      return (
                        <div
                          className="card w-auto h-46 m-2 p-2 border border-stone-400"
                          key={group.managerRef}
                        >
                          <p className=" flex mt-1 justify-end ">
                            start at {handleGroupTime(group.timeStamp)}
                          </p>
                          <div className=" flex flex-row">
                            <div className=" ml-2">
                              <Avatar
                                image={group.groupImg}
                                size="xlarge"
                                shape="circle"
                              />
                            </div>
                            <div>
                              <p className="ml-3 mt-2 justify-center font-bold text-xl">
                                {group.groupTittle}
                              </p>
                              <p className="ml-3 mt-2 justify-center text-lg ">
                                {group.groupTags.map((sub, index) => {
                                  // Check if it's the last element in the array
                                  let color = randomColor({
                                    luminosity: "light",
                                    hue: "random",
                                  });
                                  if (index === group.groupTags.length - 1) {
                                    return (
                                      <Chip
                                        style={{
                                          backgroundColor: color,
                                        }}
                                        key={uuidv4()}
                                        className="mr-2 mt-2"
                                        variant="outlined"
                                        label={sub}
                                      />
                                    );
                                  } else {
                                    return (
                                      <Chip
                                        style={{
                                          backgroundColor: color,
                                        }}
                                        key={uuidv4()}
                                        className="mr-2 mt-2"
                                        variant="outlined"
                                        label={sub}
                                      />
                                    );
                                  }
                                })}
                              </p>
                              <p className="flex flex-row ml-3 mt-2">
                                <BsFilePerson className="mr-1" />
                                {group.participants.length} / {group.groupSize}
                                {/* //see FREINDS */}
                              </p>
                              <p className="flex flex-row ml-3">
                                {group.participants.map((paticipant) => {
                                  return (
                                    <Chip
                                      key={uuidv4()}
                                      avatar={
                                        <Avatar
                                          alt="paticipant.name"
                                          src={paticipant.userImg}
                                        />
                                      }
                                      color="success"
                                      className="mr-2 mt-2"
                                      variant="outlined"
                                      label={paticipant.name}
                                    />
                                  );
                                })}
                              </p>
                              <p className="flex flex-row ml-3 mt-2">
                                <FaAudioDescription className="mr-1 min-w-max" />
                                {group.description}
                              </p>

                              {group.managerRef === activeUser.userRef && (
                                <button
                                  key={uuidv4()}
                                  className="editButton btn btn-xs text-sm mt-2"
                                  onClick={() => {
                                    handleEditManagerGroup(group);
                                  }}
                                >
                                  Edit Group Details
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }
                  });
                }
              })}
        </div>
      </div>
      <div className=" p-1 drop-shadow-xl">
        {/* יצירת מפה ושליחת הקבוצות */}
        <Map filteredGroups={activeGroups} isMarkerShown />
      </div>
      <div className="buttomNavBar w-full  sticky bottom-0 pb-4 ">
        <BottumNavigation />
      </div>
    </div>
  );
}

export default MyGroupPage;
