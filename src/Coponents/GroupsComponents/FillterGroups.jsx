import React from "react";
import { useState, useEffect } from "react";
import { db } from "../../FirebaseSDK";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { uuidv4 } from "@firebase/util";
import Chip from "@mui/material/Chip";
import { onSnapshot, collection, query } from "firebase/firestore";
import { FaInfoCircle } from "react-icons/fa";
import { Modal, Box } from "@mui/material";

function FillterGroups({ handleFillterGroups ,page}) {
  const [activeUser, setActiveUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    return user;
  });
  //סהכ כמה קבוצות יש
  const [totalGroupsCount, setTotalGroupsCount] = useState(0);
  //כמה קבוצות ללא מקום פנוי
  const [availableGroups, setAvailableGroups] = useState([]);
  

  const handleAvailableGroups = (groups) => {
    if (groups.length > 0) {
      let available = groups.filter(
        (group) => group.participants.length != group.groupSize
      );
      setAvailableGroups(available.length);
    } else {
      setAvailableGroups(0);
    }
  };
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
      setTotalGroupsCount(newActiveGroups.length);
      handleAvailableGroups(newActiveGroups);
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
  const [selectedFriendChange, setSelectedfriendChange] = useState(null);
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
  const handleInviteFriendChange = (event, value) => {
    setSelectedfriendChange(value);
  };
  
  //יצירת המערך המעודכן של הקבוצות המסוננות לשליחה למפה ליצירת מארקרים
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
      if (selectedFriendChange) {
        newFilter = newFilter.filter((group) =>
  group.participants.find((p) => p.email === selectedFriendChange.email)
);
      }
      handleFillterGroups(
        newFilter,
        selectedCourse,
        selectedSubjects,
        selectedNumber,
        selectedFriendChange
      );
      setTotalGroupsCount(newFilter.length);
      handleAvailableGroups(newFilter);
    };

    if (
      selectedCourse !== null ||
      selectedSubjects !== null ||
      selectedNumber !== null ||
      selectedFriendChange !==null
    ) {
      filterMarkers();
    } else {
      handleFillterGroups(
        activeGroups,
        selectedCourse,
        selectedSubjects,
        selectedNumber,
        selectedFriendChange
      );
      setTotalGroupsCount(activeGroups.length);
      handleAvailableGroups(activeGroups);
    }
  }, [activeGroups, selectedCourse, selectedNumber, selectedSubjects,selectedFriendChange]);
//אחראי על המודל של המידע
const [isInfoModalOpen, setInfoIsModalOpen] = useState(false);
//אחראי על סטייל החלונות מידע
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
  return (
    <div className=" grid justify-center w-full mb-4 ">
      <div>
      <div className=" relative top-12 pb-1">
        <FaInfoCircle
          className="cursor-pointer text-gray-400 "
          onClick={() => setInfoIsModalOpen(true)}
        />
      </div>
        <Autocomplete
        onChange={handleCourseChange}
        className="pl-6 pr-6"
        id="free-solo-demo"
        freeSolo
        sx={{ width: "100%", marginTop: 2 }}
        options={courses.map((option) => option.id)}
        renderInput={(params) => <TextField {...params} label="Course" />}
      />
      </div>
      <div>
      <div className=" relative top-12 pb-1">
        <FaInfoCircle
          className="cursor-pointer text-gray-400 "
          onClick={() => setInfoIsModalOpen(true)}
        />
      </div>
      <Autocomplete
        className="pl-6 pr-6"
        onChange={handleSubjectsChange}
        multiple
        sx={{ width: "100%", marginTop: 2 }}
        id="tags-filled"
        options={subjectsOfCourses ? subjectsOfCourses : subjects}
        freeSolo
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              key={uuidv4()}
              variant="outlined"
              label={option}
              {...getTagProps(index)}
            />
          ))
        }
        renderInput={(params) => (
          <TextField {...params} label="Subjects" placeholder="Favorites" />
        )}
      />
      </div>
      <div>
      <div className=" relative top-12 pb-1">
        <FaInfoCircle
          className="cursor-pointer text-gray-400 "
          onClick={() => setInfoIsModalOpen(true)}
        />
      </div>
        <Autocomplete
        onChange={handleNumberChange}
        className="pl-6 pr-6"
        id="free-solo-demo"
        freeSolo
        sx={{ width: "100%", marginTop: 2 }}
        options={["2", "3", "4", "5"]}
        renderInput={(params) => <TextField {...params} label="Group max size" />}
      />
      </div>
      {page !== "create"?(

      <div>
      <div className=" relative top-12 pb-1">
        <FaInfoCircle
          className="cursor-pointer text-gray-400 "
          onClick={() => setInfoIsModalOpen(true)}
        />
      </div>
        
        <div>
            <Autocomplete
              className="pl-6 pr-6"
              onChange={handleInviteFriendChange}
              sx={{ width: "100%", marginTop: 2 }}
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
                  label="Find Friend Group"
                  placeholder="Find Friend Group and join"
                />
              )}
            />
          </div>
</div>

      ):(null)}
      
      
      <div className="  my-5 p-2 rounded-lg shadow-md">
        <label className=" text-lg ">Total active groups: </label>
        <label className=" text-xl font-bold"> {totalGroupsCount} </label>
        <label className=" text-lg ">| Available to join: </label>
        <label className=" text-xl font-bold"> {availableGroups} </label>
      </div>
      {isInfoModalOpen && (
        localStorage.getItem("componentChoosen")==="groups"?
        <Modal
        open={true}
        // once pop-up will close "closePopUp" function will be executed
        onClose={()=>setInfoIsModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={PopUpInfoStyle}>
          {/* what user will see in the modal is defined below */}
          <img src="https://firebasestorage.googleapis.com/v0/b/regroup-a4654.appspot.com/o/images%2Finformation.png?alt=media&token=486481aa-9f38-40b4-91a0-9c84c92b83bb" className=" flex rounded-2xl h-20 w-20 mb-2 mx-auto"/>
          <h1>You can filter your selections</h1>
          <p className="mt-2">
            <strong>Courses: </strong>
            <label >Shows you all the relevant groups for that course.</label>
          </p>
          <p className="mt-2">
            <strong>Subjects: </strong>
            <label >Shows you all the relevant groups for those topics.</label>
          </p>
          <p className="mt-2">
            <strong>Group Size: </strong>
            <label >Choosing the size of the group you want to participate in.</label>
          </p>
          <button className="mt-4" onClick={()=>setInfoIsModalOpen(false)}>
            OK
          </button>
        </Box>
      </Modal>
      :
      <Modal
        open={true}
        // once pop-up will close "closePopUp" function will be executed
        onClose={()=>setInfoIsModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={PopUpInfoStyle}>
          {/* what user will see in the modal is defined below */}
          <img src="https://firebasestorage.googleapis.com/v0/b/regroup-a4654.appspot.com/o/images%2Finformation.png?alt=media&token=486481aa-9f38-40b4-91a0-9c84c92b83bb" className=" flex rounded-2xl h-20 w-20 mb-2 mx-auto"/>
          <h1>You can filter your selections</h1>
          <p className="mt-2">
            <strong>Courses: </strong>
            <label >Choose the appropriate course as the main topic of the group.</label>
          </p>
          <p className="mt-2">
            <strong>Subjects: </strong>
            <label >Choose a topic or topics related to the material being studied.</label>
          </p>
          <p className="mt-2">
            <strong>Group Size: </strong>
            <label >Choosing the size of the group that suits you.</label>
          </p>
          <button className="mt-4" onClick={()=>setInfoIsModalOpen(false)}>
            OK
          </button>
        </Box>
      </Modal>
      )}
    </div>
  );
}

export default FillterGroups;
