import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Avatar } from "primereact/avatar";
import { OrderList } from "primereact/orderlist";
import { Timestamp } from "firebase/firestore";
import NavBar from "../Coponents/NavBarComponents/NavBar";
import CreateGroupButton from "../Coponents/GroupsComponents/CreateGroupButton";
import { Modal, Box } from "@mui/material";

function RecentActivitiesCard() {
  const navigate = useNavigate();
  //משיכת המשתמש המחבור מהלוקאל
  const [activeUser, setActiveUser] = useState(() => {
    const storedactiveUser = localStorage.getItem("activeUser");
    return JSON.parse(storedactiveUser);
  });
  //מודל מידע ראשוני
  const [displayPopUp, setDisplayPopUp] = useState(true);
  // when pop-up is closed this function triggers
  const closePopUp = () => {
    // setting key "seenPopUp" with value true into localStorage
    localStorage.setItem("seenPopUpRecent", true);
    // setting state to false to not display pop-up
    setDisplayPopUp(false);
  };

  // check if  user seen and closed the pop-up
  useEffect(() => {
    // getting value of "seenPopUp" key from localStorage
    let returningUser = localStorage.getItem("seenPopUpRecent");
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
  //מערכים להפרדה בין מה שבטייפ כללי ומה שבטייפ קבוצות והצבעים של הכפתורים
  const [activitiesTypeGroups, setActivitiesTypeGroups] = useState([]);
  const [activitiesTypeGeneral, setActivitiesTypeGeneral] = useState([]);
  const [btnColorGeneral, setBtnColorGeneral] = useState(
    "btn m-2 text-sm shadow-md"
  );
  const [btnColorGroups, setBtnColorGroups] = useState(
    "btn m-2 text-sm  text-black glass shadow-md"
  );
  //ברירת מחדל יופיעו הכללי קודם
  const [type, setType] = useState("General");
  const handleDateTime = (timeStamp) => {
    if (timeStamp) {
      const firestoreTimestamp = new Timestamp(
        timeStamp.seconds,
        timeStamp.nanoseconds
      );
      const date = firestoreTimestamp.toDate();
      const day = date.getDate();
      const month = date.getMonth() + 1; // JavaScript months are 0-indexed
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const year = date.getFullYear();
      return `${day}/${month}/${year}, ${hours}:${minutes
        .toString()
        .padStart(2, "0")}`;
    }
  };
  //בודק אם יש משתמש ואם יש לו פעילויות אחרונות. ויוצר מערכים לקבוצות וכללי
  useEffect(() => {
    if (activeUser && activeUser.recentActivities) {
      const { groups, general } = activeUser.recentActivities.reduce(
        (acc, item) => {
          if (item.type === "groups") {
            acc.groups.push(item);
          } else {
            acc.general.push(item);
          }
          return acc;
        },
        { groups: [], general: [] }
      );
      // Sort the arrays by the timestamp property in descending order
      groups.sort((a, b) => {
        const aTimestamp = new Date(
          a.timeStamp.seconds * 1000 + a.timeStamp.nanoseconds / 1000000
        );
        const bTimestamp = new Date(
          b.timeStamp.seconds * 1000 + b.timeStamp.nanoseconds / 1000000
        );
        return bTimestamp - aTimestamp;
      });
      general.sort((a, b) => {
        const aTimestamp = new Date(
          a.timeStamp.seconds * 1000 + a.timeStamp.nanoseconds / 1000000
        );
        const bTimestamp = new Date(
          b.timeStamp.seconds * 1000 + b.timeStamp.nanoseconds / 1000000
        );
        return bTimestamp - aTimestamp;
      });
      setActivitiesTypeGroups(groups);
      setActivitiesTypeGeneral(general);
    }
  }, [activeUser, activeUser.recentActivities]);

  //משנה את הצבע בחירה ומעביר אותך למערך הרלוונטי
  const handleClickGeneral = () => {
    setBtnColorGroups("btn m-2 text-sm glass text-black shadow-md");
    setBtnColorGeneral("btn m-2 shadow-md");
    setType("General");
  };
  const handleClickGroups = () => {
    setBtnColorGroups("btn m-2 shadow-md");
    setBtnColorGeneral("btn m-2 text-sm glass text-black shadow-md");
    setType("Groups");
  };
  //הפונקציה מקבלת את המערך של הקבוצות ומרנדרת אובייקט אובייקט לתוך הרשימה
  const itemTemplateGroups = (item) => {
    return (
      <div
        key={uuidv4()}
        className="grid grid-cols-6 w-full text-center mt-20 "
      >
        <div className="col-span-2 self-center ">
          <div className=" font-extrabold">{item.course}</div>
          <div>
            {item.subjects
              .map((sub, index) => {
                // Check if this is the last item in the array
                const isLast = index === item.subjects.length - 1;
                // Append a "|" character if this is not the last item
                const separator = isLast ? "" : " | ";
                // Return the subject name with the separator character
                return sub + separator;
              })
              .join("")}
          </div>
        </div>
        <div className="col-span-2">{item.text}</div>
        <div className="col-span-2">{handleDateTime(item.timeStamp)}</div>
      </div>
    );
  };
  //הפונקציה מקבלת את המערך של הכללי ומרנדרת אובייקט אובייקט לתוך הרשימה
  const itemTemplateGeneral = (item) => {
    return (
      <div key={uuidv4()} className="grid grid-cols-6 w-full text-center mt-2 ">
        <div className="col-span-1 self-center align-middle flex flex-nowrap flex-col-reverse items-center">
          <Avatar
            image={item.icon}
            size="large"
            shape="circle"
            className="justify-center flex-auto"
          />
        </div>
        <div className="col-span-3 mt-3">{item.text}</div>
        <div className="col-span-2 mt-3">{handleDateTime(item.timeStamp)}</div>
      </div>
    );
  };
  if (activeUser.recentActivities.length === 0) {
    return (
      <div>
        <div className="topNavBar w-full mb-20">
          <NavBar />
        </div>
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
                  src="https://firebasestorage.googleapis.com/v0/b/regroup-a4654.appspot.com/o/images%2Frecent.png?alt=media&token=f75db574-c9cc-4246-a350-ae9c2f3b3b40"
                  className=" flex rounded-2xl h-20 w-20 mb-2 mx-auto"
                />
                <h1>Your recent activities</h1>
                <p className="mt-2">
                  Here you can track your actions in the system.
                </p>
                <p className="mt-2">
                  You can switch between GENERAL actions, like friend you added, and GROUPS related to
                  groups you've created or joined info in the past.
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
            src="https://firebasestorage.googleapis.com/v0/b/regroup-a4654.appspot.com/o/images%2Frecent.png?alt=media&token=f75db574-c9cc-4246-a350-ae9c2f3b3b40"
            alt="Users Recored"
          />{" "}
          <p className=" font-bold text-xl">Recent Activities</p>
        </div>
        <div className="flex justify-center m-2">
          <button onClick={handleClickGeneral} className={btnColorGeneral}>
            General
          </button>
          <button onClick={handleClickGroups} className={btnColorGroups}>
            Gruops
          </button>
        </div>
        <div className=" justify-center m-10">
          <div className="shadow-md card w-auto h-46 m-2 p-2 border border-stone-400 overflow-hidden">
            <h2>
              Hello! You currently have no recent activities, you are welcome to
              start creating groups or participate and here you can see the
              history of all your actions.
            </h2>
          </div>
        </div>
        <CreateGroupButton />
      </div>
    );
  }

  if (type === "General") {
    return (
      <div>
        <div className="topNavBar w-full mb-24">
          <NavBar />
        </div>
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
                  src="https://firebasestorage.googleapis.com/v0/b/regroup-a4654.appspot.com/o/images%2Frecent.png?alt=media&token=f75db574-c9cc-4246-a350-ae9c2f3b3b40"
                  className=" flex rounded-2xl h-20 w-20 mb-2 mx-auto"
                />
                <h1>Your recent activities</h1>
                <p className="mt-2">
                  Here you can track your actions in the system.
                </p>
                <p className="mt-2">
                  You can switch between general actions and actions related to
                  groups you've created or joined.
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
            src="https://firebasestorage.googleapis.com/v0/b/regroup-a4654.appspot.com/o/images%2Frecent.png?alt=media&token=f75db574-c9cc-4246-a350-ae9c2f3b3b40"
            alt="Users Recored"
          />{" "}
          <p className=" font-bold text-xl">Recent Activities</p>
        </div>
        <div className="flex justify-center m-2">
          <button onClick={handleClickGeneral} className={btnColorGeneral}>
            General
          </button>
          <button onClick={handleClickGroups} className={btnColorGroups}>
            Gruops
          </button>
        </div>
        <div className="overflow-x-auto">
          <div className=" w-full">
            <div>
              <div className="grid grid-cols-6 w-full text-center font-bold ">
                <div className="col-span-1"></div>
                <div className="col-span-3">Description</div>
                <div className="col-span-2">Time</div>
              </div>
            </div>
            <div>
              <div className="card w-full  justify-center ">
                <OrderList
                  value={activitiesTypeGeneral}
                  itemTemplate={itemTemplateGeneral}
                ></OrderList>
              </div>
            </div>
          </div>
        </div>
        <CreateGroupButton />
      </div>
    );
  } else {
    return (
      <div>
        <div className="topNavBar w-full mb-24">
          <NavBar />
        </div>
        <div className=" float-none">
          {/* הצגת המודל הראשוני עם המידע  */}
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
                  src="https://firebasestorage.googleapis.com/v0/b/regroup-a4654.appspot.com/o/images%2Frecent.png?alt=media&token=f75db574-c9cc-4246-a350-ae9c2f3b3b40"
                  className=" flex rounded-2xl h-20 w-20 mb-2 mx-auto"
                />
                <h1>Your recent activities</h1>
                <p className="mt-2">
                  Here you can track your actions in the system.
                </p>
                <p className="mt-2">
                  You can switch between general actions and actions related to
                  groups you've created or joined.
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
            src="https://firebasestorage.googleapis.com/v0/b/regroup-a4654.appspot.com/o/images%2Frecent.png?alt=media&token=f75db574-c9cc-4246-a350-ae9c2f3b3b40"
            alt="Users Recored"
          />{" "}
          <p className=" font-bold text-xl">Recent Activities</p>
        </div>
        <div className="flex justify-center m-2">
          <button onClick={handleClickGeneral} className={btnColorGeneral}>
            General
          </button>
          <button onClick={handleClickGroups} className={btnColorGroups}>
            Gruops
          </button>
        </div>
        <div className="overflow-x-auto">
          <div className=" w-full">
            <div>
              <div className="grid grid-cols-6 w-full text-center font-bold ">
                <div className="col-span-2"></div>
                <div className="col-span-2">Detail</div>
                <div className="col-span-2">Time</div>
              </div>
            </div>
            <div className="card w-full  justify-center ">
              <OrderList
                value={activitiesTypeGroups}
                itemTemplate={itemTemplateGroups}
              ></OrderList>
            </div>
          </div>
        </div>
        <CreateGroupButton />
      </div>
    );
  }
}

export default RecentActivitiesCard;
