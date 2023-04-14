import React from "react";
import { useState } from "react";
import NavBar from "../Coponents/navbars/NavBar";
import FriendsListCard from "../Coponents/FriendsListCard";
import CreateGroupButton from "../Coponents/GroupsComponents/CreateGroupButton";
import FriendRequestCard from "../Coponents/FriendRequestCard";

function UserFriendsPage() {
  
  const [requestBtnClicked, setRequestBtnClicked] = useState(false);

  return (
    <div>
      <div className="topNavBar w-full mb-24">
        <NavBar />
      </div>
      <div className="flex justify-start m-2">
        <button
          className="btn btn-xs text-xm rounded-xl text-slate-950 bg-slate-200 m-2"
          onClick={() => {
            setRequestBtnClicked(true);
          }}
        >
          requests
        </button>
        <button
          className="btn btn-xs text-xm rounded-xl text-slate-950 bg-slate-200 m-2"
          onClick={() => {
            setRequestBtnClicked(false);
          }}
        >
          your friends
        </button>
      </div>

      <div className="mt-2">
        {requestBtnClicked ? <FriendRequestCard /> : <FriendsListCard />}
      </div>

      <CreateGroupButton />
    </div>
  );
}

export default UserFriendsPage;
