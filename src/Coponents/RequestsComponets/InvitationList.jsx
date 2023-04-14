import React from "react";
import { useState, useEffect } from "react";
import UserProfileModal from "../../Coponents/profileComponents/UserProfileModal";
import { db, alertGroupEdited } from "../../FirebaseSDK";
import {
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  collection,
  setDoc,
  query,
  getDocs,
  where,
} from "firebase/firestore";
import { toast } from "react-toastify";
import UserScoreCalculate from "../../Coponents/UserScoreCalculate";
import { uuidv4 } from "@firebase/util";
import GroupInvationsCard from "./GroupInvationsCard";
import { useNavigate } from "react-router-dom";
import { useFindMyGroups } from "../../Hooks/useFindMyGroups";
import Chip from "@mui/material/Chip";
import randomColor from "randomcolor";
import { Avatar } from "primereact/avatar";
import { Dialog } from "primereact/dialog";
function InvitationList({ invitationList }) {
  const navigate = useNavigate();

  const [activeUser, setActiveUser] = useState(() => {
    try {
      const active = JSON.parse(localStorage.getItem("activeUser"));
      return active;
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null; // or some default value
    }
  });
 //אחראי על המודל של המשתמש לאחר לחיצה
 const [visible, setVisible] = useState(false);
 const [selectedUserId, setSelectedUserId] = useState(null);

 const handleUserClick = (id) => {
   setSelectedUserId(id);
   setVisible(true);
 };

  //הפונקציה מוחקת את הבקשה של היוזר מהדאטה ומכניסה אותו כמשתתף לקבוצה
  const handleAccept = async (anotherUser) => {
    const updatedinvitationList = invitationList.filter(
      (item) => item.userRef !== anotherUser.userRef
    );
    invitationList = updatedinvitationList;
    activeUser.groupParticipantsToApproval = updatedinvitationList;
    localStorage.setItem("activeUser", JSON.stringify(activeUser));
    const docRef = doc(db, "users", activeUser.userRef);
    await updateDoc(docRef, {
      groupParticipantsToApproval: activeUser.groupParticipantsToApproval,
    });
    let updateUser = {
      email: activeUser.email,
      name: activeUser.name,
      userImg: activeUser.userImg,
      userRef: activeUser.userRef,
    };
    const docGroupRef = doc(db, "activeGroups", anotherUser.groupRef);
    const docGroupSnap = await getDoc(docGroupRef);
    if (docGroupSnap.exists()) {
      let data = docGroupSnap.data();
      data.participants.push(updateUser);
      await setDoc(doc(db, "activeGroups", anotherUser.groupRef), data)
      //מעדכן את ההישגים של המשתמש שהצטרף
        .then(async () => {
          const docRef2 = doc(db, "users", activeUser.userRef);
          const docSnap2 = await getDoc(docRef2);
          const userAchiev = docSnap2.data();
          let achiev = userAchiev.userAchievements.filter(
            (element) => element.name === "Joined Groups"
          );
          let item = achiev[0];
          UserScoreCalculate(item, "JoinedGroup", userAchiev);
          toast.success("Join successfully!");
        })
        .catch((error) => {
          toast.error("An error occurred. Please try again.");
        });
    }

    //שולח הודעת פוש ואם אין אישור אז מייל
    const docRefToken = doc(db, "fcmTokens", anotherUser.userRef);
    const docSnapToken = await getDoc(docRefToken);
    if (docSnapToken.exists()) {
      const data = docSnapToken.data();
      const token = data.fcmToken;
      const title = "Group invitantion Accepted !";
      const message = " Your invitation to the group has been confirmed by "+activeUser.name;
      const alert = {
        token: token,
        title: title,
        message: message,
      };
      console.log(alert);
      alertGroupEdited(alert);
    } else {
      fetch(
        "https://us-central1-regroup-a4654.cloudfunctions.net/sendMailOverHTTP",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subject: `Group invitantion Accepted !`,
            email: anotherUser.email,
            message:
              " Your invitation to the group has been confirmed by " +
              activeUser.name +
              ". you can see here the details here : https://regroup-a4654.web.app/myGroups",
          }),
        }
      )
        .then((response) => response.text())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
    }
    window.location.reload();
  };

  //הפונקציה מוחקת את הבקשה של היוזר מהדאטה
  const handleReject = async (anotherUser) => {
    const updatedinvitationList = invitationList.filter(
      (item) => item.userRef !== anotherUser.userRef
    );
    invitationList = updatedinvitationList;
    activeUser.groupParticipantsToApproval = updatedinvitationList;
    localStorage.setItem("activeUser", JSON.stringify(activeUser));
    const docRef = doc(db, "users", activeUser.userRef);
    await updateDoc(docRef, {
      groupParticipantsToApproval: invitationList,
    });
    //שולח הודעת פוש ואם אין אישור אז מייל
    const docRefToken = doc(db, "fcmTokens", anotherUser.userRef);
    const docSnapToken = await getDoc(docRefToken);
    if (docSnapToken.exists()) {
      const data = docSnapToken.data();
      const token = data.fcmToken;
      const title = "Rejected";
      const message = " Your requeste to join to the group rejected ";
      const alert = {
        token: token,
        title: title,
        message: message,
      };
      console.log(alert);
      alertGroupEdited(alert);
    } else {
      fetch(
        "https://us-central1-regroup-a4654.cloudfunctions.net/sendMailOverHTTP",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subject: `Rejected`,
            email: anotherUser.email,
            message: " Your request to join to the group rejected",
          }),
        }
      )
        .then((response) => response.text())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
    }
  };
  //מרנדר את הקבוצה שהמנהל שלה רוצה שתצטרף אלייה
 
  return (
    <>
      {invitationList.map((item) =>
        item.type === "invite" ? (
          <div key={item.groupRef} className=" ">
          <div>

          <div className=" w-auto h-46 m-2 max-w-full">
      <p className=" flex mt-1 justify-end ">
        {/* {handleGroupTime(groupData.timeStamp)} */}
      </p>
      <div className="flex flex-col lg:flex-row">
        <div className="lg:ml-2">
          <div className="grid grid-cols-6 gap-2">
            <div className="col-span-2">
              <Avatar image={item.groupData.groupImg} size="xlarge" shape="circle" />
            </div>
            <div className="col-span-4 mt-1 font-bold text-lg">
              <p className="mt-3 ml-3">{item.groupData.groupTittle}</p>
            </div>
          </div>
          <div className="ml-3 mt-2 flex flex-wrap justify-center text-sm">
            {item.groupData.groupTags.map((sub, index) => {
              let color = randomColor({
                luminosity: "light",
                hue: "random",
              });
              return (
                <Chip
                  key={uuidv4()}
                  style={{ backgroundColor: color }}
                  className="mr-2 mt-2 font-bold"
                  variant="outlined"
                  label={sub}
                />
              );
            })}
          </div>
        </div>
        <div className="lg:ml-3 mt-3 lg:mt-0 lg:border lg:rounded-lg lg:w-1/3">
          <p className="ml-3 mt-3 text-sm underline">Description:</p>
          <p className="ml-3 mt-3 text-lg text-center">{item.groupData.description}</p>
        </div>
        <div className="w-full lg:w-1/3 mt-3 lg:mt-0 lg:ml-3">
          <div className="flex flex-wrap lg:flex-nowrap">
            {item.groupData.participants.map((participant) => {
              return (
                <Chip
                  key={uuidv4()}
                  avatar={
                    <Avatar
                      size="small"
                      shape="circle"
                      image={participant.userImg}
                    />
                  }
                  onClick={() => handleUserClick(participant.userRef)}
                  color="success"
                  className="mr-2 mb-2 lg:mr-0 lg:mb-0"
                  variant="outlined"
                  label={participant.name}
                />
              );
            })}
          </div>
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


          </div>
            <div className="d-flex justify-content-end  mt-3 ">
              <button
                onClick={() => handleReject(item)}
                className=" btn btn-sm bg-red-500 hover:bg-red-700 text-white  mr-4"
              >
                Reject
              </button>
              <button
                onClick={() => handleAccept(item)}
                className=" btn btn-sm bg-green-500 hover:bg-green-700 text-white "
              >
                Accept
              </button>
            </div>
          </div>
        ) : null
      )}
    </>
  );
}

export default InvitationList;
