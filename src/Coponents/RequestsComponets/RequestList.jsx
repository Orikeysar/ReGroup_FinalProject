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
import { useFindMyGroups } from "../../Hooks/useFindMyGroups";
import { useNavigate } from "react-router-dom";

function RequestList({ requestList }) {
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

  let { managerGroup, participantGroup } = useFindMyGroups();

  //הפונקציה מוחקת את הבקשה של היוזר מהדאטה ומכניסה אותו כמשתתף לקבוצה
  const handleAccept = async (anotherUserRef) => {
    //שולף מהרשימה את המשתמש שאישרתי
    const anotherUser = requestList.filter(
      (item) => item.userRef === anotherUserRef
    );
    //מעדכן את הרשימה ללא המשתמש שאישרתי
    const updatedrequestList = requestList.filter(
      (item) => item.userRef !== anotherUserRef
    );
    requestList = updatedrequestList;
    activeUser.groupParticipantsToApproval = updatedrequestList;
    localStorage.setItem("activeUser", JSON.stringify(activeUser));
    //מעדכן את הדאטה של ההמנהל
    const docRef = doc(db, "users", activeUser.userRef);
    await updateDoc(docRef, {
      groupParticipantsToApproval: activeUser.groupParticipantsToApproval,
    });
    let updateUser = {
      email: anotherUser[0].email,
      name: anotherUser[0].name,
      userImg: anotherUser[0].userImg,
      userRef: anotherUser[0].userRef,
    };
    managerGroup.participants.push(updateUser);
    await setDoc(doc(db, "activeGroups", managerGroup.id), managerGroup)
      //אחראי על עידכון ההישגים האישיים ומעלה נקודות למי שאישרו אותו להצטרף לקבוצה
      .then(async () => {
        const docRef2 = doc(db, "users", anotherUserRef);
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
    //שולח הודעת פוש ואם אין אישור אז מייל
    const docRefToken = doc(db, "fcmTokens", anotherUserRef);
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
            email: anotherUser[0].email,
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
    window.location.reload();
  };
  //הפונקציה מוחקת את הבקשה של היוזר מהדאטה

  const handleReject = async (id) => {
    const user = requestList.filter((item) => item.userRef === id);
    const updatedrequestList = requestList.filter(
      (item) => item.userRef !== id
    );
    requestList = updatedrequestList;
    activeUser.groupParticipantsToApproval = updatedrequestList;
    setActiveUser(activeUser);
    console.log(activeUser);
    localStorage.setItem("activeUser", JSON.stringify(activeUser));
    const docRef = doc(db, "users", activeUser.userRef);
    await updateDoc(docRef, {
      groupParticipantsToApproval: requestList,
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
    window.location.reload();

  };
  return (
    <div>
      {requestList.map((item) => (
        <div key={uuidv4()} className=" ">
          <div className="d-flex justify-content-end  mt-3 ">
            <div>
              <div className="grid grid-cols-5 pt-3 ">
                <img
                  style={{
                    width: 90 + "%",
                    height: 80 + "%",
                    borderRadius: 25,
                  }}
                  src={item.userImg}
                  className="justify-center flex-auto col-span-1 mt-3"
                />
                <div className="col-span-3 mt-1">
                  <div className="text-xl font-bold">{item.name}</div>
                  <div className="text-lg font-semibold">{item.email}</div>
                </div>
              </div>
            </div>
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
      ))}
    </div>

  );
}

export default RequestList;
