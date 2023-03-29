import React, { useState, useEffect } from "react";
import { doc, updateDoc} from "firebase/firestore";
import { db } from "../FirebaseSDK";

function UserScoreCalculate(item, type, user) {
  //בשביל התאריכים
  const now = new Date();
  //משיכת לוקאליוזר
  const activeUser = user;
  //קישור לדאטהבייס
  const activeUserRef = doc(db, "users", activeUser.userRef);

  //טיפול בהוספת חבר
  if (type === "friend") {
    item.numberOfAchievementDoing += item.valuePerAction;
    if (
      item.activeLevel === 1 &&
      item.numberOfAchievementDoing >= item.topLevelOne
    ) {
      item.activeLevel = item.activeLevel + 1;
    }
    if (
      item.activeLevel === 2 &&
      item.numberOfAchievementDoing >= item.topLevelTwo
    ) {
      item.activeLevel = item.activeLevel + 1;
    }
    if (
      item.activeLevel === 3 &&
      item.numberOfAchievementDoing >= item.topLevelThree
    ) {
      item.activeLevel = item.activeLevel + 1;
    }
    for (let index = 0; index < activeUser.userAchievements.length; index++) {
      if (activeUser.userAchievements[index].name === "Community Member") {
        activeUser.userAchievements[index] = item;
      }
    }
    console.log(activeUser.userAchievements);
    updateDoc(activeUserRef, {
      userAchievements: activeUser.userAchievements,
    });
    localStorage.setItem("activeUser", JSON.stringify(activeUser));
  }

  //טיפול בקבלת לייק על תשובה
  if (type === "LikeOnAnswer") {
    item.numberOfAchievementDoing += item.valuePerAction;
    if (
      item.activeLevel === 1 &&
      item.numberOfAchievementDoing >= item.topLevelOne
    ) {
      item.activeLevel = item.activeLevel + 1;
    }
    if (
      item.activeLevel === 2 &&
      item.numberOfAchievementDoing >= item.topLevelTwo
    ) {
      item.activeLevel = item.activeLevel + 1;
    }
    if (
      item.activeLevel === 3 &&
      item.numberOfAchievementDoing >= item.topLevelThree
    ) {
      item.activeLevel = item.activeLevel + 1;
    }
    for (let index = 0; index < activeUser.userAchievements.length; index++) {
      if (activeUser.userAchievements[index].name === "Helped Answered") {
        activeUser.userAchievements[index] = item;
      }
    }
    console.log(activeUser.userAchievements);
    updateDoc(activeUserRef, {
      userAchievements: activeUser.userAchievements,
    });
    localStorage.setItem("activeUser", JSON.stringify(activeUser));
  }

  //טיפול בקבלת לייק על שאלה
  if (type === "LikeOnQuestion") {
    item.numberOfAchievementDoing += item.valuePerAction;
    if (
      item.activeLevel === 1 &&
      item.numberOfAchievementDoing >= item.topLevelOne
    ) {
      item.activeLevel = item.activeLevel + 1;
    }
    if (
      item.activeLevel === 2 &&
      item.numberOfAchievementDoing >= item.topLevelTwo
    ) {
      item.activeLevel = item.activeLevel + 1;
    }
    if (
      item.activeLevel === 3 &&
      item.numberOfAchievementDoing >= item.topLevelThree
    ) {
      item.activeLevel = item.activeLevel + 1;
    }
    for (let index = 0; index < activeUser.userAchievements.length; index++) {
      if (activeUser.userAchievements[index].name === "Like From Community") {
        activeUser.userAchievements[index] = item;
      }
    }
    console.log(activeUser.userAchievements);
    updateDoc(activeUserRef, {
      userAchievements: activeUser.userAchievements,
    });
    localStorage.setItem("activeUser", JSON.stringify(activeUser));
  }

  //טיפול ביצירת קבוצה
  if (type === "CreatedGroup") {
    item.actionsNumber += 1;
    if (item.actionsNumber === 3) {
      return null;
    }
    item.numberOfAchievementDoing += item.valuePerAction;
    if (
      item.activeLevel === 1 &&
      item.numberOfAchievementDoing >= item.topLevelOne
    ) {
      item.activeLevel = item.activeLevel + 1;
    }
    if (
      item.activeLevel === 2 &&
      item.numberOfAchievementDoing >= item.topLevelTwo
    ) {
      item.activeLevel = item.activeLevel + 1;
    }
    if (
      item.activeLevel === 3 &&
      item.numberOfAchievementDoing >= item.topLevelThree
    ) {
      item.activeLevel = item.activeLevel + 1;
    }
    for (let index = 0; index < activeUser.userAchievements.length; index++) {
      if (activeUser.userAchievements[index].name === "Opened Groups") {
        activeUser.userAchievements[index] = item;
      }
    }
    console.log(activeUser.userAchievements);
    updateDoc(activeUserRef, {
      userAchievements: activeUser.userAchievements,
    });
    localStorage.setItem("activeUser", JSON.stringify(activeUser));
  }
  //טיפול הצטרפות לקבוצה
  if (type === "JoinedGroup") {
    item.actionsNumber += 1;
    if (item.actionsNumber === 3) {
      return null;
    }
    item.numberOfAchievementDoing += item.valuePerAction;
    if (
      item.activeLevel === 1 &&
      item.numberOfAchievementDoing >= item.topLevelOne
    ) {
      item.activeLevel = item.activeLevel + 1;
    }
    if (
      item.activeLevel === 2 &&
      item.numberOfAchievementDoing >= item.topLevelTwo
    ) {
      item.activeLevel = item.activeLevel + 1;
    }
    if (
      item.activeLevel === 3 &&
      item.numberOfAchievementDoing >= item.topLevelThree
    ) {
      item.activeLevel = item.activeLevel + 1;
    }
    for (let index = 0; index < activeUser.userAchievements.length; index++) {
      if (activeUser.userAchievements[index].name === "Join Groups") {
        activeUser.userAchievements[index] = item;
      }
    }
    console.log(activeUser.userAchievements);
    updateDoc(activeUserRef, {
      userAchievements: activeUser.userAchievements,
    });
    localStorage.setItem("activeUser", JSON.stringify(activeUser));
  }

  return null;
}

export default UserScoreCalculate;
