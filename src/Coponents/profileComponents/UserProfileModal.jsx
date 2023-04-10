import { useState, useEffect } from "react";
import { doc, updateDoc, Timestamp, getDoc } from "firebase/firestore";
import { db } from "../../FirebaseSDK";
import { Avatar } from "primereact/avatar";
import { toast } from "react-toastify";
import { uuidv4 } from "@firebase/util";
import Rating from "@mui/material/Rating";
import UpdateRecentActivities from "../UpdateRecentActivities";
import UserScoreCalculate from "../UserScoreCalculate";
import { saveMessagingDeviceToken } from "../../messaging";
import { onButtonClick } from "../../FirebaseSDK";
function UserProfileModal({ id }) {
  const [activeUser, setActiveUser] = useState(
    JSON.parse(localStorage.getItem("activeUser"))
  );

  const [btnStatus, setBtnStatus] = useState(false);
  //בדיקה האם הם כבר חברים ושינוי הכפתור בהתאם
  const handleBtnStatus = () => {
    activeUser.friendsList.forEach((friend) => {
      if (friend.userRef === id) {
        setBtnStatus(true);
      }
    });
  };
  //משיכת המשתמש מהדאטה

  const [user, setUser] = useState(null);
  const userRef = doc(db, "users", id);
  const activeUserRef = doc(db, "users", activeUser.userRef);

  const fetchUser = async () => {
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setUser(data);
    }
  };
  useEffect(() => {
    handleBtnStatus();
  }, []);
  if (!user) {
    fetchUser();
    return null;
  }

  //בשביל התאריך בהרשמה כחבר

  //הוספת המשתמש לרשימה בדאטה
  const handleAddFriend = async () => {
    let now = Timestamp.now();
    let newFriend = {
      email: user.email,
      userRef: user.userRef,
      name: user.name,
      timeStamp: now,
      userImg: user.userImg,
    };

    let friendExists = false;
    for (let i = 0; i < activeUser.friendsListToAccept.length; i++) {
      if (activeUser.friendsListToAccept[i].userRef === newFriend.userRef) {
        friendExists = true;
        break;
      }
    }

    if (friendExists) {
      toast.error(`${newFriend.name} already get your request`);
    } else {
      //שולח הודעה למשתמש שיש לו בקשה ממתינה
      saveMessagingDeviceToken(activeUser.userRef);
      const docRef = doc(db, "fcmTokens", id);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
      const token = data.fcmToken;
      onButtonClick(token);
      //שליחה סיום
      //הכנסת משתמש לרשימה שמחכה לאישור או דחיה אצל המשתמש המחובר
      activeUser.friendsWaitingToAcceptByAnotherUser.push(newFriend);
      //הכנסת משתמש לרשימה שמחכה לאישור או דחיה אצל המשתמש שנשלחה לו הבקשה(לא המחובר) ר
      user.friendsListToAccept.push(newFriend);

      //מכניס את הכבר לרשימת ההמתנה של המשתמש המחובר
      await updateDoc(activeUserRef, {
        friendsWaitingToAcceptByAnotherUser:
          activeUser.friendsWaitingToAcceptByAnotherUser,
      })
        .then(async () => {
          console.log(activeUser.friendsWaitingToAcceptByAnotherUser);
          //מכניס לרשימת המתנה של החבר ששלחו לו את ההזמנה
          await updateDoc(userRef, {
            friendsListToAccept: user.friendsListToAccept,
          }).then(() => {
            toast.success(
              "congrats ! you send " + newFriend.name + " friend requst"
            );
            // setBtnStatus(true)
            UpdateRecentActivities(newFriend, "friend", activeUser);
            let achiev = activeUser.userAchievements.filter(
              (element) => element.name === "Community Member"
            );
            let item = achiev[0];
            UserScoreCalculate(item, "friend", activeUser);
            localStorage.setItem("activeUser", JSON.stringify(activeUser));
          });
        })
        .catch((error) => {
          toast.error("Bad Cardictionals details,try again");
          console.log(error);
        });

      console.log(`Added ${newFriend.name} to the friendsListToAccept array`);
    }
  };
  //מחיקת המשתמש מהרשימה
  const handleRemoveFriend = async () => {
    if (
      window.confirm(
        "Are you sure you want to remove " +
          user.name +
          " from the friends list?"
      ) === true
    ) {
      let newFriendsList = activeUser.friendsList.filter(
        (item) => id !== item.userRef
      );
      activeUser.friendsList = newFriendsList;
      await updateDoc(activeUserRef, {
        friendsList: newFriendsList,
      })
        .then(async () => {
          let newUserFriendsList = activeUser.friendsList.filter(
            (item) => activeUser.userRef !== item.userRef
          );
          user.friendsList = newFriendsList;
          await updateDoc(userRef, {
            friendsList: user.friendsList,
          }).then(() => {
            toast.success("Done successfully");
            setBtnStatus(false);
            localStorage.setItem("activeUser", JSON.stringify(activeUser));
          });
        })
        .catch((error) => {
          toast.error("Bad Cardictionals details,try again");
          console.log(error);
        });
    }
  };

  return (
    <div>
      <div className="grid grid-cols-5 pt-3 ">
        <img
          style={{ width: 90 + "%", height: 80 + "%", borderRadius: 25 }}
          src={user.userImg}
          className="justify-center flex-auto col-span-1 mt-3"
        />
        <div className="col-span-3 mt-1">
          <div className="text-xl font-bold">{user.name}</div>
          <div className="text-lg font-semibold">{user.email}</div>
          <div className="text-lg font-semibold">{user.degree}</div>
        </div>
        <div className=" ml-auto justify-end col-span-1 mt-4">
          {btnStatus ? (
            <button
              onClick={handleRemoveFriend}
              className="btn btn-sm  bg-red-600  ml-auto mt-3"
            >
              Remove friend
            </button>
          ) : (
            <button
              onClick={handleAddFriend}
              className="btn btn-sm  ml-auto mt-3"
              disabled={id === activeUser.userRef ? true : false}
            >
              send request
            </button>
          )}
        </div>
      </div>
      <div className=" mt-1">
        <div className="flex flex-wrap">
          {user.userAchievements.map((item) => (
            <div
              className="grid grid-cols-8 mt-1 p-2 rounded-lg shadow-md"
              key={uuidv4()}
            >
              <Avatar
                image={item.achievementImg}
                size="md"
                shape="circle"
                className="flex-auto col-span-1"
              />
              <label className="font-bold col-span-5 pt-1 pl-1">
                {item.name}
              </label>{" "}
              <label className="col-span-2 ml-5 pt-1">
                {" "}
                <Rating readOnly defaultValue={item.activeLevel} max={3} />
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserProfileModal;
