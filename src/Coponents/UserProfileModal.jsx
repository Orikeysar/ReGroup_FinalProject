import { useState, useEffect } from "react";
import { doc, updateDoc, Timestamp, getDoc } from "firebase/firestore";
import { db } from "../FirebaseSDK";
import { Avatar } from "primereact/avatar";
import { toast } from "react-toastify";
import { async } from "@firebase/util";

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
  const now = new Date();
  //הוספת המשתמש לרשימה בדאטה
  const handleAddFriend = async () => {
    let newFriend = {
      email: user.email,
      id: user.userRef,
      name: user.name,
      timeStamp: Timestamp.fromDate(
        new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          now.getHours(),
          now.getMinutes()
        )
      ),
      userImg: user.userImg,
    };
    activeUser.friendsList.push(newFriend);
    console.log(activeUser.friendsList);
    await updateDoc(activeUserRef, {
      friendsList: activeUser.friendsList,
    })
      .then(() => {
        toast.success("congrats ! you and "+newFriend.name+" are new friends");
        localStorage.setItem("activeUser",JSON.stringify(activeUser))
      })
      .catch((error) => {
        toast.error("Bad Cardictionals details,try again");
        console.log(error);
      });
  };
//מחיקת המשתמש מהרשימה
  const handleRemoveFriend=async()=>{
    if (
      window.confirm(
        "Are you sure you want to remove "+user.name+" from the friends list?"
      ) === true
    ) {
      let newFriendsList = activeUser.friendsList.filter((item) => id !== item.id);
      activeUser.friendsList=newFriendsList;
      await updateDoc(activeUserRef, {
        friendsList: newFriendsList
      })
      .then(() => {
        toast.success("Done successfully");
        localStorage.setItem("activeUser",JSON.stringify(activeUser))

      })
      .catch((error) => {
        toast.error("Bad Cardictionals details,try again");
        console.log(error);
      });
    } 
    
    

  }

  return (
    <div className="grid grid-cols-6">
      <Avatar
        image={user.userImg}
        size="xlarge"
        shape="circle"
        className="justify-center flex-auto col-span-1"
      />
      <div className="col-span-3">
        <div className="text-xl font-bold">{user.name}</div>
        <div className="text-lg font-semibold">{user.email}</div>
        <div className="text-lg font-semibold">{user.degree}</div>
      </div>

      <div className="col-span-2">
        <div className="py-2">
          {user.userAchievements.map((item) => {
            <div>
              <Avatar
                image={item.achievementImg}
                size="md"
                shape="circle"
                className="justify-center flex-auto "
              />
              <label>{item.name}</label>
              <label>Rank: {item.activeLevel}</label>
            </div>;
          })}
        </div>
      </div>
      <div className=" ml-auto justify-end">
        {btnStatus?
        <button onClick={handleRemoveFriend} className="btn btn-sm  bg-red-600  ml-auto mt-3">
          Remove friend
        </button> 
        :
        <button onClick={handleAddFriend} className="btn btn-sm  ml-auto mt-3">
          Add friend
        </button>
        }
        
      </div>
    </div>
  );
}

export default UserProfileModal;
