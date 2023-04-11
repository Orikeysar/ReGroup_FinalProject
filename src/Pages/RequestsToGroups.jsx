import React from "react";
import NavBar from "../Coponents/navbars/NavBar";
import { useState ,useEffect} from "react";
import UserProfileModal from "../Coponents/profileComponents/UserProfileModal";
import { db, alertGroupEdited } from "../FirebaseSDK";
import { doc, getDoc, updateDoc,onSnapshot } from "firebase/firestore";
import { toast } from "react-toastify";
import UserScoreCalculate from "../Coponents/UserScoreCalculate";
import { uuidv4 } from "@firebase/util";

function RequestsToGroups() {
  const [activeUser, setactiveUser] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem("activeUser"));
      return user;
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null; // or some default value
    }
  });
  console.log(activeUser)
  let requests=activeUser.groupParticipantsToApproval;
    

  useEffect(() => {
    const docRef = doc(db, "users", activeUser.userRef);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      const userData = doc.data();
      // Update the activeUser state and localStorage with the new data
      setactiveUser(userData);
      localStorage.setItem("activeUser", JSON.stringify(userData));
    });
    // Unsubscribe from the snapshot listener when the component unmounts
    return unsubscribe;
  }, []);
  
  //הפונקציה מוחקת את הבקשה של היוזר מהדאטה ומכניסה אותו כמשתתף לקבוצה
  const handleAccept = async (id) => {
    const user = requests.filter((item) => item.userRef === id);
    const updatedRequests = requests.filter((item) => item.userRef !== id);
    requests=updatedRequests;
    activeUser.groupParticipantsToApproval = updatedRequests;
    setactiveUser(activeUser);
    console.log(activeUser)
    localStorage.setItem("activeUser", JSON.stringify(activeUser));
    const docRef = doc(db, "users", activeUser.userRef);

    await updateDoc(docRef, {
      groupParticipantsToApproval: requests,
    });
    let updateUser = {
      email: user[0].email,
      name: user[0].name,
      userImg: user[0].userImg,
      userRef: user[0].userRef,
    };
    let docRefGroup = doc(db, "activeGroups", user[0].groupRef);
    let docSnapGroup = await getDoc(docRefGroup);
    let data = docSnapGroup.data();
    console.log(data)
    data.participants.push(updateUser);
    await updateDoc(docRefGroup, {
      participants: data.participants,
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
      })
      .catch((error) => {
        toast.error("An error occurred. Please try again.");
      });
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
        .then(localStorage.setItem("isSend", ""))
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
    }
  };
  //הפונקציה מוחקת את הבקשה של היוזר מהדאטה

  const handleReject = async (id) => {
    const user = requests.filter((item) => item.userRef === id);
    const updatedRequests = requests.filter((item) => item.userRef !== id);
    requests=updatedRequests;
    activeUser.groupParticipantsToApproval = updatedRequests;
    setactiveUser(activeUser);
    console.log(activeUser)
    localStorage.setItem("activeUser", JSON.stringify(activeUser));
    const docRef = doc(db, "users", activeUser.userRef);
    await updateDoc(docRef, {
      groupParticipantsToApproval: requests,
    });
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
        .then(localStorage.setItem("isSend", ""))
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
    }
  };
  return (
    <div>
      <div className="topNavBar w-full mb-24">
        <NavBar />
      </div>
      <div className="card w-auto h-46 m-2 p-2 border border-stone-400 overflow-hidden">
        {requests.length === 0 ? (
          <h2>Sorry.. You do not have requests pending approval</h2>
        ) : (
          <div className="">
            {requests.map((item) => (
              <div key={uuidv4()} className=" ">
                <UserProfileModal id={item.userRef} />
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RequestsToGroups;
