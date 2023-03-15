import React from "react";
import { useState, useEffect } from "react";
import { RiGroup2Fill } from "react-icons/ri";
import { db } from "../FirebaseSDK";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NavBar from "../Coponents/NavBar";
import BottumNavigation from "../Coponents/BottumNavBar";
import Map from "../Coponents/Map";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import {
  onSnapshot,
  collection,
  query,
} from "firebase/firestore";

function FindGroups() {
  const navigate = useNavigate();

  const [activeUser, setActiveUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    return user;
  });
  //משיכה של הדאטה בזמן אמת
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
  //איתחול ראשוני של החירות בפועל
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
  useEffect(() => {
    const filterMarkers = () => {
      let newFilter = activeGroups;
      console.log(newFilter);
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

      console.log(newFilter);
      setFilteredGroups(newFilter);
    };

    if (
      selectedCourse !== null ||
      selectedSubjects !== null ||
      selectedNumber !== null
    ) {
      filterMarkers();
    }else {
        setFilteredGroups(activeGroups);
      }
  }, [activeGroups, selectedCourse, selectedNumber, selectedSubjects]);
  
  return (
    <div className="container">
      {/* //TOP NAVBAR */}
      <div className="topNavBar w-full mb-2">
        <NavBar />
      </div>
      <div className=" flex items-center space-x-2 justify-center text-base align-middle mb-5">
        {" "}
        <RiGroup2Fill size={30} className=" mr-2 w-max " />
        <p className=" font-bold text-xl">Find Groups</p>
      </div>
      <div className=" flex justify-center mb-2">
        <label className=" text-lg">here you can find groups or </label>&nbsp;
        <label
          onClick={() => navigate("/createGroups")}
          className=" font-bold text-lg hover:drop-shadow-xl underline"
        >
          Create new+
        </label>
      </div>
      <div className=" grid justify-center my-4">
        <Autocomplete
          onChange={handleCourseChange}
          id="free-solo-demo"
          freeSolo
          sx={{ width: 250 }}
          options={courses.map((option) => option.id)}
          renderInput={(params) => <TextField {...params} label="Course" />}
        />
        <Autocomplete
          className=" my-5"
          onChange={handleSubjectsChange}
          multiple
          id="tags-filled"
          options={subjectsOfCourses ? subjectsOfCourses : subjects}
          freeSolo
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={option}
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} label="Subjects" placeholder="Favorites" />
          )}
        />
        <Autocomplete
          onChange={handleNumberChange}
          id="free-solo-demo"
          freeSolo
          sx={{ width: 250 }}
          options={["2", "3", "4", "5"]}
          renderInput={(params) => <TextField {...params} label="Group size" />}
        />
      </div>
      <div className=" p-1 drop-shadow-xl">
        <Map filteredGroups={filteredGroups} isMarkerShown />
      </div>

      <div className="buttomNavBar w-full sticky bottom-0 pb-4">
        <BottumNavigation />
      </div>
    </div>
  );
}

export default FindGroups;
