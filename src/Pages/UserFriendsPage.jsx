import React from "react";
import { useState, useEffect } from "react";
import NavBar from "../Coponents/NavBarComponents/NavBar";
import FriendsListCard from "../Coponents/FriendsComponents/FriendsListCard";
import CreateGroupButton from "../Coponents/GroupsComponents/CreateGroupButton";
import FriendRequestCard from "../Coponents/FriendsComponents/FriendRequestCard";
import { Modal, Box } from "@mui/material";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../FirebaseSDK";
function UserFriendsPage() {
  const [activeUser, setactiveUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    return user;
  });

  const [requestBtnClicked, setRequestBtnClicked] = useState(false);
  //מודל מידע ראשוני
  const [displayPopUp, setDisplayPopUp] = useState(true);
  // when pop-up is closed this function triggers
  const closePopUp = () => {
    // setting key "seenPopUp" with value true into localStorage
    localStorage.setItem("seenPopUpFriendsList", true);
    // setting state to false to not display pop-up
    setDisplayPopUp(false);
  };

  // check if  user seen and closed the pop-up
  useEffect(() => {
    // getting value of "seenPopUp" key from localStorage
    let returningUser = localStorage.getItem("seenPopUpFriendsList");
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
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "users", activeUser.userRef), (doc) => {
      let data = doc.data();
      setactiveUser(data);
      localStorage.setItem("activeUser", JSON.stringify(data));
    });
  }, []);
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
              <img
                src="https://firebasestorage.googleapis.com/v0/b/regroup-a4654.appspot.com/o/images%2Fhelp.png?alt=media&token=bf9b9c24-fd26-440b-893b-7a68437377fb"
                className=" flex rounded-2xl h-20 w-20 mb-2 mx-auto"
              />
              <h1>your friends</h1>
              <p className="mt-2">
                Here you can view your friends and new friend requests.
              </p>
              <p className="mt-2">
                You can also search here for participants who are not your
                friends to send a request to.
              </p>
              <button className="mt-2" onClick={closePopUp}>
                OK
              </button>
            </Box>
          </Modal>
        )}
      </div>
      <div className="flex justify-start m-2">
        <button
          className="btn btn-xs text-xm rounded-xl text-slate-950 bg-slate-200 m-2"
          onClick={() => {
            setRequestBtnClicked(true);
          }}
        >
          requests
        </button>
        <button
          className="btn btn-xs text-xm rounded-xl text-slate-950 bg-slate-200 m-2"
          onClick={() => {
            setRequestBtnClicked(false);
          }}
        >
          your friends
        </button>
      </div>

      <div className="mt-2">
        {requestBtnClicked ? <FriendRequestCard /> : <FriendsListCard />}
      </div>

      <CreateGroupButton />
    </div>
  );
}

export default UserFriendsPage;
