import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { OrderList } from "primereact/orderlist";
import { Avatar } from "primereact/avatar";
import { Dialog } from "primereact/dialog";
import UserProfileModal from "../UserProfileComponents/UserProfileModal";
import { db } from "../../FirebaseSDK";
import {
  doc,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
function FriendsListCard() {
  const navigate = useNavigate();
  //array for frinds
  const [friends, setFriends] = useState([]);

  const [activeUser, setactiveUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    return user;
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "users", activeUser.userRef), (doc) => {
      let data = doc.data();
      setactiveUser(data);
      setFriends(data.friendsList);
      localStorage.setItem("activeUser", JSON.stringify(data));
    });
  }, []);

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
                  <UserProfileModal id={selectedUserId} />
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
      <div className="rounded-xl flex items-center space-x-2 justify-center text-base align-middle mb-4 ">
        <img
          className=" w-10 h-10 rounded-full "
          src="https://firebasestorage.googleapis.com/v0/b/regroup-a4654.appspot.com/o/images%2Fpeople.png?alt=media&token=9b1c3358-d184-4397-89d8-5898044a3556"
          alt="Users Recored"
        />{" "}
        <p className=" font-bold text-xl">Friend List</p>
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
