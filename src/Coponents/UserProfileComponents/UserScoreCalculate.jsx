import React, { useState, useEffect } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../FirebaseSDK";

function UserScoreCalculate(item, type, user) {
  //בשביל התאריכים
  const now = new Date();
  
  //קישור לדאטהבייס
  const userRef = doc(db, "users", user.userRef);
  //קישור לטופ10
  const top10Ref = doc(db, "top10", user.userRef);
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
    for (let index = 0; index < user.userAchievements.length; index++) {
      if (user.userAchievements[index].name === "Community Member") {
        user.userAchievements[index] = item;
      }
    }
    user.points = user.points + item.valuePerAction;
    console.log(user.userAchievements);
    updateDoc(userRef, {
      userAchievements: user.userAchievements,
      points: user.points,
    });
    updateDoc(top10Ref, {
      points: user.points,
    });
    return null

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
    for (let index = 0; index < user.userAchievements.length; index++) {
      if (user.userAchievements[index].name === "Helped Answered") {
        user.userAchievements[index] = item;
      }
    }
    user.points = user.points + item.valuePerAction;
    console.log(user.userAchievements);
    updateDoc(userRef, {
      userAchievements: user.userAchievements,
      points: user.points,
    });
    updateDoc(top10Ref, {
      points: user.points,
    });
    return null

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
    for (let index = 0; index < user.userAchievements.length; index++) {
      if (user.userAchievements[index].name === "Like From Community") {
        user.userAchievements[index] = item;
      }
    }
    user.points = user.points + item.valuePerAction;
    console.log(user.userAchievements);
    updateDoc(userRef, {
      userAchievements: user.userAchievements,
      points: user.points,
    });
    updateDoc(top10Ref, {
      points: user.points,
    });
    return null
  }

  //טיפול ביצירת קבוצה
  if (type === "CreatedGroups") {
    item.actionsNumber ++;
    if (item.actionsNumber > 4) {
      return null;
    } else {
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
      for (let index = 0; index < user.userAchievements.length; index++) {
        if (user.userAchievements[index].name === "Opened Groups") {
          user.userAchievements[index] = item;
        }
      }
      user.points = user.points + item.valuePerAction;
      console.log(user.userAchievements);
      updateDoc(userRef, {
        userAchievements: user.userAchievements,
        points: user.points,
      });
      updateDoc(top10Ref, {
        points: user.points,
      });
    }
    return null;
  }

  //טיפול הצטרפות לקבוצה
  if (type === "JoinedGroup") {
    item.actionsNumber ++;
    if (item.actionsNumber >4 ) {
      return null;
    } else {
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
      for (let index = 0; index < user.userAchievements.length; index++) {
        if (user.userAchievements[index].name === "Join Groups") {
          user.userAchievements[index] = item;
        }
      }
      user.points = user.points + item.valuePerAction;
      console.log(user.userAchievements);
      updateDoc(userRef, {
        userAchievements: user.userAchievements,
        points: user.points,
      });
      updateDoc(top10Ref, {
        points: user.points,
      });
    }
    return null;

  }

  return null;
}

export default UserScoreCalculate;
