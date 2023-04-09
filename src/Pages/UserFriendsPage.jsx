import React from "react";
import NavBar from "../Coponents/NavBar";
import FriendsListCard from "../Coponents/FriendsListCard";
import CreateGroupButton from "../Coponents/CreateGroupButton";
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
