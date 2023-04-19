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
import NavBar from "../Coponents/NavBarComponents/NavBar";
import MyAddGroupMapComponent from "../Coponents/GroupsComponents/MyAddGroupMapComponent ";
import useFindMyGroups from "../Hooks/useFindMyGroups";
import { uuidv4 } from "@firebase/util";
import FillterGroups from "../Coponents/GroupsComponents/FillterGroups";
import UserScoreCalculate from "../Coponents/UserProfileComponents/UserScoreCalculate";
import SendAlertToUserForNewGroup from "../Coponents/GroupsComponents/SendAlertToUserForNewGroup";
import { Modal, Box } from "@mui/material";

function AddGroup() {
  const navigate = useNavigate();
  //puul active user from local storage
  const [activeUser, setActiveUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    return user;
  });
  //מודל מידע ראשוני
  const [displayPopUp, setDisplayPopUp] = useState(true);
  // when pop-up is closed this function triggers
  const closePopUp = () => {
    // setting key "seenPopUp" with value true into localStorage
    localStorage.setItem("seenPopUpAddGroup", true);
    // setting state to false to not display pop-up
    setDisplayPopUp(false);
  };

  // check if  user seen and closed the pop-up
  useEffect(() => {
    // getting value of "seenPopUp" key from localStorage
    let returningUser = localStorage.getItem("seenPopUpAddGroup");
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

      let newUpdateGroup = {
        address: "",
        groupTittle: "",
        groupImg: managerGroup.userImg,
        groupTags: [],
        groupSize: null,
        managerRef: managerGroup.managerRef,
        location: { lat: 0, lng: 0 },
        description: "",
        participants: managerGroup.participants,
        isActive: managerGroup.isActive,
        timeStamp: "00:00:00",
        id: managerGroup.id,
      };
      setNewGroup(newUpdateGroup);

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
    let newEditGroup = {
      groupTittle: selectedCourse,
      groupTags: selectedSubjects,
      groupSize: parseInt(selectedNumber),
      location: geoPoint,
      isActive: false,
      groupImg: activeUser.userImg,
      managerRef: activeUser.userRef,
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
    };
    //SET USER new group
    await setDoc(doc(db, "activeGroups", groupId), {
      groupTittle: selectedCourse,
      groupTags: selectedSubjects,
      groupSize: parseInt(selectedNumber),
      location: geoPoint,
      isActive: false,
      groupImg: activeUser.userImg,
      managerRef: activeUser.userRef,
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
    }).then(
      handleFriendRequests(groupId, newEditGroup)
      //בודק מי מהמשתמשים ביקש לקבל התראה ושולח הודעה}
    );

    navigate("/myGroups");
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
      const message = activeUser.name + " send you a request to join the group";
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
                <img src="https://firebasestorage.googleapis.com/v0/b/regroup-a4654.appspot.com/o/images%2Fteamwork.png?alt=media&token=21523315-cbdc-42e3-b046-2fe14652b1b4" className=" flex rounded-2xl h-20 w-20 mb-2 mx-auto"/>
                <h1>Create your first group !</h1>
                <p className="mt-2">
                Here you can create a new group, if you haven't found a group to participate in. You can Create one group at a time.
                </p>
                <p className="mt-2">
                With the help of advanced filters, you can quickly create a group suitable for your educational needs.
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
            src="https://firebasestorage.googleapis.com/v0/b/regroup-a4654.appspot.com/o/images%2Fteamwork.png?alt=media&token=21523315-cbdc-42e3-b046-2fe14652b1b4"
            alt="Users Recored"
          />{" "}
          <p className=" font-bold text-xl">Create Group</p>
        </div>
      
      <div className="form grid justify-center mb-4 w-full text-center">
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
