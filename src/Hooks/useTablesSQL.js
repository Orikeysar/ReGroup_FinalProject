import { useState, useEffect } from "react";
export const useTablesSQL = () => {
  const [activeUser, setActiveUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    return user;
  });
  const [userAchievements, setUserAchievements] = useState([]);
  const [userTopLevelList, setUserTopLevelList] = useState([]);

  // check if  user seen and closed the pop-up
  useEffect(() => {
    // יבוא כל ההישגים של המשתמש
    fetch(
      `https://proj.ruppin.ac.il/cgroup33/prod/api/usersAchievement/userId/${activeUser.userRef}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setUserAchievements(data);
      })
      .catch((error) => {
        console.error(error);
      });

    // יבוא כל הרמות של ההישגים
    if (userTopLevelList.length === 0) {
      fetch(`https://proj.ruppin.ac.il/cgroup33/prod/api/TopLevelsControler`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUserTopLevelList(data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);
  return { userAchievements, userTopLevelList };
};

export default useTablesSQL;
