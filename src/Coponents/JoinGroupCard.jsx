import React from "react";
import { useState, useEffect, useRef } from "react";
import { Avatar } from "primereact/avatar";
import { uuidv4 } from "@firebase/util";
function JoinGroupCard(group) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const date = new Date();

  const handleGroupTime = (timeStamp) => {
    let hours = date.getHours(new Date(timeStamp / 1000000));
    let minutes = date.getMinutes(new Date(timeStamp / 1000000));
    console.log(hours);
    console.log(minutes);
    if (hours > date.getHours()) {
      return "<Circle/>";
    }
    if (hours === date.getHours() && minutes > date.getMinutes()) {
      return "<Circle/>";
    }
    return hours + ":" + minutes;
  };
  const handleDropdownClick = () => {
    setShowDropdown(!showDropdown);
  };
  const handleGroupParticipants = (participants) => {
    return (
      <div className="dropdown">
        <label
          onClick={handleDropdownClick}
          tabIndex={0}
          className="btn btn-xs m-1"
        >
          participants
        </label>
        {showDropdown && (
          <ul
            ref={dropdownRef}
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            {participants.map((user) => {
              return (
                <li
                  key={uuidv4()}
                  className="flex flex-row"
                  onClick={() => console.log("user click")}
                >
                  <Avatar image={user.userImg} size="large" shape="circle" />
                  <label className=" text-md font-bold">{user.name}</label>
                </li>
              );
            })}
            ,
          </ul>
        )}
      </div>
    );
  };

  const HandleJoinGroupOnToast = (group) => {
    console.log("join:" + group);
  };

  return (
    <div className=" w-auto h-46 m-2" key={group.id}>
      <p className=" flex mt-1 justify-end ">
        start at {handleGroupTime(group.timeStamp)}
      </p>
      <div className=" flex flex-row">
        <div className=" ml-2">
          <Avatar image={group.groupImg} size="xlarge" shape="circle" />
        </div>
        <div>
          <p className="ml-3 mt-1 justify-center font-bold text-xl">
            {group.groupTittle}{" "}
          </p>
          <p className="ml-3 mt-1 justify-center  text-lg">
            {group.groupTags
              .map((sub, index) => {
                // Check if this is the last item in the array
                const isLast = index === group.groupTags.length - 1;
                // Append a "|" character if this is not the last item
                const separator = isLast ? "" : " | ";
                // Return the subject name with the separator character
                return sub + separator;
              })
              .join("")}{" "}
          </p>
        </div>
      </div>

      <div className=" ml-3 mt-3 text-lg">
        <p>{group.description}</p>
        {/* /* <p>time: {formatRelative(selectedMarker.time, new Date())}</p> */}
      </div>
      <div className="flex flex-row ml-3 mt-3">
        <div>{handleGroupParticipants(group.participants)}</div>
        <div className=" ml-auto justify-end">
          <button
            onClick={HandleJoinGroupOnToast(group)}
            className="btn btn-xs  ml-auto mt-1"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
}

export default JoinGroupCard;
