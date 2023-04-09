import React from "react";
import NavBar from "../Coponents/NavBar";
import FriendsListCard from "../Coponents/FriendsListCard";
import CreateGroupButton from "../Coponents/CreateGroupButton";
function UserFriendsPage() {
  return (
    <div>
      <div className="topNavBar w-full mb-2">
        <NavBar />
      </div>
<div><FriendsListCard/></div>
<CreateGroupButton/>
    </div>
  );
}

export default UserFriendsPage;
