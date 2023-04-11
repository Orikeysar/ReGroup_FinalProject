import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { OrderList } from "primereact/orderlist";
import { TbFriends } from "react-icons/tb";
import { Avatar } from "primereact/avatar";
import { Dialog } from "primereact/dialog";
import UserProfileModal from "./profileComponents/UserProfileModal";
import { db } from "../FirebaseSDK";
import { doc, updateDoc, Timestamp, getDoc,collection,query, onSnapshot} from "firebase/firestore";

function FriendsListCard() {
  //array for frinds
  const [friends, setFriends] = useState([]);

  const [activeUser, setactiveUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    return user;
  });

  const unsub = onSnapshot(doc(db, "users", activeUser.userRef), (doc) => {
    let data = doc.data()
     setactiveUser(data)
     setFriends(data.friendsList)
     localStorage.setItem("activeUser", JSON.stringify(data));
     
 });


  const handleGroupTime = (timeStamp) => {
    if (timeStamp) {
      const firestoreTimestamp = new Timestamp(
        timeStamp.seconds,
        timeStamp.nanoseconds
      );
      const date = firestoreTimestamp.toDate();
      const day = date.getDate();
      const month = date.getMonth() + 1; // JavaScript months are 0-indexed
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const year = date.getFullYear();
      return `${day}/${month}/${year}, ${hours}:${minutes
        .toString()
        .padStart(2, "0")}`;
    }
  };

  useEffect(() => {
    setFriends(activeUser.friendsList);
  }, []);

  //אחראי על המודל של המשתמש לאחר לחיצה
  const [visible, setVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleUserClick = (id) => {
    setSelectedUserId(id);
    setVisible(true);
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
              <p></p>
              <span className="font-semibold ">
                {handleGroupTime(product.timeStamp)}
              </span>
            </span>
          </div>

          <div className="flex-column  sm:align-items-end gap-3 sm:gap-2">
            <Button
              className=" btn-xs border-gray-500 bg-gray-600 text-white  rounded-md mb-2"
              value={product.name}
              onClick={() => handleUserClick(product.userRef)}
            >
              View
            </Button>
          </div>
        </div>
        {visible && (
          <div>
            {/* המודל של המשתמש שנבחר */}
            <div className="card flex justify-content-center">
              <Dialog
                header="User profile"
                visible={visible}
                onHide={() => setVisible(false)}
                style={{ width: "50vw" }}
                breakpoints={{ "960px": "75vw", "641px": "100vw" }}
              >
                <div className="m-0">
                  {/* הפרטים של המשתמש */}
                  <UserProfileModal id={product.userRef} />
                </div>
              </Dialog>
            </div>
          </div>
        )}
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
