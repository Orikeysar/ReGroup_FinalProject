import React from "react";
import { useState, useEffect } from "react";
import { db } from "../FirebaseSDK";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import {
  onSnapshot,
  collection,
  query,
} from "firebase/firestore";

function FillterGroups({handleFillterGroups}) {
  const [activeUser, setActiveUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    return user;
  });
  //סהכ כמה קבוצות יש 
  const [totalGroupsCount, setTotalGroupsCount] = useState(0);
  //משיכת הקבוצות הפעילות מהדאטה בזמן אמת והכנסה לערך
  const [activeGroups, setActiveGroups] = useState([]);
  const colRef = collection(db, "activeGroups");
  const q = query(colRef);


  onSnapshot(q, (snapshot) => {
    let newActiveGroups = [];
    snapshot.docs.forEach((doc, index) => {
      newActiveGroups.push({ ...doc.data(), id: doc.id, index });
    });
    if (JSON.stringify(newActiveGroups) !== JSON.stringify(activeGroups)) {
      setActiveGroups(newActiveGroups);
      handleFillterGroups(newActiveGroups);
      setTotalGroupsCount(newActiveGroups.length)
    }
  });
//משיכת הקורסים שיש מהלוקאל
  const [courses, setCourses] = useState(
    JSON.parse(localStorage.getItem("courses"))
  );
//יצירת מערך של הנושאים בכל הקורסים
  const [subjects, setSubjects] = useState(() => {
    let newListSubjects = [];
    courses.map((item) => {
      for (let index = 0; index < item.subjects.length; index++) {
        newListSubjects.push(item.subjects[index]);
      }
    });
    return newListSubjects;
  });

  //איתחול ראשוני של בחירות בפועל
  const [subjectsOfCourses, setSubjectsOfCourses] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState(null);
  const [selectedNumber, setSelectedNumber] = useState(null);
  //בעת בחירת קורס - הכנסתו לבחירה ויצירת מערך שיראה רק את הנושאים הקשורים לאותו הקורס
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
//בחירת הנושאים
  const handleSubjectsChange = (event, value) => {
    setSelectedSubjects(value);
  };
  //בחירת גודל הקבוצה
  const handleNumberChange = (event, value) => {
    setSelectedNumber(value);
  };
  //יצירת המערך המעודכן של הקבוצות המסוננות לשליחה למפה ליצירת מארקרים
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
      handleFillterGroups(newFilter);
      setTotalGroupsCount(newFilter.length)
    };

    if (
      selectedCourse !== null ||
      selectedSubjects !== null ||
      selectedNumber !== null
    ) {
      filterMarkers();
    }else {
      handleFillterGroups(activeGroups);
      setTotalGroupsCount(activeGroups.length)

      }
  }, [activeGroups, selectedCourse, selectedNumber, selectedSubjects]);
  
  return (
    <div className=" grid justify-center my-4">
        <Autocomplete
          onChange={handleCourseChange}
          id="free-solo-demo"
          freeSolo
          sx={{ width: 250, marginTop:5 }}
          options={courses.map((option) => option.id)}
          renderInput={(params) => <TextField {...params} label="Course" />}
        />
        <Autocomplete
          className=" my-5"
          onChange={handleSubjectsChange}
          multiple
          sx={{ width: 250, marginTop:5 }}
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
          sx={{ width: 250, marginTop:2 }}
          options={["2", "3", "4", "5"]}
          renderInput={(params) => <TextField {...params} label="Group size" />}
        />
        <div className="  my-5">
          <label className=" text-xl font-bold">Total number of active groups: {totalGroupsCount} </label>
        </div>
      </div>
  )
}

export default FillterGroups