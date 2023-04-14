import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../FirebaseSDK";
export const useFindMyGroups = () => {
  //מערכים שאליהם נכניס את הקבוצות אחת שהוא מנהל בה והשניה שהוא משתתף בה
  const [managerGroup, setManagerGroup] = useState(null);
  const [participantGroup, setParticipantGroup] = useState(null);

  //מושך מהלוקל את פרטי המשתמש המחובר
  const [activeUser, setActiveUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    return user;
  });
  //אתחול משתמנים לגישה לדאטה
  const [activeGroups, setActiveGroups] = useState([]);
  const colRef = collection(db, "activeGroups");
  const q = query(colRef);

  //מאזין שמושך את הקבוצות הקיימות מהדאטה
  onSnapshot(q, (snapshot) => {
    let newActiveGroups = [];
    snapshot.docs.forEach((doc, index) => {
      newActiveGroups.push({ ...doc.data(), id: doc.id, index });
    });

    if (JSON.stringify(newActiveGroups) !== JSON.stringify(activeGroups)) {
      setActiveGroups(newActiveGroups);
    }
  });

  useEffect(() => {
    //עוברת על כל הקבוצות הקימות ומכניסה לתוך המשתנים שהכנו את הקבוצות השייכות למשתמש
    if (activeGroups != null && activeGroups.length > 0) {
      activeGroups.map((group) => {
        if (group.managerRef === activeUser.userRef) {
          return setManagerGroup(group);
        } else {
          if (group.participants.length > 0) {
            return group.participants.map((participant) => {
              if (participant.userRef === activeUser.userRef) {
               return setParticipantGroup(group);
              }
            })
          }
        }
      });
    }
  }, [activeGroups, activeUser.userRef]);
  return { managerGroup, participantGroup };
};

export default useFindMyGroups;
