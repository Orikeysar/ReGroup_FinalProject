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
  collection,
  query,
  orderBy
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Spinner from "../GeneralComponents/Spinner";


 function FriendsListCard() {
  const navigate = useNavigate();
  //array for frinds
  const [isLoaded, setIsLoaded] = useState(true);
  const [friends, setFriends] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [activeUser, setactiveUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    return user;
  }); 
   const [btnColorAllFriends, setBtnColorAllFriends] = useState(
    "btn m-2 text-sm  text-black glass shadow-md"
  );
  const [btnColorMyFriends, setBtnColorMyFriends] = useState(
    "btn m-2 text-sm shadow-md"
  );
  const [type, setType] = useState("MyFriends");



  
  
  useEffect(() => {

    const colUserRef = collection(db, "users");
  const q = query(colUserRef, orderBy("name","desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newlist = [];
      snapshot.docs.forEach((doc, index) => {
        newlist.push({ ...doc.data(), userRef: doc.id, index });
      });
      setAllUsers(newlist);
      setIsLoaded(false);
    });
  
    return unsubscribe;
  }, []);

  
  useEffect(() => {
    setFriends(activeUser.friendsList);   
    const unsubFriends = onSnapshot(doc(db, "users", activeUser.userRef), (doc) => {
      let data = doc.data();
      setactiveUser(data);
      setFriends(data.friendsList);
      localStorage.setItem("activeUser", JSON.stringify(data));
    });
  }, []);

  //אחראי על המודל של המשתמש לאחר לחיצה
  const [visible, setVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleUserClick = (id) => {
    setSelectedUserId(id);
    setVisible(true);
  };

  
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

  //משנה את הצבע בחירה ומעביר אותך למערך הרלוונטי
  const handleClickAllFriends = () => {
    setBtnColorMyFriends("btn m-2 text-sm glass text-black shadow-md");
    setBtnColorAllFriends("btn m-2 shadow-md");
    setType("AllFriends");
  };
  const handleClickMyFriends = () => {
    setBtnColorMyFriends("btn m-2 shadow-md");
    setBtnColorAllFriends("btn m-2 text-sm glass text-black shadow-md");
    setType("MyFriends");
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
        <tr>
          <td>
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
          </td>
          </tr>
        )}
      </div>
    );
  };


 if (isLoaded) {
      return (<div><Spinner/></div>)
    }else{
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
        <div>
        <div className="flex justify-center m-2">
          <button onClick={handleClickAllFriends} className={btnColorAllFriends}>
          All Users
          </button>
          <button onClick={handleClickMyFriends} className={btnColorMyFriends}>
          My Friends
          </button>
        </div>
        
        </div>
        <OrderList
        className="my-orderlist"
          value={type === "MyFriends"?(friends):(allUsers)}
          onChange={(e) => setFriends(e.value)}
          itemTemplate={itemTemplate}
          filter
          filterBy="name"
        ></OrderList>
      </div>
    </div>
  );}
}

export default FriendsListCard;
