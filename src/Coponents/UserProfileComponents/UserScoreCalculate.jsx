import React, { useState, useEffect } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../FirebaseSDK";

function UserScoreCalculate(type, user, userAchievements, userTopLevelList) {
  //קישור לדאטהבייס
  const userRef = doc(db, "users", user.userRef);
  //קישור לטופ10
  const top10Ref = doc(db, "top10", user.userRef);
  //טיפול בהוספת חבר
  if (type === "Community Member") {
    let item = null;
    let level = null;
    userAchievements.forEach((element) => {
      if (element.name === type) {
        item = element;
      }
    });
    userTopLevelList.forEach((element) => {
      if (element.achievementName === type) {
        level = element;
      }
    });
    item.numberOfAchievementDoing += item.valuePerAction;
    if (
      item.activeLevel === 1 &&
      item.numberOfAchievementDoing >= level.topLevelOne
    ) {
      item.activeLevel = item.activeLevel + 1;
    }
    if (
      item.activeLevel === 2 &&
      item.numberOfAchievementDoing >= level.topLevelTwo
    ) {
      item.activeLevel = item.activeLevel + 1;
    }
    if (
      item.activeLevel === 3 &&
      item.numberOfAchievementDoing >= level.topLevelThree
    ) {
      item.activeLevel = item.activeLevel + 1;
    }
    user.points = user.points + item.valuePerAction;
    updateDoc(userRef, {
      points: user.points,
    });
    updateDoc(top10Ref, {
      points: user.points,
    });
    fetch(
      `https://proj.ruppin.ac.il/cgroup33/prod/api/usersAchievement`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
    return null;
  }

  // השתתפות חבר בקבוצה במלואה
  if (type === "Loyal Partner") {
    let item = null;
    let level = null;
    userAchievements.forEach((element) => {
      if (element.name === type) {
        item = element;
      }
    });
    userTopLevelList.forEach((element) => {
      if (element.achievementName === type) {
        level = element;
      }
    });

    item.numberOfAchievementDoing += item.valuePerAction;
    if (
      item.activeLevel === 1 &&
      item.numberOfAchievementDoing >= level.topLevelOne
    ) {
      item.activeLevel = item.activeLevel + 1;
    }
    if (
      item.activeLevel === 2 &&
      item.numberOfAchievementDoing >= level.topLevelTwo
    ) {
      item.activeLevel = item.activeLevel + 1;
    }
    if (
      item.activeLevel === 3 &&
      item.numberOfAchievementDoing >= level.topLevelThree
    ) {
      item.activeLevel = item.activeLevel + 1;
    }

    user.points = user.points + item.valuePerAction;
    updateDoc(userRef, {
      points: user.points,
    });
    updateDoc(top10Ref, {
      points: user.points,
    });
    fetch(
      `https://proj.ruppin.ac.il/cgroup33/prod/api/usersAchievement`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
    return null;
  }

  // דירוג מנהל קבוצה
  if (type === "Participant Review") {
    let item = null;
    let level = null;
    userAchievements.forEach((element) => {
      if (element.name === type) {
        item = element;
      }
    });
    userTopLevelList.forEach((element) => {
      if (element.achievementName === type) {
        level = element;
      }
    });

    item.numberOfAchievementDoing += item.valuePerAction;
    if (
      item.activeLevel === 1 &&
      item.numberOfAchievementDoing >= level.topLevelOne
    ) {
      item.activeLevel = item.activeLevel + 1;
    }
    if (
      item.activeLevel === 2 &&
      item.numberOfAchievementDoing >= level.topLevelTwo
    ) {
      item.activeLevel = item.activeLevel + 1;
    }
    if (
      item.activeLevel === 3 &&
      item.numberOfAchievementDoing >= level.topLevelThree
    ) {
      item.activeLevel = item.activeLevel + 1;
    }
    user.points = user.points + item.valuePerAction;
    updateDoc(userRef, {
      points: user.points,
    });
    updateDoc(top10Ref, {
      points: user.points,
    });
    fetch(
      `https://proj.ruppin.ac.il/cgroup33/prod/api/usersAchievement`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
    return null;
  }

  //טיפול ביצירת קבוצה
  if (type === "Opened Groups" && userAchievements.length > 0) {
    let item = null;
    let level = null;
    userAchievements.forEach((element) => {
      if (element.name === type) {
        item = element;
      }
    });
    userTopLevelList.forEach((element) => {
      if (element.achievementName === type) {
        level = element;
      }
    });
    item.actionsNumber++;
    if (item.actionsNumber > 4) {
      return null;
    } else {
      item.numberOfAchievementDoing += item.valuePerAction;
      if (
        item.activeLevel === 1 &&
        item.numberOfAchievementDoing >= level.topLevelOne
      ) {
        item.activeLevel = item.activeLevel + 1;
      }
      if (
        item.activeLevel === 2 &&
        item.numberOfAchievementDoing >= level.topLevelTwo
      ) {
        item.activeLevel = item.activeLevel + 1;
      }
      if (
        item.activeLevel === 3 &&
        item.numberOfAchievementDoing >= level.topLevelThree
      ) {
        item.activeLevel = item.activeLevel + 1;
      }
      user.points = user.points + item.valuePerAction;
      updateDoc(userRef, {
        points: user.points,
      });
      updateDoc(top10Ref, {
        points: user.points,
      });
      fetch(
        `https://proj.ruppin.ac.il/cgroup33/prod/api/usersAchievement`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
    return null;
  }

  //טיפול הצטרפות לקבוצה
  if (type === "Joined Groups") {
    let item = null;
    let level = null;
    userAchievements.forEach((element) => {
      if (element.name === type) {
        item = element;
      }
    });
    userTopLevelList.forEach((element) => {
      if (element.achievementName === type) {
        level = element;
      }
    });

    item.actionsNumber++;
    if (item.actionsNumber > 4) {
      return null;
    } else {
      item.numberOfAchievementDoing += item.valuePerAction;
      if (
        item.activeLevel === 1 &&
        item.numberOfAchievementDoing >= level.topLevelOne
      ) {
        item.activeLevel = item.activeLevel + 1;
      }
      if (
        item.activeLevel === 2 &&
        item.numberOfAchievementDoing >= level.topLevelTwo
      ) {
        item.activeLevel = item.activeLevel + 1;
      }
      if (
        item.activeLevel === 3 &&
        item.numberOfAchievementDoing >= level.topLevelThree
      ) {
        item.activeLevel = item.activeLevel + 1;
      }
      user.points = user.points + item.valuePerAction;
      updateDoc(userRef, {
        points: user.points,
      });
      updateDoc(top10Ref, {
        points: user.points,
      });
      fetch(
        `https://proj.ruppin.ac.il/cgroup33/prod/api/usersAchievement`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
    return null;
  }

  return null;
}

export default UserScoreCalculate;
