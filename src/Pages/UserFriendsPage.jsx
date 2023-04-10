import React from "react";
import NavBar from "../Coponents/navbars/NavBar";
import FriendsListCard from "../Coponents/FriendsListCard";
import CreateGroupButton from "../Coponents/GroupsComponents/CreateGroupButton";
import FriendRequestCard from "../Coponents/FriendRequestCard";
function UserFriendsPage() {





  
  return (
    <div>
      <div className="topNavBar w-full mb-24">
        <NavBar />
      </div>
<div className="flex justify-start m-2">
<button className="btn btn-xs text-xm rounded-xl text-slate-950 bg-slate-200 m-2">request</button>
<button className="btn btn-xs text-xm rounded-xl text-slate-950 bg-slate-200 m-2">your friend</button>

</div>


<div className="mt-2"><FriendRequestCard/></div>


<CreateGroupButton/>
    </div>
  );
}

export default UserFriendsPage;
