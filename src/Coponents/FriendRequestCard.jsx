import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { OrderList } from "primereact/orderlist";
import { TbFriends } from "react-icons/tb";
import { Avatar } from "primereact/avatar";
import { Dialog } from "primereact/dialog";
import UserProfileModal from "./profileComponents/UserProfileModal";
import { doc, updateDoc, Timestamp, getDoc,collection,query, onSnapshot} from "firebase/firestore";
import { db } from "../FirebaseSDK";
import { toast } from "react-toastify";
function FriendRequestCard() {
  //array for frinds
  const [reaustFriends, setReaustFriends] = useState([]);
  const [anotherUser, setAnotherUser] = useState(null);
  const [activeUser, setactiveUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    return user;
  });



  const unsub= onSnapshot(doc(db, "users", activeUser.userRef), (doc) => {
   let data = doc.data()
    setactiveUser(data)
    setReaustFriends(data.friendsListToAccept)
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
    setReaustFriends(activeUser.friendsListToAccept);
  }, []);
  function deleteObjectById(objectList, id) {
    return objectList.filter((obj) => obj.userRef !== id);
  }
  //מושך את המשתמש המחובר מהדאטה

  const activeUserRef = doc(db, "users", activeUser.userRef);

  const handleUserAcceptClick = async (id) => {
    //מושך מהדאטה את המשתמש שאותו מאשרים או דוחים
    const anotherUserRef = doc(db, "users", id);
    const docSnap = await getDoc(anotherUserRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setAnotherUser(data);
      //אוביקט חדש של חבר
      let now = Timestamp.now();
      let newFriend = {
        email: anotherUser.email,
        userRef: anotherUser.userRef,
        name: anotherUser.name,
        timeStamp: now,
        userImg: anotherUser.userImg,
      };
      let activeUserFriend = {
        email: activeUser.email,
        userRef: activeUser.userRef,
        name: activeUser.name,
        timeStamp: now,
        userImg: activeUser.userImg,
      };
      let activeUserFriendRequestList = activeUser.friendsListToAccept;
      let anotherUserFriendRequestList = anotherUser.friendsWaitingToAcceptByAnotherUser;
      //  יצירת רשימות חדשות לפני דחיפה לדאטה
      activeUser.friendsListToAccept = deleteObjectById(
        activeUserFriendRequestList,
        id
      );
      activeUser.friendsList.push(newFriend);
      anotherUser.friendsWaitingToAcceptByAnotherUser = deleteObjectById(
        anotherUserFriendRequestList,
        activeUser.userRef
      );
      anotherUser.friendsList.push(activeUserFriend);
      //מכניס עדכון של המשתמש שאישר  את החברות
      await updateDoc(activeUserRef, {
        friendsList: activeUser.friendsList,
        friendsListToAccept: activeUser.friendsListToAccept,
      }).then(async () => {
        //מכניס עדכון של החבר שאישרו לו את החברות
        await updateDoc(anotherUserRef, {
          friendsList: anotherUser.friendsList,
          friendsWaitingToAcceptByAnotherUser:
            anotherUser.friendsWaitingToAcceptByAnotherUser,
        }).then(() => {





          localStorage.setItem("activeUser", JSON.stringify(activeUser));
          toast.success("you accept firend success");
          window.location.reload();
        });
      });
    } else {
    }
  };

  const handleUserDeleteClick = async (id) => {
    //מושך מהדאטה את המשתמש שאותו מאשרים או דוחים
    const anotherUserRef = doc(db, "users", id);
    const docSnap = await getDoc(anotherUserRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setAnotherUser(data);

      let activeUserFriendRequestList = activeUser.friendsListToAccept;
      let anotherUserFriendRequestList =
        anotherUser.friendsWaitingToAcceptByAnotherUser;
      //  יצירת רשימות חדשות לפני דחיפה לדאטה
      activeUser.friendsListToAccept = deleteObjectById(
        activeUserFriendRequestList,
        id
      );
      anotherUser.friendsWaitingToAcceptByAnotherUser = deleteObjectById(
        anotherUserFriendRequestList,
        id
      );

      //מכניס עדכון של המשתמש שאישר  את החברות
      await updateDoc(activeUserRef, {
        friendsListToAccept: activeUser.friendsListToAccept,
      }).then(async () => {
        //מכניס עדכון של החבר שאישרו לו את החברות
        await updateDoc(anotherUserRef, {
          friendsWaitingToAcceptByAnotherUser:
            anotherUser.friendsWaitingToAcceptByAnotherUser,
        }).then(() => {
          localStorage.setItem("activeUser", JSON.stringify(activeUser));
          toast.success("delete from request list success");
          window.location.reload();
        });
      });
    } else {
    }
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
        </div>
        <div className="flex justify-end">
          <div className=" m-2">
            <p
              className="btn btn-xs border-gray-500 bg-gray-600 text-white  rounded-md m-2"
              value={product.name}
              onClick={() => handleUserDeleteClick(product.userRef)}
            >
              Delete
            </p>
          </div>
          <div className="m-2 ">
            <p
              className=" btn btn-xs bg-blue-500 text-white  rounded-md m-2"
              value={product.name}
              onClick={() => handleUserAcceptClick(product.userRef)}
            >
              Accept
            </p>
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
          <p className=" font-bold text-lg">Friend request List</p>
        </div>
      </div>

      <div className="card w-full justify-center">
        <OrderList
          value={reaustFriends}
          onChange={(e) => setReaustFriends(e.value)}
          itemTemplate={itemTemplate}
        ></OrderList>
      </div>
    </div>
  );
}

export default FriendRequestCard;
