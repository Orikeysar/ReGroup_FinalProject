import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { RxCounterClockwiseClock } from "react-icons/rx";
import { RiGroup2Fill } from "react-icons/ri";
import { TbFriends } from "react-icons/tb";
import { GiBookmarklet,GiConversation } from "react-icons/gi";

function BottumNavBar() {
  const [value, setValue] = React.useState("recents");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleFriendNavButton=()=>{

console.log('Friends list clicked!')
  }

  const handleGroupsNavButton=()=>{

    console.log('Groups list clicked!')

  }

  const handleForumNavButton=()=>{

    console.log('Forum list clicked!')

  }

  const handleCoursesNavButton=()=>{


    console.log('courses list clicked!')
  }

  const handleRecentNavButton=()=>{

    console.log('recent list clicked!')

  }
  return (
  <div className="buttomNavBarIcon">
    <BottomNavigation
    
      sx={{ width: "fixed" ,size:"large"}}
      value={value}
      onChange={handleChange}
    >
      
      <BottomNavigationAction
        label="Recents"
        value="recents"
        icon={<RxCounterClockwiseClock />}
        onClick={handleRecentNavButton}
      />
      <BottomNavigationAction
        label="Courses"
        value="courses"
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
        label="Friends"
        value="friends"
        icon={<TbFriends />}
        onClick={handleFriendNavButton}
      />
    </BottomNavigation></div>
  );
}

export default BottumNavBar;
