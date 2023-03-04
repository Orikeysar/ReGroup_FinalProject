import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { OrderList } from "primereact/orderlist";
import { TbFriends } from "react-icons/tb";
import { Avatar } from "primereact/avatar";
import { AutoComplete } from "primereact/autocomplete";

function FriendsListCard() {
  //array for frinds
  const [friends, setFriends] = useState([]);
  //array for search friend
  const [selectedNames, setSelectedNames] = useState(null);
  const [filteredNames, setFilteredNames] = useState(null);

  const [activeUser, setactiveUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    return user;
  });

  useEffect(() => {
    let NewFriendList = [];
    activeUser.friendsList.map((item) => {
      let date = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(item.timeStamp.seconds);
      item.timeStamp = date;
      return NewFriendList.push(item);
    });
    setFriends(NewFriendList);
  }, [activeUser.friendsList]);

  //when click on View froend profile
  const ClickViewProfile = (e) => {
    console.log(e.target.value);
  };

  //render card of friend
  const itemTemplate = (product) => {
    if (product === undefined) {
      return (
        <div>
          <p className="text-4xl">Cant find this friend!</p>
        </div>
      );
    }
    return (
      <div className="col-12 mt-4">
        <div className="grid grid-cols-4 gap-3 text-center ">
          <div className="flex-column">
            {" "}
            <Avatar image={product.userImg} size="large" shape="circle" />
          </div>

          <div className="flex-column align-middle sm:align-items-start gap-3">
            <div className="font-semibold align-middle">{product.name}</div>
          </div>
          <div className="flex-column align-items-center gap-3">
            <span className="flex align-items-center gap-2">
              <span className="font-semibold ">{product.timeStamp}</span>
            </span>
          </div>

          <div className="flex-column  sm:align-items-end gap-3 sm:gap-2">
            <Button
              className=" btn-xs border-gray-500 bg-gray-600 text-white  rounded-md mb-2"
              value={product.name}
              onClick={ClickViewProfile}
            >
              View
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="friendsList  mt-4 mb-4">
      <div className="friendsListHeader   mb-4 ">
        <div className="flex  items-center space-x-2 justify-center text-3xl align-middle ">
          <TbFriends className=" mr-2 w-max " />
          <p className=" font-bold text-lg">Friend List</p>
        </div>
      </div>

      <div className="card w-full justify-center">
        <OrderList
          value={friends}
          onChange={(e) => setFriends(e.value)}
          itemTemplate={itemTemplate}
          filter
          filterBy="name"
        ></OrderList>
      </div>
    </div>
  );
}

export default FriendsListCard;
