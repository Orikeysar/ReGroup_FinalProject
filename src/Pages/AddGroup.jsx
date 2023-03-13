
import React from "react";
import { useState, useEffect } from "react";
import { RiGroup2Fill } from "react-icons/ri";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../FirebaseSDK";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useMoveMarker from "../Hooks/useMoveMarker";

import NavBar from "../Coponents/NavBar";
import BottumNavigation from "../Coponents/BottumNavBar";

import MyAddGroupMapComponent from "../Coponents/MyAddGroupMapComponent ";

function AddGroup() {
  const navigate=useNavigate()
    const [activeUser, setActiveUser] = useState(() => {
        const user = JSON.parse(localStorage.getItem("activeUser"));
        return user;
      });
      const [courses, setCourses] = useState(
        JSON.parse(localStorage.getItem("courses"))
      );
      const [selectedCourses, setSelectedCourses] = useState(null);
      const [cordinateMarker, setCordinateMarker] = useState([]);
      const [newGroup,setNewGroup] = useState({
        course: "",
        subject: "",
        participants: "",
        manager:"",
discription: "",
time:'10:00',

      })
      const [time, setTime] = useState('10:00');
      const {course,subject,manager,participants,discription} = newGroup

      const handleChange = (newValue) => {  
        setTime(newValue);  
      };  
      const onChange = (e) => {
        setNewGroup((prevState) => ({
          ...prevState,
    
          //CHECK WHAT THE ID IN THE UNPUT THAT CHANGE AND INSERT USER INPUT
          //LIKE THIS YOU CAN MENAGE setText TOGETHER ON MANY TARGETS
          [e.target.id]: e.target.value,
         
        })); 
        console.log(`name: ${e.target.id}+ value :${e.target.value}`)
      };


     const onSubmitForm=()=>{

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
{/* //creat form div */}
<div className="form text-center">
  {/* //time picker */}
  <div className="flex row-auto mt-2 ">  
        <p className="mr-2">Time of Arival:</p>
        <input type={"time"} id="time" onChange={onChange} className="border rounded-lg"></input> 
      </div>  
{/* //description */}
<textarea id="discription" className="textarea textarea-primary textarea-bordered w-5/6 items-center mt-2"onChange={onChange} placeholder="Write your group discription"></textarea>
</div>
{/* //submit button */}
<div>
<button onSubmit={onSubmitForm} className="btn">Submit</button>

</div>


          <div className="map p-1 drop-shadow-xl">
             <MyAddGroupMapComponent isMarkerShown />
          </div>
         
          <div className="buttomNavBar w-full  sticky bottom-0 pb-4">
            <BottumNavigation />
          </div>
        </div>
      );
}

export default AddGroup