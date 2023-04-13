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
  const renderGroupInvation = async (groupRef) => {
    const docGroupRef = doc(db, "activeGroups", groupRef);
    const docGroupSnap = await getDoc(docGroupRef);
    if (docGroupSnap.exists()) {
      let data = docGroupSnap.data();
      return <GroupInvationsCard group={data} />;
    }
  };
  return (
    <>
      {invitationList.map((item) =>
        item.type === "invite" ? (
          <div key={uuidv4()} className=" ">
            {renderGroupInvation(item.groupRef)}
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
