import * as React from "react";
import { useEffect,useState } from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { RxCounterClockwiseClock } from "react-icons/rx";
import { RiGroup2Fill } from "react-icons/ri";
import { TbFriends } from "react-icons/tb";
import { GiBookmarklet,GiConversation } from "react-icons/gi";
import { useNavigate} from "react-router-dom";
function BottumNavBar() {
  const [value, setValue] = useState(localStorage.getItem("componentChoosen"));
const navigate = useNavigate()

useEffect(() => {


  setValue(localStorage.getItem("componentChoosen"));

},[])





  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleFriendNavButton=()=>{
    
console.log('Friends list clicked!')
localStorage.setItem("componentChoosen", "FriendsList");
navigate("/")
  }

  const handleGroupsNavButton=()=>{

    console.log('Groups list clicked!')
    
  }

  const handleForumNavButton=()=>{
    
    console.log('Forum list clicked!')

  }

  const handleCoursesNavButton=()=>{
   
localStorage.setItem("componentChoosen", "CoursesList");
    console.log('courses list clicked!')
    navigate("/")
  }

  const handleRecentNavButton=()=>{
   
    localStorage.setItem("componentChoosen", "RecentActivities");
    console.log('recent list clicked!')
    navigate("/")
  }
  return (
  <div className="buttomNavBarIcon">
    <BottomNavigation
    
      sx={{ width: "fixed" ,size:"large"}}
      value={value}
      onChange={handleChange}
    >
      
      <BottomNavigationAction
        label="RecentActivities"
        value="RecentActivities"
        icon={<RxCounterClockwiseClock />}
        onClick={handleRecentNavButton}
      />
      <BottomNavigationAction
        label="CoursesList"
        value="CoursesList"
        icon={<GiBookmarklet />}
        onClick={handleCoursesNavButton}
      />
      <BottomNavigationAction
        label="Forum"
        value="forum"
        icon={<GiConversation />}
        onClick={handleForumNavButton}
      />
      <BottomNavigationAction
        label="Groups"
        value="groups"
        icon={<RiGroup2Fill />}
        onClick={handleGroupsNavButton}
        
      />
      <BottomNavigationAction
        label="FriendsList"
        value="FriendsList"
        icon={<TbFriends />}
        onClick={handleFriendNavButton}
      />
    </BottomNavigation></div>
  );
}

export default BottumNavBar;
