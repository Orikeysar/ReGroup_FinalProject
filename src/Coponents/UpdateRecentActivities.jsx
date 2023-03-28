import React, { useState, useEffect } from "react";
import { doc, updateDoc, Timestamp, getDoc } from "firebase/firestore";
import { db } from "../FirebaseSDK";

function UpdateRecentActivities(item, type, user) {
  //בשביל התאריכים
  const now = new Date();
//משיכת לוקאליוזר
  const activeUser = user;
  //קישור לדאטהבייס
  const activeUserRef = doc(db, "users", activeUser.userRef);

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
    activeUser.recentActivities.push(friend);
    console.log(activeUser.recentActivities);
    updateDoc(activeUserRef, {
      recentActivities: activeUser.recentActivities,
    });
    localStorage.setItem("activeUser", JSON.stringify(activeUser));
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
    activeUser.recentActivities.push(LikeOnAnswer);
    console.log(activeUser.recentActivities);
    updateDoc(activeUserRef, {
      recentActivities: activeUser.recentActivities,
    });
    localStorage.setItem("activeUser", JSON.stringify(activeUser));
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
    activeUser.recentActivities.push(LikeOnQuestion);
    console.log(activeUser.recentActivities);
    updateDoc(activeUserRef, {
      recentActivities: activeUser.recentActivities,
    });
    localStorage.setItem("activeUser", JSON.stringify(activeUser));
  }

  //טיפול ביצירת קבוצה
  if (type === "CreatedGroup") {
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
    activeUser.recentActivities.push(CreatedGroup);
    console.log(activeUser.recentActivities);
    updateDoc(activeUserRef, {
      recentActivities: activeUser.recentActivities,
    });
    localStorage.setItem("activeUser", JSON.stringify(activeUser));
  }
  //טיפול הצטרפות לקבוצה
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
    activeUser.recentActivities.push(JoinedGroup);
    console.log(activeUser.recentActivities);
    updateDoc(activeUserRef, {
      recentActivities: activeUser.recentActivities,
    });
    localStorage.setItem("activeUser", JSON.stringify(activeUser));
  }

  //   //טיפול בהוספת חבר
  //   const handleAddFriend = async (item) => {
  //     let friend = {
  //       icon: "https://firebasestorage.googleapis.com/v0/b/regroup-a4654.appspot.com/o/images%2Fadd.png?alt=media&token=719a05da-2530-48b9-9d85-b10357d198ee",
  //       text: "Congrats you and " + item.name + " now friends",
  //       type: "general",
  //       timeStamp: Timestamp.fromDate(
  //         new Date(
  //           now.getFullYear(),
  //           now.getMonth(),
  //           now.getDate(),
  //           now.getHours(),
  //           now.getMinutes()
  //         )
  //       ),
  //     };
  //     activeUser.recentActivities.push(friend);
  //     console.log(activeUser.recentActivities);
  //     await updateDoc(activeUserRef, {
  //       recentActivities: activeUser.recentActivities,
  //     });
  //     localStorage.setItem("activeUser", JSON.stringify(activeUser));
  //   };

  //   //טיפול בקבלת לייק על תשובה
  //   const handleGotLikeOnAnswer = async (item) => {
  //     let LikeOnAnswer = {
  //       icon: "",
  //       text: "",
  //       type: "general",
  //       timeStamp: Timestamp.fromDate(
  //         new Date(
  //           now.getFullYear(),
  //           now.getMonth(),
  //           now.getDate(),
  //           now.getHours(),
  //           now.getMinutes()
  //         )
  //       ),
  //     };
  //     activeUser.recentActivities.push(LikeOnAnswer);
  //     console.log(activeUser.recentActivities);
  //     await updateDoc(activeUserRef, {
  //       recentActivities: activeUser.recentActivities,
  //     });
  //     localStorage.setItem("activeUser", JSON.stringify(activeUser));
  //   };

  //   //טיפול בקבלת לייק על שאלה
  //   const handleGotLikeOnQuestion = async (item) => {
  //     let LikeOnQuestion = {
  //       icon: "",
  //       text: "",
  //       type: "general",
  //       timeStamp: Timestamp.fromDate(
  //         new Date(
  //           now.getFullYear(),
  //           now.getMonth(),
  //           now.getDate(),
  //           now.getHours(),
  //           now.getMinutes()
  //         )
  //       ),
  //     };
  //     activeUser.recentActivities.push(LikeOnQuestion);
  //     console.log(activeUser.recentActivities);
  //     await updateDoc(activeUserRef, {
  //       recentActivities: activeUser.recentActivities,
  //     });
  //     localStorage.setItem("activeUser", JSON.stringify(activeUser));
  //   };
  //   //טיפול ביצירת קבוצה
  //   const handleCreatedGroup = async (item) => {
  //     let CreatedGroup = {
  //       course: item.groupTittle,
  //       subjects: item.groupTags,
  //       icon: "https://console.firebase.google.com/project/regroup-a4654/storage/regroup-a4654.appspot.com/files/~2Fimages",
  //       text: item.description,
  //       type: "groups",
  //       timeStamp: Timestamp.fromDate(
  //         new Date(
  //           now.getFullYear(),
  //           now.getMonth(),
  //           now.getDate(),
  //           now.getHours(),
  //           now.getMinutes()
  //         )
  //       ),
  //     };
  //     activeUser.recentActivities.push(CreatedGroup);
  //     console.log(activeUser.recentActivities);
  //     await updateDoc(activeUserRef, {
  //       recentActivities: activeUser.recentActivities,
  //     });
  //     localStorage.setItem("activeUser", JSON.stringify(activeUser));
  //   };
  //   //טיפול הצטרפות לקבוצה
  //   const handleJoinedGroup = async (item) => {
  //     let JoinedGroup = {
  //       course: item.groupTittle,
  //       subjects: item.groupTags,
  //       icon: "https://firebasestorage.googleapis.com/v0/b/regroup-a4654.appspot.com/o/images%2FjoinGroup.png?alt=media&token=293b90df-3802-4736-b8cc-0d64a8c3faff",
  //       text: item.description,
  //       type: "groups",
  //       timeStamp: Timestamp.fromDate(
  //         new Date(
  //           now.getFullYear(),
  //           now.getMonth(),
  //           now.getDate(),
  //           now.getHours(),
  //           now.getMinutes()
  //         )
  //       ),
  //     };
  //     activeUser.recentActivities.push(JoinedGroup);
  //     console.log(activeUser.recentActivities);
  //     await updateDoc(activeUserRef, {
  //       recentActivities: activeUser.recentActivities,
  //     });
  //     localStorage.setItem("activeUser", JSON.stringify(activeUser));
  //   };

  return null;
}

export default UpdateRecentActivities;
