import React from "react";
import { getDocs,getDoc, doc, collection } from "firebase/firestore";
import { db,alertGroupAdded } from "../FirebaseSDK";

async function SendAlertToUserForNewGroup(selectedCourse, selectedSubjects) {
  //GETTING ALL COURSES USERS ALERTS
  let coursesTempList = [];
  const  querySnapshot =await getDocs(collection(db, "users"));
  const docs = querySnapshot.docs; // convert to array
  docs.forEach((doc) => {
    let user = doc.data();
    let userRef = doc.id;
    if (user.courses) {
      // check if the user has the selected course or selected subjects
      user.courses.forEach((course) => {
        if (
          course.id === selectedCourse ||
          course.subjects.some((subject) => selectedSubjects.includes(subject))
        ) {
          let userAlert = {
            userRef: userRef,
            course: course.id,
            subjects: course.subjects.filter((subject) =>
              selectedSubjects.includes(subject)
            ),
          };
          coursesTempList.push(userAlert);
        }
      });
    }
  });
    // alert the new array after the useEffect finishes
    for (const item of coursesTempList) {
        const docRef = doc(db, "fcmTokens", item.userRef);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        const token = data.fcmToken;
        const title =  "New " + item.course + " Group Just Added";
        const message = "the subject of the group: " + item.subjects.map((sub) => sub + " ");
        const alert={
            token:token,
            title:title,
            message:message
        }
        console.log(alert)
        alertGroupAdded(alert);
      }
    
  return null;
}

export default SendAlertToUserForNewGroup;
