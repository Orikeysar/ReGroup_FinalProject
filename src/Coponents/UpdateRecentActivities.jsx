
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../FirebaseSDK";

function UpdateRecentActivities(item, type, user) {
  //בשביל התאריכים
  const now = new Date();
  //קישור לדאטהבייס
  const userRef = doc(db, "users", user.userRef);

  //טיפול בהוספת חבר
  if (type === "friend") {
    let friend = {
      icon: "https://firebasestorage.googleapis.com/v0/b/regroup-a4654.appspot.com/o/images%2Fadd.png?alt=media&token=719a05da-2530-48b9-9d85-b10357d198ee",
      text: "Congrats you and " + item.name + " now friends",
      type: "general",
      timeStamp: Timestamp.fromDate(
        new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          now.getHours(),
          now.getMinutes()
        )
      ),
    };
    user.recentActivities.push(friend);
    console.log(user.recentActivities);
    updateDoc(userRef, {
      recentActivities: user.recentActivities,
    });
  }

  //טיפול בקבלת לייק על תשובה
  if (type === "LikeOnAnswer") {
    let LikeOnAnswer = {
      icon: "",
      text: "",
      type: "general",
      timeStamp: Timestamp.fromDate(
        new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          now.getHours(),
          now.getMinutes()
        )
      ),
    };
    user.recentActivities.push(LikeOnAnswer);
    console.log(user.recentActivities);
    updateDoc(userRef, {
      recentActivities: user.recentActivities,
    });
  }

  //טיפול בקבלת לייק על שאלה
  if (type === "LikeOnQuestion") {
    let LikeOnQuestion = {
      icon: "",
      text: "",
      type: "general",
      timeStamp: Timestamp.fromDate(
        new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          now.getHours(),
          now.getMinutes()
        )
      ),
    };
    user.recentActivities.push(LikeOnQuestion);
    console.log(user.recentActivities);
    updateDoc(userRef, {
      recentActivities: user.recentActivities,
    });
  }

  //טיפול ביצירת קבוצה
  if (type === "CreatedGroups") {
    let CreatedGroup = {
      course: item.groupTittle,
      subjects: item.groupTags,
      icon: "https://console.firebase.google.com/project/regroup-a4654/storage/regroup-a4654.appspot.com/files/~2Fimages",
      text: item.description,
      type: "groups",
      timeStamp: Timestamp.fromDate(
        new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          now.getHours(),
          now.getMinutes()
        )
      ),
    };
    user.recentActivities.push(CreatedGroup);
    console.log(user.recentActivities);
    updateDoc(userRef, {
      recentActivities: user.recentActivities,
    });
  }
  //טיפול עזיבת קבוצה 
  if (type === "JoinedGroup") {
    let JoinedGroup = {
      course: item.groupTittle,
      subjects: item.groupTags,
      icon: "https://firebasestorage.googleapis.com/v0/b/regroup-a4654.appspot.com/o/images%2FjoinGroup.png?alt=media&token=293b90df-3802-4736-b8cc-0d64a8c3faff",
      text: item.description,
      type: "groups",
      timeStamp: Timestamp.fromDate(
        new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          now.getHours(),
          now.getMinutes()
        )
      ),
    };
    user.recentActivities.push(JoinedGroup);
    console.log(user.recentActivities);
    updateDoc(userRef, {
      recentActivities: user.recentActivities,
    });
  }

  return null;
}

export default UpdateRecentActivities;
