import React from "react";
import Map from "../Coponents/GroupsComponents/Map";
import { useState, useEffect } from "react";
import { db } from "../FirebaseSDK";
import NavBar from "../Coponents/navbars/NavBar";
import { Avatar } from "primereact/avatar";
import { uuidv4 } from "@firebase/util";
import {
  setDoc,
  updateDoc,
  doc,
  GeoPoint,
  Timestamp,
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BsFilePerson } from "react-icons/bs";
import { FaAudioDescription } from "react-icons/fa";
import Chip from "@mui/material/Chip";
import randomColor from "randomcolor";
import FillterGroups from "../Coponents/GroupsComponents/FillterGroups";
import useFindMyGroups from "../Hooks/useFindMyGroups";
import UserProfileModal from "../Coponents/profileComponents/UserProfileModal";
import UpdateRecentActivities from "../Coponents/UpdateRecentActivities";
import { getAuth } from "firebase/auth";
import { Dialog } from "primereact/dialog";
import { FaCircle } from "react-icons/fa";
import CreateGroupButton from "../Coponents/GroupsComponents/CreateGroupButton";
import "animate.css/animate.min.css";

function MyGroupPage() {
  const navigate = useNavigate();
  const date = new Date();

 
  //איתחול המשתנים שתופסים את הקבוצות ששיכות למשתמש
  let { managerGroup, participantGroup } = useFindMyGroups();
  //מושך מהלוקל את פרטי המשתמש המחובר
  const [activeUser, setActiveUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    return user;
  });
  //בודקת עידכון בזמן אמת במשתמש ומעדכנת את הלוקאל אם יש
  useEffect(() => {
    const docRef = doc(db, "users", activeUser.userRef);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      const userData = doc.data();
      // Update the activeUser state and localStorage with the new data
      setActiveUser(userData);
      localStorage.setItem("activeUser", JSON.stringify(userData));
    });
    // Unsubscribe from the snapshot listener when the component unmounts
    return unsubscribe;
  }, []);
  //מאתחל משתנים שקשורים למודל בעת לחיצה על משתתף בקבוצה
  const [visible, setVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  //פונקציה שמופעלת בעת לחיצה על חבר בקבוצה
  const handleUserClick = (id) => {
    setSelectedUserId(id);
    setVisible(true);
  };
  useEffect(() => {
    let myfilteredgroup = [];
    if (managerGroup != null) {
      myfilteredgroup.push(managerGroup);
    }
    if (participantGroup != null) {
      myfilteredgroup.push(participantGroup);
    }
    if (myfilteredgroup.length > 0) {
      setMyFilteredGroups(myfilteredgroup);
    }
  }, [managerGroup, participantGroup]);
  const [managerGroupId, setManagerGroupId] = useState(null);
  //פונקציה שמסדרת את זמן הקבוצה
  const handleGroupTime = (timeStamp) => {
    if (timeStamp != null || timeStamp != undefined) {
      let time = timeStamp.toDate();
      let hours = time.getHours();
      let minutes = time.getMinutes();
      minutes < 10
        ? (time = "start at " + hours + ": 0" + minutes)
        : (time = hours + ":" + minutes);
      //יציג עיגול ירוק עם כיתוב של פתוח עם הזמן הגיע
     
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
  //animation my groups divs
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);
  //get all the filters from FiltterGroup component
  const [filteredGroups, setFilteredGroups] = useState([]);

  const [myFilteredGroups, setMyFilteredGroups] = useState([]);

  const handleFillterGroups = (filteredGroups) => {
    //מסנן את הקבוצות שלי לתוך המפה
    setFilteredGroups(filteredGroups);
  };
  //הצגת הקבוצה בה המשתמש מנהל כרגע
  const ShowManagerGroup = () => {
    let { managerGroup, participantGroup } = useFindMyGroups();
    if (managerGroup == null) {
      return (
        <div className="shadow-md card w-auto h-46 m-2 p-2 border border-stone-400 overflow-hidden">
            <h2>Sorry... you are not managing a group right now. You can create a group and invite people to get started.</h2>
          </div>
      )
    }
    return (
      <div className=" col-md-4 animated fadeIn">
        <div
          className="shadow-md card w-auto h-46 m-2 p-2 border border-stone-400 overflow-hidden"
          key={managerGroup.managerRef}
        >
          <p className="flex mt-1 justify-end">
            {handleGroupTime(managerGroup.timeStamp)}
          </p>
          <div className="flex flex-row flex-wrap">
            <div className="ml-2">
              <Avatar
                image={managerGroup.groupImg}
                size="xlarge"
                shape="circle"
              />
            </div>
            <div className="w-full md:w-4/5 ml-3 mt-2">
              <p className="mt-2 justify-center font-bold text-xl">
                {managerGroup.groupTittle}
              </p>
              <div className="mt-2 justify-center text-lg flex flex-wrap">
                {managerGroup.groupTags.map((sub, index) => {
                  let color = randomColor({
                    luminosity: "light",
                    hue: "random",
                  });
                  return (
                    <Chip
                      key={uuidv4()}
                      style={{ backgroundColor: color }}
                      className="mr-2 mt-2 font-bold"
                      variant="outlined"
                      label={sub}
                    />
                  );
                })}
              </div>
              <p className="flex flex-row mt-2">
                <BsFilePerson className="mr-1" />
                {managerGroup.participants.length} / {managerGroup.groupSize}
                {/* //see FREINDS */}
              </p>
              <div className="flex flex-wrap mt-2">
                {managerGroup.participants.map((participants) => {
                  return (
                    <Chip
                      key={uuidv4()}
                      avatar={
                        <Avatar
                          size="small"
                          shape="circle"
                          image={participants.userImg}
                        />
                      }
                      onClick={() => handleUserClick(participants.userRef)}
                      color="success"
                      className="mr-2 mt-2"
                      variant="outlined"
                      label={participants.name}
                    />
                  );
                })}
              </div>{" "}
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
              <div className="flex flex-col md:flex-row mt-2">
                <div className="md:w-3/4">
                  <FaAudioDescription className="mr-1 min-w-max" />
                  <div className="border rounded-xl overflow-hidden">
                    <p className="ml-3 mt-3 text-lg text-center break-words">
                      {managerGroup.description}
                    </p>
                  </div>
                </div>
                <div className="text-center md:w-1/4 grid grid-cols-1">
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
      </div>
    );
  };
  //הצגת הקבוצה בה המשתמש חבר כרגע
  const ShowParticipantGroup = () => {
    let { managerGroup, participantGroup } = useFindMyGroups();
    if (participantGroup == null) {
      return (
        <div className="shadow-md card w-auto h-46 m-2 p-2 border border-stone-400 overflow-hidden">
            <h2>Sorry... you don't participate in groups. You can send a request to join or create a group and share with others.</h2>
          </div>
      )
    }
    return (
      <div className="col-lg-4 col-md-6 col-sm-12 animated fadeIn ">
        <div
          className="shadow-md card w-auto h-46 m-2 p-2 border border-stone-400 overflow-hidden"
          key={participantGroup.managerRef}
        >
          <p className=" flex mt-1 justify-end ">
            {handleGroupTime(participantGroup.timeStamp)}
          </p>
          <div className="flex flex-col lg:flex-row">
            <div className="lg:mr-4 mb-4 lg:mb-0">
              <Avatar
                image={participantGroup.groupImg}
                size="xlarge"
                shape="circle"
              />
            </div>
            <div className="w-full">
              <p className="ml-3 mt-2 justify-center font-bold text-xl">
                {participantGroup.groupTittle}
              </p>
              <div className="ml-3 mt-2 justify-center text-lg flex flex-wrap">
                {participantGroup.groupTags.map((sub) => {
                  const color = randomColor({
                    luminosity: "light",
                    hue: "random",
                  });
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
                })}
              </div>
              <div className="flex flex-row w-full ml-3 mt-2">
                <BsFilePerson className="mr-1" />
                <p>
                  {participantGroup.participants.length} /{" "}
                  {participantGroup.groupSize}
                </p>
              </div>
              <div className="flex flex-wrap lg:flex-no-wrap lg:-mx-2 ml-3 mt-2">
                {participantGroup.participants.map((participants) => (
                  <Chip
                    key={uuidv4()}
                    avatar={
                      <Avatar
                        size="small"
                        shape="circle"
                        image={participants.userImg}
                      />
                    }
                    onClick={() => handleUserClick(participants.userRef)}
                    color="success"
                    className="mr-2 mt-2 lg:mx-2"
                    variant="outlined"
                    label={participants.name}
                  />
                ))}
              </div>
              {visible && (
                <div>
                  <div className="card flex justify-content-center">
                    <Dialog
                      header="User profile"
                      visible={visible}
                      onHide={() => setVisible(false)}
                      style={{ width: "50vw" }}
                      breakpoints={{ "960px": "75vw", "641px": "100vw" }}
                    >
                      <div className="m-0">
                        <UserProfileModal id={selectedUserId} />
                      </div>
                    </Dialog>
                  </div>
                </div>
              )}
              <div className=" flex flex-row ml-3 mt-2 w-full">
                <FaAudioDescription className="mr-1 min-w-max" />
                <div className="w-full max-w-full border rounded-xl mr-2 overflow-hidden">
                  <p className="ml-3 mt-3 text-lg text-center break-words">
                    {participantGroup.description}
                  </p>
                </div>
              </div>
              <div className="text-center grid grid-cols-1 w-4/5">
                <button
                  key={uuidv4()}
                  className="editButton btn btn-xs text-sm mt-2 "
                  onClick={() => {
                    handleLeaveGroup(participantGroup);
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
    const auth = getAuth();
    let groupId = null;
    let groupdata = null;
    if (window.confirm("you sure you want to delete this group?") === true) {
      //אם אישר למחוק את הקבוצה

      const q = query(
        collection(db, "activeGroups"),
        where("managerRef", "==", activeUser.userRef)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docToDelete = querySnapshot.docs[0];
        const groupId = docToDelete.id;
        const groupData = docToDelete.data();

        console.log(groupId, " delete=> ", groupData);
        if (groupId) {
          // Delete the document
          await deleteDoc(doc(db, "activeGroups", groupId));
          console.log("Document deleted:", groupId);
          toast.success("delete success");
          //send this group to user recent groups גל שים לב
          let now = Timestamp.now();
          let newGroupActiviteis = {
            address: groupData.address,
            groupTittle: groupData.groupTittle,
            groupImg: groupData.groupImg,
            groupTags: groupData.groupTags,
            groupSize: groupData.groupSize,
            managerRef: activeUser.userRef,
            location: groupData.location,
            description: groupData.description,
            participants: groupData.participants,
            isActive: false,
            timeStamp: now,
          };
          // activeUser.recentActivities.push(newGroupActiviteis);
         
          //updat recent activites
          UpdateRecentActivities(
            newGroupActiviteis,
            "CreatedGroups",
            activeUser
          );

          localStorage.setItem("activeUser", JSON.stringify(activeUser));
          navigate("/");
        }
      } else {
        console.log("No document found with the specified managerRef.");
        toast.error("error in deleting group please try again!");
      }
    } // Remove the 'group' field from the document
  };

  //תופס את לחיצת הכפתור עריכה על כרטיס הקבוצה
  const handleEditManagerGroup = (group) => {
    navigate("/createGroups");
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
    // Set the "capital" field of the city 'DC'
    await updateDoc(docRef, {
      participants: newParticipantsList,
    });
    UpdateRecentActivities(group, "JoinedGroup", activeUser);
    navigate("/");
  };

  return (
    <div className="container">
      {/* //TOP NAVBAR */}
      <div className="topNavBar w-full mb-24">
        <NavBar />
      </div>
      <div className="row userInfo">
        <div className="hidden">
          <FillterGroups handleFillterGroups={handleFillterGroups} />
        </div>

        {/* //הצגת הקבוצות שנמצאו */}
        <div
          className="col-md-4 animate__animated animate__fadeIn animate__slow"
          style={{
            backgroundColor: "#f8f8f8",
            padding: "20px",
            borderRadius: "10px",
            marginTop: "20px",
          }}
        >
          <p
            className="animate__animated animate__slideInLeft"
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            Groups you manage:
          </p>
          {ShowManagerGroup()}
          <p
            className="animate__animated animate__slideInLeft"
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              textAlign: "center",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            Groups you participate in:
          </p>
          {ShowParticipantGroup()}
        </div>
      </div>
      <CreateGroupButton />
      <div className="p-1 drop-shadow-xl map-container animate__animated animate__fadeIn animate__slow">
        <Map filteredGroups={myFilteredGroups} isMarkerShown />
      </div>
    </div>
  );
}

export default MyGroupPage;
