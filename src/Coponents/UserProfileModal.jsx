import { useState, useEffect } from "react";
import { doc, updateDoc, Timestamp, getDoc } from "firebase/firestore";
import { db,onButtonClick } from "../FirebaseSDK";
import { Avatar } from "primereact/avatar";
import { toast } from "react-toastify";
import { uuidv4 } from "@firebase/util";
import Rating from '@mui/material/Rating';
import UpdateRecentActivities from "./UpdateRecentActivities";
import UserScoreCalculate from "./UserScoreCalculate";

function UserProfileModal({ id }) {
  
  const [activeUser, setActiveUser] = useState(
    JSON.parse(localStorage.getItem("activeUser"))
  );

  const [btnStatus, setBtnStatus] = useState(false);
  //בדיקה האם הם כבר חברים ושינוי הכפתור בהתאם
  const handleBtnStatus = () => {
    activeUser.friendsList.forEach((friend) => {
      if (friend.id === id) {
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
      console.log(data);
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
      id: user.userRef,
      name: user.name,
      timeStamp: now,
      userImg: user.userImg,
    };
    //שליחת הודעה למשתמש
    onButtonClick({ userId: user.userRef })
    .then(async(result) => {
      //מוסיף חבר
 activeUser.friendsList.push(newFriend);
    console.log(activeUser.friendsList);
    await updateDoc(activeUserRef, {
      friendsList: activeUser.friendsList,
    })
      .then(() => {
        toast.success(
          "congrats ! you and " + newFriend.name + " are new friends"
        );
        setBtnStatus(true)
        UpdateRecentActivities(newFriend,"friend",activeUser);
        let achiev=activeUser.userAchievements.filter(element=>element.name==="Community Member")
        let item=achiev[0];
        UserScoreCalculate(item,"friend",activeUser)
        localStorage.setItem("activeUser", JSON.stringify(activeUser));
      })
      .catch((error) => {
        toast.error("Bad Cardictionals details,try again");
        console.log(error);
      });
      // Handle successful function invocation
      console.log(result);
    })
    .catch((error) => {
      // Handle function invocation error
      console.error(error);
    });


   
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
        (item) => id !== item.id
      );
      activeUser.friendsList = newFriendsList;
      await updateDoc(activeUserRef, {
        friendsList: newFriendsList,
      })
        .then(() => {
          toast.success("Done successfully");
          setBtnStatus(false)
          localStorage.setItem("activeUser", JSON.stringify(activeUser));
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
      style={{width:90+"%", height:80+"%", borderRadius: 25}}
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
            disabled={id===activeUser.userRef?true:false}
          >
            Add friend
          </button>
        )}
      </div>
      </div>
      <div className=" mt-1">
        <div className="flex flex-wrap">
          {user.userAchievements.map((item) => (
            <div className="grid grid-cols-8 mt-1 p-2 rounded-lg shadow-md" key={uuidv4()}>
              <Avatar
                image={item.achievementImg}
                size="md"
                shape="circle"
                className="flex-auto col-span-1"
              />
              <label className="font-bold col-span-5 pt-1 pl-1">{item.name}</label>{" "}
              <label className="col-span-2 ml-5 pt-1"> <Rating readOnly  defaultValue={item.activeLevel} max={3} /></label>
            </div>
          ))}
        </div>
      </div>
      
    
    </div>
  );
}

export default UserProfileModal;
