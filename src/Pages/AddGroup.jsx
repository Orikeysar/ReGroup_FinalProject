import React from "react";
import { useState, useEffect } from "react";
import { RiGroup2Fill } from "react-icons/ri";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import { alertGroupEdited, db, sendMailOverHTTP } from "../FirebaseSDK";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  setDoc,
  getDoc,
  doc,
  GeoPoint,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import NavBar from "../Coponents/navbars/NavBar";
import MyAddGroupMapComponent from "../Coponents/GroupsComponents/MyAddGroupMapComponent ";
import useFindMyGroups from "../Hooks/useFindMyGroups";
import { uuidv4 } from "@firebase/util";
import FillterGroups from "../Coponents/GroupsComponents/FillterGroups";
import UserScoreCalculate from "../Coponents/UserScoreCalculate";
import SendAlertToUserForNewGroup from "../Coponents/GroupsComponents/SendAlertToUserForNewGroup";

function AddGroup() {
  const navigate = useNavigate();
  //puul active user from local storage
  const [activeUser, setActiveUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    return user;
  });
  //איתחול משתני יצירת קבוצה וכפתור הסבמיט
  const [btnState, setBtnState] = useState("Create New Group"); //כפתור
  const [cordinates, setCordinates] = useState(null); //מיקום
  const [friendsInvited, setFriendsInvited] = useState([]); //חברים
  const [selectedCourse, setSelectedCourse] = useState([]); //קורס
  const [selectedSubjects, setSelectedSubjects] = useState([]); //נושאים
  const [selectedNumber, setSelectedNumber] = useState([]); //גודל
  const [selectTimeStamp, setSelectTimeStamp] = useState(null); //זמן

  // איתחול רשימת הקבוצות שיוצגו על המפה
  const [filteredGroups, setFilteredGroups] = useState([]);
  //במקרה ובחר להראות קבוצות דומות נשנה את האובייקט ל״אמת״ וזה יציג את הקבוצות
  const [fillteredGroupShow, setFillteredGroupShow] = useState(false);
  //איתחול קבוצה חדשה לפני בדיקה אם קיימת קבוצה בדאטה
  const [newGroup, setNewGroup] = useState({
    address: "",
    groupTittle: "",
    groupImg: activeUser.userImg,
    groupTags: [],
    groupSize: null,
    managerRef: activeUser.userRef,
    location: { lat: 0, lng: 0 },
    description: "",
    participants: [],
    isActive: false,
    timeStamp: "00:00:00",
    id: null,
  });

  //איתחול המשתנים שתופסים את הקבוצות ששיכות למשתמש
  let { managerGroup, participantGroup } = useFindMyGroups();

  useEffect(() => {
    if (managerGroup != null && btnState === "Create New Group") {
      setBtnState("Edit Your Group");
      let participants = managerGroup.participants.filter(
        (participant) => participant.userRef !== managerGroup.managerRef
      );
      let newUpdateGroup = {
        address: "",
        groupTittle: "",
        groupImg: managerGroup.userImg,
        groupTags: [],
        groupSize: null,
        managerRef: managerGroup.managerRef,
        location: { lat: 0, lng: 0 },
        description: "",
        participants: participants,
        isActive: managerGroup.isActive,
        timeStamp: "00:00:00",
        id: managerGroup.id,
      };

      // let catchGroupExist = {
      //   address: managerGroup.address,
      //   groupTittle: managerGroup.groupTittle,
      //   groupImg: managerGroup.groupImg,
      //   groupTags: managerGroup.groupTags,
      //   groupSize: managerGroup.groupSize,
      //   managerRef: managerGroup.managerRef,
      //   location: managerGroup.location,
      //   description: managerGroup.description,
      //   participants: participants,
      //   isActive: managerGroup.isActive,
      //   timeStamp:managerGroup.timeStamp,
      //   id: managerGroup.id,
      // };
      // setNewGroup(catchGroupExist);
      // setCordinates(catchGroupExist.location); //מיקום
      // setFriendsInvited(catchGroupExist.participants); //חברים
      // setSelectedCourse(catchGroupExist.groupTittle); //קורס
      // setSelectedSubjects(catchGroupExist.groupTags); //נושאים
      // setSelectedNumber(catchGroupExist.groupSize); //גודל
      // setSelectTimeStamp(catchGroupExist.timeStamp); //זמן
    }
  }, [managerGroup]);
  //הפונקציה נשלחת לקומפוננט של הפילטורים ואחראית לעדכן את הערכים שחוזרים משם
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

  //הפונקציה תופסת שינויים בשהמשתמש מכניס למשתנים
  const onChange = (e) => {
    setNewGroup((prevState) => ({
      ...prevState,

      //CHECK WHAT THE ID IN THE UNPUT THAT CHANGE AND INSERT USER INPUT
      //LIKE THIS YOU CAN MENAGE setText TOGETHER ON MANY TARGETS
      [e.target.id]: e.target.value,
    }));
  };

  //handle added friend
  const handleInviteFriendChange = (event, value) => {
    setFriendsInvited(value);
  };

  //מקבלת את רשימת החברים ומעדכנת בדאטה שלהם את הבקשה
  const handleFriendRequests = async (groupRef, groupDataTemp) => {
    for (const friend of friendsInvited) {
      const docRef = doc(db, "users", friend.userRef);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        let data = docSnap.data();
        let participant = {
          name: activeUser.name,
          userImg: activeUser.userImg,
          userRef: activeUser.userRef,
          email: activeUser.email,
          groupRef: groupRef,
          groupData: groupDataTemp,
          type: "invite",
        };
        data.groupParticipantsToApproval.push(participant);
        await updateDoc(docRef, {
          groupParticipantsToApproval: data.groupParticipantsToApproval,
        });
        handleSendEmail(friend);
      } else {
        toast.info("user " + friend.name + " not found ");
      }
    }
    
  };

  //הפונקציה בודקת האם מילא את כל הפרטים
  const CheckBeforeCreateNewGroup = async () => {
    if (cordinates == null) {
      return toast.error("choose group location on the map");
    } else if (newGroup.timeStamp === "00:00:00") {
      return toast.error("choose group arival time!");
    } else if (
      selectedCourse == null ||
      selectedSubjects == null ||
      selectedNumber == null
    ) {
      return toast.error("choose fillters for the group you create");
    } else if (newGroup.address === "" || newGroup.description === "") {
      return toast.error(
        "fill address and description for the group you want to create"
      );
    } else {
      newGroup.participants.push({
        name: activeUser.name,
        userImg: activeUser.userImg,
        userRef: activeUser.userRef,
        email: activeUser.email,
      });

      if (managerGroup != null) {
        if (
          window.confirm(
            "you already have group you manage, notice that you will edit that group!"
          ) === true
        ) {
          UpdateEditedGroup(managerGroup.id);
        } else {
          navigate("/myGroups");
        }
      } else {
        //במידה ואין למשתמש קבוצה שהוא מנהל
        CreateNewGroup();
      }
    }
  };
  //פותח קבוצה חדשה עם מספר סידורי הישן
  const UpdateEditedGroup = async (groupId) => {
    const now = new Date();
    const [hours, minutes] = newGroup.timeStamp.split(":");
    now.setHours(hours, minutes, 0, 0);
    const geoPoint = new GeoPoint(cordinates.lat, cordinates.lng);
    //SET USER new group
    await setDoc(doc(db, "activeGroups", groupId), {
      groupTittle: selectedCourse,
      groupTags: selectedSubjects,
      groupSize: parseInt(selectedNumber),
      location: geoPoint,
      isActive: newGroup.isActive,
      groupImg: newGroup.userImg,
      managerRef: newGroup.userRef,
      address: newGroup.address,
      description: newGroup.description,
      participants: newGroup.participants,
      id: groupId,
      timeStamp: Timestamp.fromDate(
        new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          now.getHours(),
          now.getMinutes()
        )
      ),
    })
      //אם הצליח, זה יישלח רק למשתתפים שהם לא המנהל הודעה על שינוי.  במקרה והם לא אישרו קבלת הודעות פוש באפליקציה יישלח אליהם מייל
      .then(async () => {
        toast.success("edit success");
        for (const item of newGroup.participants) {
          if (item.userRef != activeUser.userRef) {
            const docRef = doc(db, "fcmTokens", item.userRef);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              const token = data.fcmToken;
              const title =
                "The group you are registered to in " +
                selectedCourse +
                " as been edited.";
              const message = " Please keep up to date with the changes ";
              const alert = {
                token: token,
                title: title,
                message: message,
              };
              console.log(alert);
              alertGroupEdited(alert);
            } else {
              fetch(
                "https://us-central1-regroup-a4654.cloudfunctions.net/sendMailOverHTTP",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    subject: `Your group as been edited !`,
                    email: item.email,
                    message:
                      "The group you are registered to - " +
                      selectedCourse +
                      " as been edited. Please keep up to date with the changes. you can see here the changes in myGroups page : https://regroup-a4654.web.app/myGroups",
                  }),
                }
              )
                .then((response) => response.text())
                .then((data) => console.log(data))
                .catch((error) => console.error(error));
            }
          }
        }
        navigate("/myGroups");
      })
      .catch((error) => {
        toast.error("Bad Cardictionals details,try again");
        console.log(error);
      });
  };
  //פותח קבוצה חדשה עם מספר סידור חדש
  const CreateNewGroup = async () => {
    const now = new Date();
    const [hours, minutes] = newGroup.timeStamp.split(":");
    now.setHours(hours, minutes, 0, 0);
    const geoPoint = new GeoPoint(cordinates.lat, cordinates.lng);
    let groupParticipants = [];
    groupParticipants.push({
      name: activeUser.name,
      userImg: activeUser.userImg,
      userRef: activeUser.userRef,
      email: activeUser.email,
    });
    let groupRef = uuidv4();
    let groupDataTemp = {
      groupTittle: selectedCourse,
      groupTags: selectedSubjects,
      groupSize: parseInt(selectedNumber),
      location: geoPoint,
      isActive: false,
      groupImg: activeUser.userImg,
      managerRef: activeUser.userRef,
      address: newGroup.address,
      description: newGroup.description,
      participants: groupParticipants,
      id: groupRef,
      timeStamp: Timestamp.fromDate(
        new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          now.getHours(),
          now.getMinutes()
        )
      ),
    };
    //SET USER new group
    await setDoc(doc(db, "activeGroups", groupRef), {
      groupTittle: selectedCourse,
      groupTags: selectedSubjects,
      groupSize: parseInt(selectedNumber),
      location: geoPoint,
      isActive: true,
      id: groupRef,
      groupImg: activeUser.userImg,
      managerRef: activeUser.userRef,
      address: newGroup.address,
      description: newGroup.description,
      participants: groupParticipants,
      timeStamp: Timestamp.fromDate(
        new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          now.getHours(),
          now.getMinutes()
        )
      ),
    })
      .then(() => {
        let achiev = activeUser.userAchievements.filter(
          (element) => element.name === "Opened Groups"
        );
        let item = achiev[0];
        UserScoreCalculate(item, "CreatedGroups", activeUser);
        toast.success("create success");
        handleFriendRequests(groupRef, groupDataTemp);
        //בודק מי מהמשתמשים ביקש לקבל התראה ושולח הודעה

        SendAlertToUserForNewGroup(selectedCourse, selectedSubjects);
        navigate("/myGroups");
      })
      .catch((error) => {
        toast.error("Bad Cardictionals details,try again");
        console.log(error);
      });
  };
  //בלחיצה על יצירת קבוצה הפונקציה בודקת האם יש קבוצות דומות שפתוחות
  const onSubmitForm = async (e) => {
    //במידה ויש קבוצה דומה המשתמש יקבל התראה לפני פתיחת הקבוצה
    if (filteredGroups.length > 0) {
      
      if (
        window.confirm(
          "you want to see another active groups with same parameters?"
        ) === true
      ) {
        setFillteredGroupShow(true);
      } else {
        setFillteredGroupShow(false);
        CheckBeforeCreateNewGroup();
      }
    } else {
      CheckBeforeCreateNewGroup();
    }
  };

  const handleSendEmail = async (friend) => {
      const docRefToken = doc(db, "fcmTokens", friend.userRef);
      const docSnapToken = await getDoc(docRefToken);
      if (docSnapToken.exists()) {
        const data = docSnapToken.data();
        const token = data.fcmToken;
        const title = "Group Request  !";
        const message =
          activeUser.name + " send you a request to join the group";
        const alert = {
          token: token,
          title: title,
          message: message,
        };
        console.log(alert);
        alertGroupEdited(alert);
      } else {
        fetch(
          "https://us-central1-regroup-a4654.cloudfunctions.net/sendMailOverHTTP",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              subject: `Group Request !`,
              email: friend.email,
              message:
                activeUser.name +
                " send you a request to join the group . For more details : https://regroup-a4654.web.app/requestGroups",
            }),
          }
        )
          .then((response) => response.text())
          .then((data) => console.log(data))
          .catch((error) => console.error(error));
    }
    toast.success("Messages have been sent to users");
  };

  return (
    <div className="container  ">
      {/* //TOP NAVBAR */}
      <div className="topNavBar w-full mb-24">
        <NavBar />
      </div>
      <div className=" flex items-center space-x-2 justify-center text-base align-middle mb-5">
        {" "}
        <RiGroup2Fill size={30} className=" mr-2 w-max " />
        <p className=" font-bold text-xl">Create Groups</p>
      </div>
      <div className=" flex justify-center mb-2">
        <label className=" text-lg">here you can go back to find groups</label>
        &nbsp;
        <label
          onClick={() => navigate("/findGroups")}
          className=" font-bold text-lg hover:drop-shadow-xl underline"
        >
          Find Group
        </label>
      </div>
      <div className="form grid justify-center my-4 w-full text-center">
        {/* //Fillters group component */}
        <div className="self-center justify-center">
          <FillterGroups handleFillterGroups={handleFillterGroups} />
          {/* //address description */}
          <div>
            <input
              type="text"
              className="flex row-auto  mt-4 w-full border border-gray-400 rounded-md min-h-12 text-center"
              id="address"
              placeholder="write your adress discription"
              onChange={onChange}
            />
          </div>
          {/* //description */}
          <textarea
            id="description"
            className="textarea textarea-primary textarea-bordered  border-gray-400 w-full text-center  mt-4 "
            onChange={onChange}
            placeholder="Write your group discription"
            required
          ></textarea>
          {/* //INVITE FREINDS */}
          <div>
            <Autocomplete
              className=" mt-4"
              onChange={handleInviteFriendChange}
              multiple
              id="tags-filled"
              options={activeUser.friendsList}
              getOptionLabel={(option) => option.name}
              freeSolo
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option.name}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Invite Friends"
                  placeholder="you can add more then one"
                />
              )}
            />
          </div>
          {/* //time picker */}
          <div className="flex row-auto mt-4 w-full ">
            <p className="mr-2">Time of Arival:</p>
            <input
              type={"time"}
              id="timeStamp"
              onChange={onChange}
              className="border rounded-lg"
              required
            ></input>
          </div>
          {/* //submit button */}
          <div className="mb-2 mt-4 ">
            <button
              placeholder={btnState}
              onClick={onSubmitForm}
              className="btn"
            >
              {btnState}
            </button>
          </div>
        </div>
      </div>

      <div className="map  drop-shadow-xl w-full">
        <MyAddGroupMapComponent
          isMarkerShown
          setCordinates={setCordinates}
          filteredGroups={filteredGroups}
          fillteredGroupShow={fillteredGroupShow}
        />
      </div>
    </div>
  );
}

export default AddGroup;
