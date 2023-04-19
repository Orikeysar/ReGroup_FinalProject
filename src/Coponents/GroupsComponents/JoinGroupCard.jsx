import React, { useEffect } from "react";
import { useState } from "react";
import { Avatar } from "primereact/avatar";
import { uuidv4 } from "@firebase/util";
import { db, alertGroupEdited } from "../../FirebaseSDK";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { toast } from "react-toastify";
import UserProfileModal from "../UserProfileComponents/UserProfileModal";
import { Dialog } from "primereact/dialog";
import useFindMyGroups from "../../Hooks/useFindMyGroups";
import UpdateRecentActivities from "../UserProfileComponents/UpdateRecentActivities";
import Chip from "@mui/material/Chip";
import randomColor from "randomcolor";
import { useNavigate } from "react-router-dom";
import { FaCircle } from "react-icons/fa";

function JoinGroupCard({ group }) {
  const navigate = useNavigate();
  const date = new Date();
  const [btnStatus, setBtnStatus] = useState(false);
  //איתחול המשתנים שתופסים את הקבוצות ששיכות למשתמש
  let { managerGroup, participantGroup } = useFindMyGroups();
  //אחראי על שינוי הכפתור בשליחת בקשה
  const [isSended, setIsSended] = useState(false);

  //פרטי המשתמש המחובר
  const [activeUser, setActiveUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    return user;
  });

  //מרנדרת את הזמן או לחליפין מראה אייקון פתוח
  const handleGroupTime = (timeStamp) => {
    if (timeStamp != null || timeStamp != undefined) {
      let time = timeStamp.toDate();
      let hours = time.getHours();
      let minutes = time.getMinutes();
      minutes < 10
        ? (time = "start at " + hours + ": 0" + minutes)
        : (time = hours + ":" + minutes);
      //יציג עיגול ירוק עם כיתוב של פתוח עם הזמן הגיע
      console.log(date.getHours());
      if (hours > date.getHours()) {
        return time;
      } else if (hours === date.getHours() && minutes > date.getMinutes()) {
        return time;
      } else {
     
        return (
          <>
            <FaCircle style={{ color: "green", marginRight: "5px" }} />
            <span>Open</span>
          </>
        );
      }
    }
  };
 
  //אחראי על המודל של המשתמש לאחר לחיצה
  const [visible, setVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleUserClick = (id) => {
    setSelectedUserId(id);
    setVisible(true);
  };
  useEffect(() => {
    const isParticipant = group.participants.some(
      (participant) => participant.userRef === activeUser.userRef
    );
    setBtnStatus(isParticipant);
  }, [group.participants, activeUser.userRef]);

  //הצטרפות לקבוצה - רעיון לתת מעבר לעמוד הקבוצה
  const handleJoinGroup = async (group) => {
    if (participantGroup != null) {
      return toast.info(
        "you already participant in group!,evry user can join only one group at time!"
      );
    }
    //לבדוק אם להוריד את המנגאר
    const user = {
      email: activeUser.email,
      name: activeUser.name,
      userImg: activeUser.userImg,
      userRef: activeUser.userRef,
      managerRef: group.managerRef,
      type: "request",
    };
    const docRef = doc(db, "users", group.managerRef);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      let data = docSnap.data();
      data.groupParticipantsToApproval.push(user);
      await setDoc(doc(db, "users", group.managerRef), data);
      const docRefToken = doc(db, "fcmTokens", group.managerRef);
      const docSnapToken = await getDoc(docRefToken);
      if (docSnapToken.exists()) {
        const data = docSnapToken.data();
        const token = data.fcmToken;
        const title = "Group Request  !";
        const message =
          " You got group request accepted from " + activeUser.name;
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
              subject: `Group Request !`,
              email: user.email,
              message:
                " You got group request accepted from " +
                activeUser.name +
                ". you can accept or reject it here : https://regroup-a4654.web.app/requestGroups",
            }),
          }
        )
          .then((response) => response.text())
          .then((data) => console.log(data))
          .then("Request sended")
          .catch((error) => console.error(error));
      }
    } else {
      toast.error("User not found. Please try again later");
    }
    toast.success("Request was sended to the manager");
    setBtnStatus(true);
    setIsSended(true);
  };

  const handleLeaveGroup = async (group) => {
    let groupId = null;
    let newParticipantsList = [];
    group.participants.map((participant) => {
      if (participant.userRef != activeUser.userRef) {
        newParticipantsList.push(participant);
      }
    });
    group.participants = newParticipantsList;

    //בדיקה מה המספר סידורי של הקבוצה בה הוא משתתף
    const q = query(
      collection(db, "activeGroups"),
      where("managerRef", "==", group.managerRef)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots

      groupId = doc.id;
      console.log(doc.id, " => ", doc.data());
    });
    //מעדכן את המשתתפים בקבוצה
    const docRef = doc(db, "activeGroups", groupId);
    await updateDoc(docRef, {
      participants: newParticipantsList,
    });
    UpdateRecentActivities(group, "JoinedGroup", activeUser);
    setBtnStatus(false);
  };

  let btn2 = false;
  return (
    <div className=" w-auto  card h-46 m-2 p-2  overflow-hidden ">
      <p className=" flex mt-1 justify-end ">
        {handleGroupTime(group.timeStamp)}
      </p>
      <div className="flex flex-col lg:flex-col xl:flex-col">
        <div className="lg:ml-2">
          <div className="grid grid-cols-6 gap-2">
            <div className="col-span-2">
              <Avatar image={group.groupImg} size="xlarge" shape="circle" />
            </div>
            <div className="col-span-4 mt-1 font-bold text-lg">
              <p className="mt-3 ml-3">{group.groupTittle}</p>
            </div>
          </div>
          <div className="ml-3 mt-2 flex flex-wrap justify-center text-sm">
            {group.groupTags.map((sub, index) => {
              let color = randomColor({
                luminosity: "light",
                hue: "random",
              });
              return (
                <Chip
                  key={uuidv4()}
                  style={{ backgroundColor: color }}
                  className="mr-2 mt-2 font-bold"
                  variant="outlined"
                  label={sub}
                />
              );
            })}
          </div>
        </div>
        <div className=" border rounded-xl mt-2 mb-2">
          <p className="ml-3 mt-3 text-sm underline">Description:</p>
          <p className="ml-3 mt-3 text-lg text-center">{group.description}</p>
        </div>
        <div className="w-full ">
          <div className="flex flex-wrap lg:flex-nowrap">
            {group.participants.map((participant) => {
              if (participant.userRef === activeUser.userRef) {
                btn2 = true;
              }
              return (
                <Chip
                  key={uuidv4()}
                  avatar={
                    <Avatar
                      size="small"
                      shape="circle"
                      image={participant.userImg}
                    />
                  }
                  onClick={() => handleUserClick(participant.userRef)}
                  color="success"
                  className="mr-2 mb-2"
                  variant="outlined"
                  label={participant.name}
                />
              );
            })}
          </div>
        </div>
        <div className="ml-auto mt-3">
          {isSended ? (
            <div className=" justify-center">
              <button disabled={true} className="btn btn-sm ml-auto">
                Sended
              </button>
            </div>
          ) : group.managerRef === activeUser.userRef ? (
            <div className=" justify-center">
              <button disabled={true} className="btn btn-sm ml-auto">
                You are the manager
              </button>
            </div>
          ) : btnStatus ? (
            <button
              onClick={() => handleLeaveGroup(group)}
              className="btn btn-sm bg-red-600 ml-auto"
            >
              Leave
            </button>
          ) : (
            <button
              onClick={() => handleJoinGroup(group)}
              className="btn btn-sm ml-auto"
            >
              Join
            </button>
          )}
        </div>
      </div>

      {visible && (
        <div>
          {/* המודל של המשתמש שנבחר */}
          <div className="card flex justify-content-center">
            <Dialog
              header="User profile"
              visible={visible}
              onHide={() => setVisible(false)}
              style={{ width: "50vw" }}
              breakpoints={{ "960px": "75vw", "641px": "100vw" }}
            >
              <div className="m-0">
                {/* הפרטים של המשתמש */}
                <UserProfileModal id={selectedUserId} />
              </div>
            </Dialog>
          </div>
        </div>
      )}
    </div>
  );
}

export default JoinGroupCard;
