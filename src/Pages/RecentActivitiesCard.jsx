import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { RxCounterClockwiseClock } from "react-icons/rx";
import { Avatar } from "primereact/avatar";
import { OrderList } from "primereact/orderlist";
import { Timestamp } from "firebase/firestore";
import NavBar from "../Coponents/navbars/NavBar";
import CreateGroupButton from "../Coponents/GroupsComponents/CreateGroupButton";

function RecentActivitiesCard() {
  const navigate = useNavigate();
  //משיכת המשתמש המחבור מהלוקאל
  const [activeUser, setActiveUser] = useState(() => {
    const storedactiveUser = localStorage.getItem("activeUser");
    return JSON.parse(storedactiveUser);
  });
  //מערכים להפרדה בין מה שבטייפ כללי ומה שבטייפ קבוצות והצבעים של הכפתורים
  const [activitiesTypeGroups, setActivitiesTypeGroups] = useState([]);
  const [activitiesTypeGeneral, setActivitiesTypeGeneral] = useState([]);
  const [btnColorGeneral, setBtnColorGeneral] = useState("btn m-2 text-sm ");
  const [btnColorGroups, setBtnColorGroups] = useState(
    "btn m-2 text-sm  text-black glass"
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
    setBtnColorGroups("btn m-2 text-sm glass text-black");
    setBtnColorGeneral("btn m-2");
    setType("General");
  };
  const handleClickGroups = () => {
    setBtnColorGroups("btn m-2 ");
    setBtnColorGeneral("btn m-2 text-sm glass text-black");
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
        <div className="flex  items-center space-x-2 justify-center text-base align-middle ">
          {" "}
          <RxCounterClockwiseClock className=" mr-2 w-max " />
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
          <p className=" font-bold text-xl">
            {" "}
            There are no recent activities yet
          </p>
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
        <div className="flex  items-center space-x-2 justify-center text-base align-middle ">
          {" "}
          <RxCounterClockwiseClock className=" mr-2 w-max " />
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
        <div className="topNavBar w-full mb-20">
          <NavBar />
        </div>
        <div className="flex  items-center space-x-2 justify-center text-base align-middle ">
          {" "}
          <RxCounterClockwiseClock className=" mr-2 w-max " />
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
