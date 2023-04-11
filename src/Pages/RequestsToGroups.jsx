import React from "react";
import NavBar from "../Coponents/navbars/NavBar";
import { useState } from "react";
import UserProfileModal from "../Coponents/profileComponents/UserProfileModal";
import { db,alertGroupEdited } from "../FirebaseSDK";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import UserScoreCalculate from "../Coponents/UserScoreCalculate";

 function RequestsToGroups() {
  const [activeUser, setactiveUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    return user;
  });
  const [requests, setRequests] = useState(activeUser.groupParticipantsToApproval);
  //הפונקציה מוחקת את הבקשה של היוזר מהדאטה ומכניסה אותו כמשתתף לקבוצה
  const handleAccept = async (id) => {
    const user = requests.filter((item) => item.userRef === id);
    const updatedRequests = requests.filter((item) => item.userRef !== id);
    setRequests(updatedRequests);
    activeUser.groupParticipantsToApproval=updatedRequests;
      localStorage.setItem("activeUser",activeUser)
      const docRef = doc(db, "users", activeUser.userRef);

    await updateDoc(docRef, {
      groupParticipantsToApproval: requests,
    });
    let updateUser = {
        email: user.email,
        name: user.name,
        userImg: user.userImg,
        userRef: user.userRef,
      };
      let docRefGroup = doc(db, "activeGroups",user.groupRef );
      let docSnapGroup = await getDoc(docRefGroup);
      let data = docSnapGroup.data();
      let newParticipantsList=data.participants;
      newParticipantsList.push(updateUser);
      await updateDoc(docRef, {
        participants: newParticipantsList,
      })
      .then(async() => {
            const docRef2 = doc(db, "users", id);
            const docSnap2 = await getDoc(docRef2);
            const userAchiev=docSnap2.data()
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
        const docRefToken = doc(db, "fcmTokens", id);
         const docSnapToken = await getDoc(docRefToken);
         if (docSnapToken.exists()) {
          const data = docSnapToken.data();
          const token = data.fcmToken;
         const title ="Group Request Accepted !"
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
            email: user.email,
            message:
            " Your requeste to join to the group was accepted by "+activeUser.name+". you can see here the details here : https://regroup-a4654.web.app/myGroups",
          }),
        }
      )
        .then((response) => response.text())
        .then(localStorage.setItem("isSend",""))
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
    }
  

  };
    //הפונקציה מוחקת את הבקשה של היוזר מהדאטה

  const handleReject = async (id) => {
    const user = requests.filter((item) => item.userRef === id);
    const updatedRequests = requests.filter((item) => item.userRef !== id);
    setRequests(updatedRequests);
    activeUser.groupParticipantsToApproval=updatedRequests;
      localStorage.setItem("activeUser",activeUser)
      const docRef = doc(db, "users", activeUser.userRef);
    await updateDoc(docRef, {
      groupParticipantsToApproval: requests,
    });
    const docRefToken = doc(db, "fcmTokens", id);
    const docSnapToken = await getDoc(docRefToken);
    if (docSnapToken.exists()) {
      const data = docSnapToken.data();
      const token = data.fcmToken;
      const title ="Rejected"
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
            email: user.email,
            message:
            " You requested to join to the group rejected",
          }),
        }
      )
        .then((response) => response.text())
        .then(localStorage.setItem("isSend",""))
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
    }
  

  };

  // await updateDoc(docRefToManager, {
  //         groupParticipantsToApproval: newRequests,
  //       });
  
  // group.participants.push(user);
  // await setDoc(doc(db, "activeGroups", group.id), {
  //   description: group.description,
  //   groupImg: group.groupImg,
  //   groupTags: group.groupTags,
  //   groupTittle: group.groupTittle,
  //   groupSize: group.groupSize,
  //   isActive: group.isActive,
  //   location: group.location,
  //   managerRef: group.managerRef,
  //   participants: group.participants,
  //   timeStamp: group.timeStamp,
  // })
  //   .then(() => {
  //     let achiev = activeUser.userAchievements.filter(
  //       (element) => element.name === "Joined Groups"
  //     );
  //     let item = achiev[0];
  //     UserScoreCalculate(item, "JoinedGroup", activeUser);
  //     toast.success("Join successfully!");
  //     setBtnStatus(true);
  //   })
  //   .catch((error) => {
  //     toast.error("An error occurred. Please try again.");
  //   });
  // localStorage.setItem("componentChoosen", "MyGroupsPage");
  // navigate("/myGroups");
  return (
    <div>
      <div className="topNavBar w-full mb-24">
        <NavBar />
      </div>
      <div className="card w-auto h-46 m-2 p-2 border border-stone-400 overflow-hidden">
        {requests.length === 0 ? (
          <h2>Sorry.. You do not have requests pending approval</h2>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {requests.map((item) => (
              <div className="flex justify-between items-center border p-4">
                <UserProfileModal id={item.userRef} />
                <div>
                  <button onClick={()=>handleAccept(item.userRef)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Accept
                  </button>
                  <button onClick={()=>handleReject(item.userRef)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RequestsToGroups;


