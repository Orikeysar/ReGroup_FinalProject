import React from "react";
import NavBar from "../Coponents/navbars/NavBar";
import { useState, useEffect } from "react";
import { db } from "../FirebaseSDK";
import { doc, onSnapshot } from "firebase/firestore";
import CreateGroupButton from "../Coponents/GroupsComponents/CreateGroupButton";
import RequestList from "../Coponents/RequestsComponets/RequestList";
import InvitationList from "../Coponents/RequestsComponets/InvitationList"

function RequestsToGroups() {
  const [activeUser, setActiveUser] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem("activeUser"));
      return user;
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null; // or some default value
    }
  });
  //בודקת עידכון בזמן אמת במשתמש ומעדכנת את הלוקאל אם יש
  const unsub= onSnapshot(doc(db, "users", activeUser.userRef), (doc) => {
    let data = doc.data()
     setActiveUser(data)
     localStorage.setItem("activeUser", JSON.stringify(data));
 });
  const [requests, setSequests] = useState(
    activeUser.groupParticipantsToApproval
  );
  const [requestList, setRequestList] = useState([]);
  const [invitationList, setInvitationList] = useState([]);
  useEffect(() => {
    if (activeUser.groupParticipantsToApproval.length > 0) {
      let requests = activeUser.groupParticipantsToApproval;
      let newRequestList = requests.filter((item) => item.type === "request");
      let newInvitationList = requests.filter((item) => item.type === "invite");
      setRequestList(newRequestList);
      setInvitationList(newInvitationList);
    }
  }, []);

  //צביעת כפתורים של הניווט
  const [btnColorRequest, setBtnColorRequest] = useState(
    "btn m-2 text-sm shadow-md"
  );
  const [btnColorInvite, setBtnColorInvite] = useState(
    "btn m-2 text-sm  text-black glass shadow-md"
  );
  //ברירת מחדל יופיעו הכללי קודם
  const [type, setType] = useState("request");
  //משנה את הצבע בחירה ומעביר אותך למערך הרלוונטי
  const handleClickRequest = () => {
    setBtnColorInvite("btn m-2 text-sm glass text-black shadow-md");
    setBtnColorRequest("btn m-2 shadow-md");
    setType("request");
  };
  const handleClickInvite = () => {
    setBtnColorInvite("btn m-2 shadow-md");
    setBtnColorRequest("btn m-2 text-sm glass text-black shadow-md");
    setType("invite");
  };
  
    // Unsubscribe from the snapshot listener when the component unmounts

  if (requests.length === 0 || (type === "request" && requestList.length===0)|| (type === "invite" && invitationList.length===0)) {
    return (
      <div>
        <div className="topNavBar w-full mb-24">
          <NavBar />
        </div>
        <div className="flex justify-center m-2">
          <button onClick={handleClickRequest} className={btnColorRequest}>
            Requests
          </button>
          <button onClick={handleClickInvite} className={btnColorInvite}>
            Invitations
          </button>
        </div>
        <div className="shadow-md card w-auto h-46 m-2 p-2 border border-stone-400 overflow-hidden">
          <h2>
            Sorry.. You do not have requests or invitations pending approval
          </h2>
        </div>
        <CreateGroupButton />
      </div>
    );
  } else if (type === "request" && requestList.length>0) {
    return (
      <div>
        <div className="topNavBar w-full mb-24">
          <NavBar />
        </div>
        <div className="flex justify-center m-2">
          <button onClick={handleClickRequest} className={btnColorRequest}>
            Requests
          </button>
          <button onClick={handleClickInvite} className={btnColorInvite}>
            Invitations
          </button>
        </div>
        <div className="card w-auto h-46 m-2 p-2 border border-stone-400 overflow-hidden">
          <h2>
            You have requests to join the group you manage from the following
            users:{" "}
          </h2>
          <RequestList requestList={requestList} />
        </div>
        <CreateGroupButton />
      </div>
    );
  } else if (type === "invite" && invitationList.length>0) {
    return (
      <div>
        <div className="topNavBar w-full mb-24">
          <NavBar />
        </div>
        <div className="flex justify-center m-2">
          <button onClick={handleClickRequest} className={btnColorRequest}>
            Requests
          </button>
          <button onClick={handleClickInvite} className={btnColorInvite}>
            Invitations
          </button>
        </div>
        <div className="card w-auto h-46 m-2 p-2 border border-stone-400 overflow-hidden">
          <h2>Groups whose admin asked you to join them: </h2>
          <InvitationList invitationList={invitationList} />
        </div>
        <CreateGroupButton />
      </div>
    );
  }
}

export default RequestsToGroups;
