import React from "react";
import NavBar from "../Coponents/navbars/NavBar";
import FriendsListCard from "../Coponents/FriendsListCard";
import CreateGroupButton from "../Coponents/GroupsComponents/CreateGroupButton";
function UserFriendsPage() {
  return (
    <div>
      <div className="topNavBar w-full mb-24">
        <NavBar />
      </div>
<div className="mt-2"><FriendsListCard/></div>
<CreateGroupButton/>
    </div>
  );
}

export default UserFriendsPage;
