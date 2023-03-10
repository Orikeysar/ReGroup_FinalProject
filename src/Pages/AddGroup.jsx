
import React from "react";
import { useState, useEffect } from "react";
import { RiGroup2Fill } from "react-icons/ri";
import { getAuth } from "firebase/auth";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import { db } from "../FirebaseSDK";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useMoveMarker from "../Hooks/useMoveMarker";
import {
  onSnapshot,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import NavBar from "../Coponents/NavBar";
import BottumNavigation from "../Coponents/BottumNavBar";
import MyAddGroupMapComponent from "../Coponents/MyAddGroupMapComponent ";
import { Description } from "@mui/icons-material";

function AddGroup() {
  const navigate=useNavigate()
  const auth = getAuth()
    const [activeUser, setActiveUser] = useState(() => {
        const user = JSON.parse(localStorage.getItem("activeUser"));
        return user;
      });
     
      const [selectedCourses, setSelectedCourses] = useState(null);
      const [cordinateMarker, setCordinateMarker] = useState([]);
      const [newGroup,setNewGroup] = useState({
        address:"",
        groupTittle: "",
        groupTags: [],
        groupSize: 0,
        managerRef:"",
        description: "",
        participants:[],
        isActive: false,
        time:'00:00',

      })
      const [time, setTime] = useState('10:00');
  

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
        event.preventDefault()
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
        event.preventDefault()
        setSelectedNumber(value);

      }
  //הפונקציה תופסת שינויים בשהמשתמש מכניס למשתנים 
      const onChange = (e) => {
        e.preventDefault()
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

     const onSubmitForm=(e)=>{
e.preventDefault()

      //במידה ויש קבוצה דומה המשתמש יקבל התראה לפני פתיחת הקבוצה
if(filteredGroups.length >0){

  let Msg = () => (
    filteredGroups.map((group,index)=>{
return(
<div key={index}>
  <div>
     <p>another Group with same categories as you created.</p> 
     
     <p>group name: {group.groupTittle}</p>
     <p>group subjects: {group.groupTags.map((tagName,tagindex)=>{<p class key={tagindex}>#{tagName}</p>})}</p>
     <p>group size: {group.groupSize}</p>
     <p>group participants: </p>
     </div>
      <button className="btn text-xs btn-xs mt-2 text-center">join group</button>
      <p className="text-center">--------------------------------<br/></p>
    </div>
)
    })
    
  )
  toast(<Msg />) 


}
      setNewGroup({ ...newGroup,
        address:"",
        groupTittle: selectedCourse,
        groupTags:selectedSubjects,
        groupSize: selectedNumber,
        managerRef:auth.currentUser.uid,
        isActive: false,
       

      })
      console.log(newGroup);
// let [coordinates, setDestination] = useMoveMarker([
//           position.lat,
//           position.lng,
//         ]);
        
      }
      return (
        <div className="container">
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
            <label className=" text-lg">here you can go back to find groups</label>&nbsp;
            <label onClick={()=>navigate("/findGroups")} className=" font-bold text-lg hover:drop-shadow-xl underline">Find Group</label>
          </div>
          <div  className=" grid justify-center my-4">
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
      

  {/* //time picker */}
  <div className="flex row-auto mt-2 ">  
        <p className="mr-2">Time of Arival:</p>
        <input type={"time"} id="time" onChange={onChange} className="border rounded-lg"></input> 
      </div>  
{/* //description */}
<textarea id="discription" className="textarea textarea-primary textarea-bordered w-5/6 items-center mt-2"onChange={onChange} placeholder="Write your group discription"></textarea>
{/* //submit button */}
<div></div>
<button onClick={onSubmitForm} className="btn">Submit</button>

</div>


          <div className="map p-1 drop-shadow-xl">
             <MyAddGroupMapComponent isMarkerShown />
          </div>
         
          <div className="buttomNavBar w-full  sticky bottom-0 pb-4 ">
            <BottumNavigation />
          </div>
        </div>
      );
}

export default AddGroup