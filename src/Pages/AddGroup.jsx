import React from "react";
import { useState, useEffect, useRef } from "react";
import { RiGroup2Fill } from "react-icons/ri";
import { getAuth } from "firebase/auth";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import { db } from "../FirebaseSDK";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { onSnapshot, collection, query } from "firebase/firestore";
import NavBar from "../Coponents/NavBar";
import BottumNavigation from "../Coponents/BottumNavBar";
import MyAddGroupMapComponent from "../Coponents/MyAddGroupMapComponent ";
import { Avatar } from "primereact/avatar";
import { uuidv4 } from "@firebase/util";
import JoinGroupCard from "../Coponents/JoinGroupCard";
import FillterGroups from "../Coponents/FillterGroups";
function AddGroup() {

  const navigate = useNavigate();
  const auth = getAuth();

  const [activeUser, setActiveUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    return user;
  });
  const [cordinates, setCordinates] = useState(null);
const [fillteredGroupShow,setFillteredGroupShow] = useState(false)
  const [newGroup, setNewGroup] = useState({
    address: "",
    groupTittle: "",
    groupImg: activeUser.userImg,
    groupTags: [],
    groupSize: 0,
    id: "",
    location: { lat: 0, lng: 0 },
    description: "",
    participants: [],
    isActive: false,
    timeStamp: "00:00",
  });

  // const [activeGroups, setActiveGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);

  const handleFillterGroups = (filteredGroups) => {
    setFilteredGroups(filteredGroups);
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

  //handle if user chose to join axiesting group.
  const HandleJoinGroupOnToast = (group) => {
    console.log("join:" + group);
  };
  //handle added
  const handleInviteFriendChange = (event, value) => {
    setNewGroup({
      ...newGroup,
      participants: [...value],
    });
  };

  const onSubmitForm = (e) => {
    //במידה ויש קבוצה דומה המשתמש יקבל התראה לפני פתיחת הקבוצה
    if (filteredGroups.length > 0) {

      if (window.confirm("We found "+filteredGroups.length+" active groups with same parameters. Do you want to look at the groups before create yours?") == true) {
       setFillteredGroupShow(true)
       alert("You can see the groups on the map as blue markers")
      } else {
        setFillteredGroupShow(false)
      }
    }

    
    // setNewGroup({
    //   ...newGroup,

    //   groupTittle: selectedCourse,
    //   groupTags: selectedSubjects,
    //   groupSize: selectedNumber,
    //   location: cordinates,
    //   isActive: true,
    // });
    // console.log(newGroup);
    //MAKE HERE THE FUNCTION THAT CREATE THE REAL GROUP
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
        <MyAddGroupMapComponent isMarkerShown setCordinates={setCordinates} filteredGroups={filteredGroups} fillteredGroupShow={fillteredGroupShow} />
      </div>

      <div className="buttomNavBar w-full  sticky bottom-0 pb-4 ">
        <BottumNavigation />
      </div>
    </div>
  );
}

export default AddGroup;
