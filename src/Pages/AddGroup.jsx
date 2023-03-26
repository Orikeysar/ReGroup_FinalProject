import React from "react";
import { useState } from "react";
import { RiGroup2Fill } from "react-icons/ri";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import { db } from "../FirebaseSDK";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setDoc, doc, GeoPoint, Timestamp } from "firebase/firestore";
import NavBar from "../Coponents/NavBar";
import BottumNavigation from "../Coponents/BottumNavBar";
import MyAddGroupMapComponent from "../Coponents/MyAddGroupMapComponent ";

import { uuidv4 } from "@firebase/util";

import FillterGroups from "../Coponents/FillterGroups";

function AddGroup() {
  const navigate = useNavigate();

  //puul active user from local storage
  const [activeUser, setActiveUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    return user;
  });
  const [cordinates, setCordinates] = useState(null);

  const [fillteredGroupShow, setFillteredGroupShow] = useState(false);
  const [newGroup, setNewGroup] = useState({
    address: "",
    groupTittle: "",
    groupImg: activeUser.userImg,
    groupTags: [],
    groupSize: 0,
    id: activeUser.userRef,
    location: { lat: 0, lng: 0 },
    description: "",
    participants: [],
    isActive: false,
    timeStamp: "00:00:00",
  });

  // const [activeGroups, setActiveGroups] = useState([]);
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
  const useEffect =
    (() => {
      setNewGroup({
        ...newGroup,
        groupTittle: selectedCourse,
        groupTags: selectedSubjects,
        groupSize: selectedNumber,
        location: cordinates,
        isActive: true,
        groupImg: activeUser.userImg,
        id: activeUser.userRef,
      });
    },
    [newGroup]);

  //הפונקציה תופסת שינויים בשהמשתמש מכניס למשתנים
  const onChange = (e) => {
    setNewGroup((prevState) => ({
      ...prevState,

      //CHECK WHAT THE ID IN THE UNPUT THAT CHANGE AND INSERT USER INPUT
      //LIKE THIS YOU CAN MENAGE setText TOGETHER ON MANY TARGETS
      [e.target.id]: e.target.value,
    }));
  };

  //handle added
  const handleInviteFriendChange = (event, value) => {
    setNewGroup({
      ...newGroup,
      participants: [...value,],
    });


  };
//הפונקציה מכניסה את הקבוצה לדאטה בייס
  const CreateNewGroup = async () => {
 
    if (cordinates == null ) {
      return toast.error("choose group location on the map");
    } else if (newGroup.timeStamp === "00:00:00") {
      return toast.error("choose group arival time!");
    } else if (
      selectedCourse == null ||
      selectedSubjects == null ||
      selectedNumber == null
    ) {
     return toast.error("choose fillters for the group you create");
    } else if(newGroup.address === "" ||newGroup.description === ""){

      return toast.error("fill adress and discription for the group you create");

    }else {
    

      newGroup.participants.push( {
            name: activeUser.name,
            userImg: activeUser.userImg,
            userRef: activeUser.userRef,
          })
      
      


      const now = new Date();
      const [hours, minutes] = newGroup.timeStamp.split(":");
      now.setHours(hours, minutes, 0, 0);
      const geoPoint = new GeoPoint(cordinates.lat, cordinates.lng);
      //SET USER TOP10
      await setDoc(doc(db, "activeGroups", uuidv4()), {
        groupTittle: selectedCourse,
        groupTags: selectedSubjects,
        groupSize: parseInt(selectedNumber),
        location: geoPoint,
        isActive: true,
        groupImg: activeUser.userImg,
        id: activeUser.userRef,
        address: newGroup.address,
        description: newGroup.description,
        participants: newGroup.participants,
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
          toast.success("create success");
        })
        .catch((error) => {
          toast.error("Bad Cardictionals details,try again");
          console.log(error);
        });
    }
  };

  const onSubmitForm = async (e) => {
    //במידה ויש קבוצה דומה המשתמש יקבל התראה לפני פתיחת הקבוצה
    if (filteredGroups.length > 0) {
      if (
        window.confirm(
          "you want to see another active groups with same parameters!"
        ) === true
      ) {
        setFillteredGroupShow(true);
      } else {
        setFillteredGroupShow(false);
        CreateNewGroup();
      }
    } else {
      CreateNewGroup();
    }
  };

  return (
    <div className="container  ">
      {/* //TOP NAVBAR */}
      <div className="topNavBar w-full mb-2">
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
            <button onClick={onSubmitForm} className="btn">
              Submit
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

      <div className="buttomNavBar w-full  sticky bottom-0 pb-4 ">
        <BottumNavigation />
      </div>
    </div>
  );
}

export default AddGroup;
