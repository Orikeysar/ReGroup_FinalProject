import React from "react";
import { useState, useRef } from "react";
import { Avatar } from "primereact/avatar";
import { uuidv4 } from "@firebase/util";
import { db } from "../FirebaseSDK";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import UserProfileModal from "./UserProfileModal";
import { Dialog } from "primereact/dialog";
import useFindMyGroups from "../Hooks/useFindMyGroups";
function JoinGroupCard({ group }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

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
      time = hours + ":" + minutes;
      return time;
    }
  };
  //אחראי על המודל של המשתמש לאחר לחיצה
  const [visible, setVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleUserClick = (id) => {
    setSelectedUserId(id);
    setVisible(true);
  };
  //יצירת הדרופדאון של המשתתפים
  const handleGroupParticipants = (participants) => {
    return (
      <div className="dropdown">
        <label
          onClick={handleDropdownClick}
          tabIndex={0}
          className="btn btn-xs m-1"
        >
          participants
        </label>
        {showDropdown && (
          <ul
            ref={dropdownRef}
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            {participants.map((user) => {
              return (
                <li
                  key={uuidv4()}
                  className="flex flex-row"
                  onClick={() => handleUserClick(user.userRef)}
                >
                  <Avatar image={user.userImg} size="large" shape="circle" />
                  <label className=" text-md font-bold">{user.name}</label>
                </li>
              );
            })}
            ,
          </ul>
        )}
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
  };

  //הצטרפות לקבוצה - רעיון לתת מעבר לעמוד הקבוצה
  const handleJoinGroup = async (group) => {
    if(participantGroup !=null){
      return toast.info("you already participant in group!,evry user can join only one group at time!");
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
        toast.success("Join successfully!");
      })
      .catch((error) => {
        toast.error("An error occurred. Please try again.");
      });
    //אם הצליח לתת הודעה
  };
  return (
    <div className=" w-auto h-46 m-2">
      <p className=" flex mt-1 justify-end ">
        start at {handleGroupTime(group.timeStamp)}
      </p>
      <div className=" flex flex-row">
        <div className=" ml-2">
          <Avatar image={group.groupImg} size="xlarge" shape="circle" />
        </div>
        <div>
          <p className="ml-3 mt-1 justify-center font-bold text-xl">
            {group.groupTittle}{" "}
          </p>
          <p className="ml-3 mt-1 justify-center  text-lg">
            {group.groupTags
              .map((sub, index) => {
                // Check if this is the last item in the array
                const isLast = index === group.groupTags.length - 1;
                // Append a "|" character if this is not the last item
                const separator = isLast ? "" : " | ";
                // Return the subject name with the separator character
                return sub + separator;
              })
              .join("")}{" "}
          </p>
        </div>
      </div>

      <div className=" ml-3 mt-3 text-lg">
        <p>{group.description}</p>
        {/* /* <p>time: {formatRelative(selectedMarker.time, new Date())}</p> */}
      </div>
      <div className="flex flex-row ml-3 mt-3">
        <div>{handleGroupParticipants(group.participants)}</div>
        <div className=" ml-auto justify-end">
          <button
            onClick={() => {
              handleJoinGroup(group);
            }}
            className="btn btn-xs  ml-auto mt-1"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
}

export default JoinGroupCard;
