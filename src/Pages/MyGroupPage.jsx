import React from "react";
import Map from "../Coponents/Map";
import BottumNavigation from "../Coponents/BottumNavBar";
import { useState, useEffect } from "react";
import { db } from "../FirebaseSDK";
import NavBar from "../Coponents/NavBar";
import { Avatar } from "primereact/avatar";
import { uuidv4 } from "@firebase/util";
import {
  setDoc,
  doc,
  GeoPoint,
  Timestamp,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BsFilePerson } from "react-icons/bs";
import { FaAudioDescription } from "react-icons/fa";
import Chip from "@mui/material/Chip";
import randomColor from "randomcolor";
import FillterGroups from "../Coponents/FillterGroups";
import useFindMyGroups from "../Hooks/useFindMyGroups";
import UpdateRecentActivities from "../Coponents/UpdateRecentActivities";

function MyGroupPage() {
  const navigate = useNavigate();
  //איתחול המשתנים שתופסים את הקבוצות ששיכות למשתמש
  let { managerGroup, participantGroup } = useFindMyGroups();
  //מושך מהלוקל את פרטי המשתמש המחובר
  const [activeUser, setActiveUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    return user;
  });

  const [managerGroupId, setManagerGroupId] = useState(null);
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

  const handleFillterGroups = (filteredGroups) => {
    setFilteredGroups(filteredGroups);
  };
  //הצגת הקבוצה בה המשתמש מנהל כרגע
  const ShowMangerGroup = () => {
    let { managerGroup, participantGroup } = useFindMyGroups();
    if (managerGroup == null) {
      return "Yoy Dont have any group you manager in!";
    }
    return (
      <div className="col-md-4 animated fadeIn ">
        <div
          className="card w-auto h-46 m-2 p-2 border border-stone-400"
          key={managerGroup.managerRef}
        >
          <p className=" flex mt-1 justify-end ">
            start at {handleGroupTime(managerGroup.timeStamp)}
          </p>
          <div className=" flex flex-row">
            <div className=" ml-2">
              <Avatar
                image={managerGroup.groupImg}
                size="xlarge"
                shape="circle"
              />
            </div>
            <div>
              <p className="ml-3 mt-2 justify-center font-bold text-xl">
                {managerGroup.groupTittle}
              </p>
              <p className="ml-3 mt-2 justify-center text-lg ">
                {managerGroup.groupTags.map((sub, index) => {
                  // Check if it's the last element in the array
                  let color = randomColor({
                    luminosity: "light",
                    hue: "random",
                  });
                  if (index === managerGroup.groupTags.length - 1) {
                    return (
                      <Chip
                        style={{
                          backgroundColor: color,
                        }}
                        key={uuidv4()}
                        className="mr-2 mt-2 font-bold"
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
                        className="mr-2 mt-2 font-bold"
                        variant="outlined"
                        label={sub}
                      />
                    );
                  }
                })}
              </p>
              <p className="flex flex-row ml-3 mt-2">
                <BsFilePerson className="mr-1" />
                {managerGroup.participants.length} / {managerGroup.groupSize}
                {/* //see FREINDS */}
              </p>
              <p className="flex flex-row ml-3">
                {managerGroup.participants.map((paticipant) => {
                  return (
                    <Chip
                      key={uuidv4()}
                      avatar={
                        <Avatar
                          size="small"
                          shape="circle"
                          image={paticipant.userImg}
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
                {managerGroup.description}
              </p>

              <div className="text-center grid grid-cols-1">
                <button
                  key={uuidv4()}
                  className="editButton btn btn-xs text-sm mt-2"
                  onClick={() => {
                    handleEditManagerGroup(managerGroup);
                  }}
                >
                  Edit Group
                </button>
                <button
                  key={uuidv4()}
                  className="editButton btn btn-xs text-sm mt-2 "
                  onClick={() => {
                    handleDeleteManagerGroup();
                  }}
                >
                  Delete Group
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  //הצגת הקבוצה בה המשתמש חבר כרגע
  const ShowPaticipantGroup = () => {
    let { managerGroup, participantGroup } = useFindMyGroups();
    if (participantGroup == null) {
      return "Yoy Dont have any group you paticipant in!";
    }
    return (
      <div className="col-md-4 animated fadeIn ">
        <div
          className="card w-auto h-46 m-2 p-2 border border-stone-400"
          key={participantGroup.managerRef}
        >
          <p className=" flex mt-1 justify-end ">
            start at {handleGroupTime(participantGroup.timeStamp)}
          </p>
          <div className=" flex flex-row">
            <div className=" ml-2">
              <Avatar
                image={participantGroup.groupImg}
                size="xlarge"
                shape="circle"
              />
            </div>
            <div>
              <p className="ml-3 mt-2 justify-center font-bold text-xl">
                {participantGroup.groupTittle}
              </p>
              <p className="ml-3 mt-2 justify-center text-lg ">
                {participantGroup.groupTags.map((sub, index) => {
                  // Check if it's the last element in the array
                  let color = randomColor({
                    luminosity: "light",
                    hue: "random",
                  });
                  if (index === participantGroup.groupTags.length - 1) {
                    return (
                      <Chip
                        style={{
                          backgroundColor: color,
                        }}
                        key={uuidv4()}
                        className="mr-2 mt-2 font-bold"
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
                        className="mr-2 mt-2 font-bold"
                        variant="outlined"
                        label={sub}
                      />
                    );
                  }
                })}
              </p>
              <p className="flex flex-row ml-3 mt-2">
                <BsFilePerson className="mr-1" />
                {participantGroup.participants.length} /{" "}
                {participantGroup.groupSize}
                {/* //see FREINDS */}
              </p>
              <p className="flex flex-row ml-3">
                {participantGroup.participants.map((paticipant) => {
                  return (
                    <Chip
                      key={uuidv4()}
                      avatar={
                        <Avatar
                          size="small"
                          shape="circle"
                          image={paticipant.userImg}
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
                {managerGroup.description}
              </p>

              <div className="text-center grid grid-cols-1">
                <button
                  key={uuidv4()}
                  className="editButton btn btn-xs text-sm mt-2 "
                  onClick={() => {
                    handleDeleteManagerGroup(participantGroup);
                  }}
                >
                  Leave Group
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  //תפס את הלחיצה על מחיקת קבוצה בה הוא מנהל
  const handleDeleteManagerGroup = async () => {
    let groupId = null;
    if (window.confirm("you sure you want to delete this group?") === true) {
      //אם אישר למחוק את הקבוצה

      const q = query(
        collection(db, "activeGroups"),
        where("managerRef", "==", activeUser.userRef)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        groupId = doc.id;
        console.log(doc.id, " => ", doc.data());
      });
      const groupData=querySnapshot.data();
      // Remove the 'group' field from the document
      await deleteDoc(doc(db, "activeGroups", doc.id));
      toast.success("delete success");
      UpdateRecentActivities(groupData,"CreatedGroup",activeUser)
    } else {
      toast.success("group wont delete");
    }
  };

  //תופס את לחיצת הכפתור עריכה על כרטיס הקבוצה
  const handleEditManagerGroup = (group) => {
    navigate("/createGroups");
  };

  return (
    <div className="container">
      {/* //TOP NAVBAR */}
      <div className="topNavBar w-full mb-2">
        <NavBar />
      </div>
      <div className="row userInfo">
        <div className="hidden">
          <FillterGroups handleFillterGroups={handleFillterGroups} />
        </div>

        {/* //הצגת הקבוצות שנמצאו */}
        <div className="col-md-4 animated fadeIn ">
          <p className="font-bold text-center text-lg">
            {" "}
            Group You Manager In:
          </p>
          {ShowMangerGroup()}
          <p className="font-bold text-center text-lg">
            {" "}
            Group you participant in:
          </p>
          {ShowPaticipantGroup()}
        </div>
      </div>
      <div className=" p-1 drop-shadow-xl">
        {/* יצירת מפה ושליחת הקבוצות */}
        <Map filteredGroups={filteredGroups} isMarkerShown />
      </div>
      <div className="buttomNavBar w-full  sticky bottom-0 pb-4 ">
        <BottumNavigation />
      </div>
    </div>
  );
}

export default MyGroupPage;
