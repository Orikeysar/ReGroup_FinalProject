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

function InvitationList(invitationList) {
  const [activeUser, setActiveUser] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem("activeUser"));
      return user;
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null; // or some default value
    }
  });
  //הפונקציה מוחקת את הבקשה של היוזר מהדאטה ומכניסה אותו כמשתתף לקבוצה
  const handleAccept = async (id) => {
    const user = invitationList.filter((item) => item.userRef === id);
    const updatedinvitationList = invitationList.filter(
      (item) => item.userRef !== id
    );
    invitationList = updatedinvitationList;
    activeUser.groupParticipantsToApproval = updatedinvitationList;
    setActiveUser(activeUser);
    console.log(activeUser);
    localStorage.setItem("activeUser", JSON.stringify(activeUser));
    const docRef = doc(db, "users", activeUser.userRef);

    await updateDoc(docRef, {
      groupParticipantsToApproval: invitationList,
    });
    let updateUser = {
      email: user[0].email,
      name: user[0].name,
      userImg: user[0].userImg,
      userRef: user[0].userRef,
    };
    const q = query(
      collection(db, "activeGroups"),
      where("managerRef", "==", activeUser.userRef)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot
      .forEach(async (doc) => {
        let data = doc.data();
        data.participants.push(updateUser);
        await setDoc(doc(db, "activeGroups", doc.id), data);
      })

      .then(async () => {
        const docRef2 = doc(db, "users", id);
        const docSnap2 = await getDoc(docRef2);
        const userAchiev = docSnap2.data();
        let achiev = userAchiev.userAchievements.filter(
          (element) => element.name === "Joined Groups"
        );
        let item = achiev[0];
        UserScoreCalculate(item, "JoinedGroup", userAchiev);
        toast.success("Join successfully!");
        localStorage.setItem("isSend", "");
      })
      .catch((error) => {
        toast.error("An error occurred. Please try again.");
      });
    //שולח הודעת פוש ואם אין אישור אז מייל
    const docRefToken = doc(db, "fcmTokens", id);
    const docSnapToken = await getDoc(docRefToken);
    if (docSnapToken.exists()) {
      const data = docSnapToken.data();
      const token = data.fcmToken;
      const title = "Group Request Accepted !";
      const message = " You requeste to join to the group accepted ";
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
            subject: `Group Request Accepted !`,
            email: user[0].email,
            message:
              " Your request to join to the group was accepted by " +
              activeUser.name +
              ". you can see here the details here : https://regroup-a4654.web.app/myGroups",
          }),
        }
      )
        .then((response) => response.text())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
    }
  };
  //הפונקציה מוחקת את הבקשה של היוזר מהדאטה

  const handleReject = async (id) => {
    const user = invitationList.filter((item) => item.userRef === id);
    const updatedinvitationList = invitationList.filter(
      (item) => item.userRef !== id
    );
    invitationList = updatedinvitationList;
    activeUser.groupParticipantsToApproval = updatedinvitationList;
    setActiveUser(activeUser);
    console.log(activeUser);
    localStorage.setItem("activeUser", JSON.stringify(activeUser));
    const docRef = doc(db, "users", activeUser.userRef);
    await updateDoc(docRef, {
      groupParticipantsToApproval: invitationList,
    });
    localStorage.setItem("isSend", "");
    //שולח הודעת פוש ואם אין אישור אז מייל
    const docRefToken = doc(db, "fcmTokens", id);
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
            email: user[0].email,
            message: " Your request to join to the group rejected",
          }),
        }
      )
        .then((response) => response.text())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
    }
  };
  const renderGroupInvation = async (managerRef) => {
    const q = query(
      collection(db, "activeGroups"),
      where("managerRef", "==", managerRef)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      let data = doc.data();
      return <GroupInvationsCard group={data} />;
    });
  };
  return (
    <>
      {invitationList.map((item) =>
        item.type === "invite" ? (
          <div key={uuidv4()} className=" ">
            {renderGroupInvation(item.managerRef)}
            <div className="d-flex justify-content-end  mt-3 ">
              <button
                onClick={() => handleReject(item.userRef)}
                className=" btn btn-sm bg-red-500 hover:bg-red-700 text-white  mr-4"
              >
                Reject
              </button>
              <button
                onClick={() => handleAccept(item.userRef)}
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
