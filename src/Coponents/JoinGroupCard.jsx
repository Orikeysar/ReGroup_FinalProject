import React, { useEffect } from "react";
import { useState, useRef } from "react";
import { Avatar } from "primereact/avatar";
import { uuidv4 } from "@firebase/util";
import { db } from "../FirebaseSDK";
import {
  doc,
  setDoc,
  updateDoc,
  GeoPoint,
  Timestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { toast } from "react-toastify";
import UserProfileModal from "./UserProfileModal";
import { Dialog } from "primereact/dialog";
import useFindMyGroups from "../Hooks/useFindMyGroups";
import UpdateRecentActivities from "./UpdateRecentActivities";
import Chip from "@mui/material/Chip";
import randomColor from "randomcolor";
import { useNavigate } from "react-router-dom";
import { TrendingUpRounded } from "@mui/icons-material";
import UserScoreCalculate from "./UserScoreCalculate";
import { FaCircle } from "react-icons/fa";

function JoinGroupCard({ group }) {
  const navigate = useNavigate();
  const date = new Date();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [btnStatus, setBtnStatus] = useState(false);
  //איתחול המשתנים שתופסים את הקבוצות ששיכות למשתמש
  let { managerGroup, participantGroup } = useFindMyGroups();
  //פרטי המשתמש המחובר
  const [activeUser, setActiveUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    return user;
  });
  const handleDropdownClick = () => {
    setShowDropdown(!showDropdown);
  };
  const handleGroupTime = (timeStamp) => {
    if (timeStamp != null || timeStamp != undefined) {
      let time = timeStamp.toDate();
      let hours = time.getHours();
      let minutes = time.getMinutes();
      minutes < 10
        ? (time = "start at " + hours + ": 0" + minutes)
        : (time = hours + ":" + minutes);
      //יציג עיגול ירוק עם כיתוב של פתוח עם הזמן הגיע
      console.log(date.getHours());
      if (hours > date.getHours()) {
        return time;
      } else if (hours === date.getHours() && minutes > date.getMinutes()) {
        return time;
      } else {
        return (
          <>
            <FaCircle style={{ color: "green", marginRight: "5px" }} />
            <span>Open</span>
          </>
        );
      }
    }
  };
  //אחראי על המודל של המשתמש לאחר לחיצה
  const [visible, setVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleUserClick = (id) => {
    setSelectedUserId(id);
    setVisible(true);
  };
  useEffect(() => {
    group.participants.forEach((element) => {
      if (element.userRef == activeUser.userRef) {
        setBtnStatus(true);
      }
    });
  });

  // //יצירת הדרופדאון של המשתתפים
  // const handleGroupParticipants = (participants) => {
  //   return (
  //     <div className="dropdown">
  //       <label
  //         onClick={handleDropdownClick}
  //         tabIndex={0}
  //         className="btn btn-xs m-1"
  //       >
  //         participants
  //       </label>
  //       {showDropdown && (
  //         <ul
  //           ref={dropdownRef}
  //           tabIndex={0}
  //           className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
  //         >
  //           {participants.map((user) => {
  //             return (
  //               <li
  //                 key={uuidv4()}
  //                 className="flex flex-row"
  //                 onClick={() => handleUserClick(user.userRef)}
  //               >
  //                 <Avatar image={user.userImg} size="large" shape="circle" />
  //                 <label className=" text-md font-bold">{user.name}</label>
  //               </li>
  //             );
  //           })}
  //           ,
  //         </ul>
  //       )}
  //       {visible && (
  //         <div>
  //           {/* המודל של המשתמש שנבחר */}
  //           <div className="card flex justify-content-center">
  //             <Dialog
  //               header="User profile"
  //               visible={visible}
  //               onHide={() => setVisible(false)}
  //               style={{ width: "50vw" }}
  //               breakpoints={{ "960px": "75vw", "641px": "100vw" }}
  //             >
  //               <div className="m-0">
  //                 {/* הפרטים של המשתמש */}
  //                 <UserProfileModal id={selectedUserId} />
  //               </div>
  //             </Dialog>
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   );
  // };

  //הצטרפות לקבוצה - רעיון לתת מעבר לעמוד הקבוצה
  const handleJoinGroup = async (group) => {
    if (participantGroup != null) {
      return toast.info(
        "you already participant in group!,evry user can join only one group at time!"
      );
    }
    console.log(group);
    let user = {
      name: activeUser.name,
      userImg: activeUser.userImg,
      userRef: activeUser.userRef,
    };
    group.participants.push(user);
    console.log(group);
    await setDoc(doc(db, "activeGroups", group.id), {
      description: group.description,
      groupImg: group.groupImg,
      groupTags: group.groupTags,
      groupTittle: group.groupTittle,
      groupSize: group.groupSize,
      isActive: group.isActive,
      location: group.location,
      managerRef: group.managerRef,
      participants: group.participants,
      timeStamp: group.timeStamp,
    })
      .then(() => {
        let achiev = activeUser.userAchievements.filter(
          (element) => element.name === "Joined Groups"
        );
        let item = achiev[0];
        UserScoreCalculate(item, "JoinedGroup", activeUser);
        toast.success("Join successfully!");
      })
      .catch((error) => {
        toast.error("An error occurred. Please try again.");
      });
    //אם הצליח לתת הודעה
  };

  const handleLeaveGroup = async (group) => {
    let groupId = null;
    let newParticipantsList = [];
    group.participants.map((participant) => {
      if (participant.userRef != activeUser.userRef) {
        newParticipantsList.push(participant);
      }
    });

    //בדיקה מה המספר סידורי של הקבוצה בה הוא משתתף
    const q = query(
      collection(db, "activeGroups"),
      where("managerRef", "==", group.managerRef)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots

      groupId = doc.id;
      console.log(doc.id, " => ", doc.data());
    });
    //מעדכן את המשתתפים בקבוצה
    const docRef = doc(db, "activeGroups", groupId);
    await updateDoc(docRef, {
      participants: newParticipantsList,
    });
    UpdateRecentActivities(group, "JoinedGroup", activeUser);
    navigate("/myGroups");
  };
  let btn2 = false;
  return (
    <div className=" w-auto h-46 m-2">
      <p className=" flex mt-1 justify-end ">
        {handleGroupTime(group.timeStamp)}
      </p>
      <div className=" flex flex-row">
        <div className=" ml-2">
          <div className="grid grid-cols-6 ">
            <div className="col-span-2">
              <Avatar image={group.groupImg} size="xlarge" shape="circle" />
            </div>
            <div className="col-span-4 mt-1 font-bold text-lg ">
              <p className="col-span-4 mt-1 font-bold text-lg ">
                {group.groupTittle}{" "}
              </p>
            </div>
          </div>
          <div className="ml-3 mt-2 justify-center text-sm ">
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
          </div>
        </div>
      </div>

      <div className=" ml-3 mt-3  border rounded-lg ">
        <p className=" ml-3 mt-3 text-sm underline ">discreption:</p>
        <p className=" ml-3 mt-3 text-lg text-center ">{group.description}</p>
        {/* /* <p>time: {formatRelative(selectedMarker.time, new Date())}</p> */}
      </div>
      <div className="w-full">
        <div className="flex flex-row mt-2">
          {group.participants.map((participant) => {
            {
              if (participant.userRef === activeUser.userRef) {
                btn2 = true;
              }
            }
            return (
              <Chip
                key={uuidv4()}
                avatar={
                  <Avatar
                    size="small"
                    shape="circle"
                    image={participant.userImg}
                  />
                }
                onClick={() => handleUserClick(participant.userRef)}
                color="success"
                className="ml-2"
                variant="outlined"
                label={participant.name}
              />
            );
          })}
        </div>
      </div>
      <div className=" ml-auto grid grid-cols-1 text-center">
        {group.managerRef === activeUser.userRef ? (
          <p className="underline font-bold mt-2">you are the manager</p>
        ) : btnStatus ? (
          <button
            onClick={() => handleLeaveGroup(group)}
            className="btn btn-sm  bg-red-600  ml-auto mt-3"
          >
            Leave
          </button>
        ) : (
          <button
            onClick={() => handleJoinGroup(group)}
            className="btn btn-sm  ml-auto mt-3"
          >
            Join
          </button>
        )}
      </div>
      {visible && (
        <div>
          {/* המודל של המשתמש שנבחר */}
          <div className="card flex justify-content-center">
            <Dialog
              header="User profile"
              visible={visible}
              onHide={() => setVisible(false)}
              style={{ width: "50vw" }}
              breakpoints={{ "960px": "75vw", "641px": "100vw" }}
            >
              <div className="m-0">
                {/* הפרטים של המשתמש */}
                <UserProfileModal id={selectedUserId} />
              </div>
            </Dialog>
          </div>
        </div>
      )}
    </div>
  );
}

export default JoinGroupCard;
