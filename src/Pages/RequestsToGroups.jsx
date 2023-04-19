import React from "react";
import NavBar from "../Coponents/navbars/NavBar";
import { useState, useEffect } from "react";
import { db } from "../FirebaseSDK";
import { doc, onSnapshot } from "firebase/firestore";
import CreateGroupButton from "../Coponents/GroupsComponents/CreateGroupButton";
import RequestList from "../Coponents/RequestsComponets/RequestList";
import InvitationList from "../Coponents/RequestsComponets/InvitationList"
import { Modal, Box } from "@mui/material";

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
  //מודל מידע ראשוני
  const [displayPopUp, setDisplayPopUp] = useState(true);
  // when pop-up is closed this function triggers
  const closePopUp = () => {
    // setting key "seenPopUp" with value true into localStorage
    localStorage.setItem("seenPopUpRequests", true);
    // setting state to false to not display pop-up
    setDisplayPopUp(false);
  };

  // check if  user seen and closed the pop-up
  useEffect(() => {
    // getting value of "seenPopUp" key from localStorage
    let returningUser = localStorage.getItem("seenPopUpRequests");
    // setting the opposite to state, false for returning user, true for a new user
    setDisplayPopUp(!returningUser);
  }, []);
  //אחראי על הסטייל של המודל הראשוני
  const PopUpInfoStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 300,
    height: 400,
    boxShadow: 24,
    padding: 2,
    textAlign: "center",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 0 20px rgba(0,0,0,0.3)",
  };
useEffect(()=>{
const unsub = onSnapshot(doc(db, "users", activeUser.userRef), (doc) => {
  let data = doc.data()
  setActiveUser(data)
  setRequests(data.groupParticipantsToApproval)
   localStorage.setItem("activeUser", JSON.stringify(data));
});
},[])

  const [requests, setRequests] = useState(
    activeUser.groupParticipantsToApproval
  );
  const [requestList, setRequestList] = useState(()=>{
    const newRequestList = requests.filter((item) => item.type === "request")
    return newRequestList
  });
  const [invitationList, setInvitationList] = useState(()=>{

 const newInvitationList = requests.filter((item) => item.type === "invite");
return newInvitationList
  });

   

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

  if (requests == null ) {
    return (
      <div>
        <div className="topNavBar w-full mb-24">
          <NavBar />
        </div>
        {/* הצגת המודל הראשוני עם המידע  */}
        <div className=" float-none">
          {displayPopUp && (
            <Modal
              open={true}
              // once pop-up will close "closePopUp" function will be executed
              onClose={closePopUp}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={PopUpInfoStyle}>
                {/* what user will see in the modal is defined below */}
                <img src="https://firebasestorage.googleapis.com/v0/b/regroup-a4654.appspot.com/o/images%2Finvitation.png?alt=media&token=e775892c-7738-4786-8a36-6ff86da87c33" className=" flex rounded-2xl h-20 w-20 mb-2 mx-auto"/>
                <h1>Requests from participants to groups</h1>
                <p className="mt-2">
                On this page you can review requests to join your group or invitations from friends who want you to join their group.
                </p>
                <p className="mt-2">
                Upon approval of requests and orders, we will notify the participant who sent the request.
                </p>
                <button className="mt-2" onClick={closePopUp}>
                  OK
                </button>
              </Box>
            </Modal>
          )}
        </div>
        <div className="rounded-xl flex items-center space-x-2 justify-center text-base align-middle mb-4 ">
          <img
            className=" w-10 h-10 rounded-full "
            src="https://firebasestorage.googleapis.com/v0/b/regroup-a4654.appspot.com/o/images%2Finvitation.png?alt=media&token=e775892c-7738-4786-8a36-6ff86da87c33"
            alt="Users Recored"
          />{" "}
          <p className=" font-bold text-xl">Requests and Invitations</p>
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
  } else if (type === "request" && requestList) {
    return (
      <div>
        <div className="topNavBar w-full mb-24">
          <NavBar />
        </div>
        {/* הצגת המודל הראשוני עם המידע  */}
        <div className=" float-none">
          {displayPopUp && (
            <Modal
              open={true}
              // once pop-up will close "closePopUp" function will be executed
              onClose={closePopUp}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={PopUpInfoStyle}>
                {/* what user will see in the modal is defined below */}
                <img src="https://firebasestorage.googleapis.com/v0/b/regroup-a4654.appspot.com/o/images%2Finvitation.png?alt=media&token=e775892c-7738-4786-8a36-6ff86da87c33" className=" flex rounded-2xl h-20 w-20 mb-2 mx-auto"/>
                <h1>Requests from participants to groups</h1>
                <p className="mt-2">
                On this page you can review requests to join your group or invitations from friends who want you to join their group.
                </p>
                <p className="mt-2">
                Upon approval of requests and orders, we will notify the participant who sent the request.
                </p>
                <button className="mt-2" onClick={closePopUp}>
                  OK
                </button>
              </Box>
            </Modal>
          )}
        </div>
        <div className="rounded-xl flex items-center space-x-2 justify-center text-base align-middle mb-4 ">
          <img
            className=" w-10 h-10 rounded-full "
            src="https://firebasestorage.googleapis.com/v0/b/regroup-a4654.appspot.com/o/images%2Finvitation.png?alt=media&token=e775892c-7738-4786-8a36-6ff86da87c33"
            alt="Users Recored"
          />{" "}
          <p className=" font-bold text-xl">Requests and Invitations</p>
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
  } else if (type === "invite" && invitationList) {
    return (
      <div>
        <div className="topNavBar w-full mb-24">
          <NavBar />
        </div>
        {/* הצגת המודל הראשוני עם המידע  */}
        <div className=" float-none">
          {displayPopUp && (
            <Modal
              open={true}
              // once pop-up will close "closePopUp" function will be executed
              onClose={closePopUp}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={PopUpInfoStyle}>
                {/* what user will see in the modal is defined below */}
                <img src="https://firebasestorage.googleapis.com/v0/b/regroup-a4654.appspot.com/o/images%2Finvitation.png?alt=media&token=e775892c-7738-4786-8a36-6ff86da87c33" className=" flex rounded-2xl h-20 w-20 mb-2 mx-auto"/>
                <h1>Requests from participants to groups</h1>
                <p className="mt-2">
                On this page you can review requests to join your group or invitations from friends who want you to join their group.
                </p>
                <p className="mt-2">
                Upon approval of requests and orders, we will notify the participant who sent the request.
                </p>
                <button className="mt-2" onClick={closePopUp}>
                  OK
                </button>
              </Box>
            </Modal>
          )}
        </div>
        <div className="rounded-xl flex items-center space-x-2 justify-center text-base align-middle mb-4 ">
          <img
            className=" w-10 h-10 rounded-full "
            src="https://firebasestorage.googleapis.com/v0/b/regroup-a4654.appspot.com/o/images%2Finvitation.png?alt=media&token=e775892c-7738-4786-8a36-6ff86da87c33"
            alt="Users Recored"
          />{" "}
          <p className=" font-bold text-xl">Requests and Invitations</p>
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
