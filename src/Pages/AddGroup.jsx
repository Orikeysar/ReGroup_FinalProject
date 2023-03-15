import React from "react";
import { useState, useEffect,useRef } from "react";
import { RiGroup2Fill } from "react-icons/ri";
import { getAuth } from "firebase/auth";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import { db } from "../FirebaseSDK";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  onSnapshot,
  collection,
  query,
} from "firebase/firestore";
import NavBar from "../Coponents/NavBar";
import BottumNavigation from "../Coponents/BottumNavBar";
import MyAddGroupMapComponent from "../Coponents/MyAddGroupMapComponent ";
import { Avatar } from "primereact/avatar";
import { uuidv4 } from "@firebase/util";
function AddGroup() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const date = new Date();
  const navigate = useNavigate();
  const auth = getAuth();
  
  const [activeUser, setActiveUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    return user;
  });
const [cordinates,setCordinates] = useState(null)

  const [newGroup, setNewGroup] = useState({
    address: "",
    groupTittle: "",
    groupImg: activeUser.userImg,
    groupTags: [],
    groupSize: 0,
    id: "",
    location:{lat:0 , lng: 0},
    description: "",
    participants: [],
    isActive: false,
    timeStamp: "00:00",
  });


  const [activeGroups, setActiveGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);

  const colRef = collection(db, "activeGroups");
  const q = query(colRef);

  onSnapshot(q, (snapshot) => {
    let newActiveGroups = [];
    snapshot.docs.forEach((doc, index) => {
      newActiveGroups.push({ ...doc.data(), id: doc.id, index });
    });
    if (JSON.stringify(newActiveGroups) !== JSON.stringify(activeGroups)) {
      setActiveGroups(newActiveGroups);
      setFilteredGroups(newActiveGroups);
    }
  });

  const [courses, setCourses] = useState(
    JSON.parse(localStorage.getItem("courses"))
  );
  const [subjects, setSubjects] = useState(() => {
    let newListSubjects = [];
    courses.map((item) => {
      for (let index = 0; index < item.subjects.length; index++) {
        newListSubjects.push(item.subjects[index]);
      }
    });
    return newListSubjects;
  });
  //המשתנה הזה מכיל את כל הנושאים השייכים לקורס שהמשתמש בחר
  const [subjectsOfCourses, setSubjectsOfCourses] = useState(null);
  //איתחול ראשוני של הבחירות בפועל
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState(null);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const handleCourseChange = (event, value) => {
 
    setSelectedCourse(value);

    if (value) {
      courses.forEach((element) => {
        if (element.id === value) {
          setSubjectsOfCourses(element.subjects);
        }
      });
    } else {
      setSubjectsOfCourses(null);
    }
  };

  const handleSubjectsChange = (event, value) => {
    setSelectedSubjects(value);
  };
  const handleNumberChange = (event, value) => {
 
    setSelectedNumber(value);
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
  //כל סינון הפונקציה תבצע בדיקה איזה קבוצות קיימות מתאימות יש
  useEffect(() => {
    const filterMarkers = () => {
      let newFilter = activeGroups;
  
      if (selectedCourse) {
        newFilter = newFilter.filter(
          (group) => group.groupTittle === selectedCourse
        );
      }
      if (selectedSubjects && selectedSubjects.length > 0) {
        newFilter = newFilter.filter((group) =>
          selectedSubjects.some((item) => group.groupTags.includes(item))
        );
      }
      if (selectedNumber) {
        newFilter = newFilter.filter(
          (group) => group.groupSize <= parseInt(selectedNumber)
        );
      }

    
      setFilteredGroups(newFilter);
    };

    if (
      selectedCourse !== null ||
      selectedSubjects !== null ||
      selectedNumber !== null
    ) {
      filterMarkers();
    } else {
      setFilteredGroups(activeGroups);
    }
  }, [activeGroups, selectedCourse, selectedNumber, selectedSubjects]);

//handle if user chose to join axiesting group.
 const HandleJoinGroupOnToast=(group)=>{
  
console.log('join:'+group)

 }
//handle added
 const  handleInviteFriendChange = (event, value) => {
  setNewGroup({
    ...newGroup,
    participants: [...value]
   
  });
  

  
};


  const onSubmitForm = (e) => {
  

    //במידה ויש קבוצה דומה המשתמש יקבל התראה לפני פתיחת הקבוצה
    if (filteredGroups.length > 0) {
      let Msg = () =>
        filteredGroups.map((group, index) => {
          return (
            // <div key={index}>
            //   <div>
            //     <p className="underline font-bold">another Group with same categories as you created.</p>

            //     <p>group name: {group.groupTittle}</p>
            //     <p>
            //       group subjects:{" "}
            //       {group.groupTags.map((tagName, tagindex) => {
            //         <p class key={tagindex}>
            //           #{tagName}
            //         </p>;
            //       })}
            //     </p>
            //     <p>group size: {group.groupSize}</p>
            //     <p>group participants: </p>
            //   </div>
            //   <button key={index} onClick={HandleJoinGroupOnToast(group)} className="btn text-xs btn-xs mt-2 text-center">
            //     join {group.groupTittle} group
            //   </button>
            //   <p className="text-center">
            //     --------------------------------------------
            //     <br />
            //   </p>
            // </div>
            <div className=" w-auto h-46 m-2" key={group.id}>
            <p className=" flex mt-1 justify-end ">
              start at {handleGroupTime(group.timeStamp.nanoseconds)}
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
                <p className="ml-3 mt-1 justify-center font-bold text-xl">
                  {group.groupTittle}{" "}
                </p>
                <p className="ml-3 mt-1 justify-center  text-lg">
                  {group.groupTags
                    .map((sub, index) => {
                      // Check if this is the last item in the array
                      const isLast =
                        index === group.groupTags.length - 1;
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
              <div>
                {handleGroupParticipants(group.participants)}
              </div>
              <div className=" ml-auto justify-end">
                <button
                  onClick={HandleJoinGroupOnToast(group)}
                  className="btn btn-xs  ml-auto mt-1"
                >
                  Join
                </button>
              </div>
            </div>
          </div>
          );
          
        });
        console.log(Msg)
      toast(<Msg />, {
        draggable: false,
        autoClose: false,
        closeOnClick: false
      });
    }
    setNewGroup({
      ...newGroup,
     
      groupTittle: selectedCourse,
      groupTags: selectedSubjects,
      groupSize: selectedNumber,
      location: cordinates,
      isActive: true,
    });
    console.log(newGroup);
    //MAKE HERE THE FUNCTION THAT CREATE THE REAL GROUP

  };
  const handleGroupTime = (timeStamp) => {
    let hours = date.getHours(new Date(timeStamp / 1000000));
    let minutes = date.getMinutes(new Date(timeStamp / 1000000));
    console.log(hours);
    console.log(minutes);
    if (hours > date.getHours()) {
      return "<Circle/>";
    }
    if (hours === date.getHours() && minutes > date.getMinutes()) {
      return "<Circle/>";
    }
    return hours + ":" + minutes;
  };
  const handleDropdownClick = () => {
    setShowDropdown(!showDropdown);
  };
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
                  onClick={() => console.log("user click")}
                >
                  <Avatar image={user.userImg} size="large" shape="circle" />
                  <label className=" text-md font-bold">{user.name}</label>
                </li>
              );
            })}
            ,
          </ul>
        )}
      </div>
    );
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
        <div className="self-center justify-center">
        {/* //Courses picker */}
        <Autocomplete
        className="  mt-4"
          onChange={handleCourseChange}
          id="free-solo-demo"
          freeSolo
          sx={{ width: 250 }}
          options={courses.map((option) => option.id)}
          renderInput={(params) => <TextField {...params} label="Course" />}
          
        />
        {/* //Subject picker */}
        <Autocomplete
          className="  mt-4 max-w-5/6 mx-2  "
          onChange={handleSubjectsChange}
          multiple
          id="tags-filled"
          options={subjectsOfCourses ? subjectsOfCourses : subjects}
          freeSolo
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
              className=" max-w-5/6 "
                variant="outlined"
                label={option}
                {...getTagProps({index})}
              />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} label="Subjects" placeholder="Favorites" />
          )}
        />
        {/* //Group size piker */}
        <Autocomplete
        className="  mt-4"
          onChange={handleNumberChange}
          id="free-solo-demo"
          freeSolo
          sx={{ width: 250 }}
          options={["2", "3", "4", "5"]}
          renderInput={(params) => <TextField {...params} label="Group size" />}
        />

  {/* //address description */}
        <div>
          <input type='text' className="flex row-auto  mt-4 w-full border border-gray-400 rounded-md min-h-12 text-center" id='address' placeholder="write your adress discription"   onChange={onChange}/>
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
        <div >
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
                {...getTagProps({index})}
              />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} label="Invite Friends" placeholder="you can add more then one" />
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
        <MyAddGroupMapComponent isMarkerShown setCordinates={setCordinates} />
      </div>

      <div className="buttomNavBar w-full  sticky bottom-0 pb-4 ">
        <BottumNavigation />
      </div>
    </div>
  );
}

export default AddGroup;
