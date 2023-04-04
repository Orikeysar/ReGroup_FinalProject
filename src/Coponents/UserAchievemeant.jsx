import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { OrderList } from "primereact/orderlist";
import { saveMessagingDeviceToken } from "../messaging";
import { TbFriends } from "react-icons/tb";
import { Avatar } from "primereact/avatar";
import { ProgressBar } from "primereact/progressbar";
import { onButtonClick } from "../FirebaseSDK";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../FirebaseSDK";

//render card of friend

function UserAchievemeant() {
  const [componentChoosen, setComponentChoosen] = useState(
    localStorage.setItem("componentChoosen", "/")
  );

  const [activeUser, setActiveUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    return user;
  });
  const [userAchievements, setUserAchievements] = useState(
    activeUser.userAchievements
  );
  const handleClick = async () => {
    saveMessagingDeviceToken(activeUser.userRef);
    const docRef = doc(db, "fcmTokens", activeUser.userRef);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    const token = data.fcmToken;
    onButtonClick(token);
  };
  const currentTopUseForItem = (userAchive) => {
    if (userAchive.activeLevel === 3) {
      return userAchive.topLevelThree;
    } else if (userAchive.activeLevel === 2) {
      return userAchive.topLevelTwo;
    } else {
      return userAchive.topLevelOne;
    }
  };
  const valueTemplate = (value) => {
    return (
      <div className="text-white self-center text-center relative  ">
        <React.Fragment>{value + "%"}</React.Fragment>
      </div>
    );
  };

  const itemTemplate = (userAchive) => {
    return (
      <div className="col-12 mt-4">
        <div className="grid grid-cols-6 gap-3 text-center align-middle ">
          <div className="flex-column col-span-1">
            <Avatar
              image={userAchive.achievementImg}
              size="large"
              shape="circle"
            />
          </div>

          <div className=" align-top text-center flex-col col-span-4 sm:align-items-start gap-3">
            <div className="font-semibold align-top">
              {userAchive.name}: {userAchive.numberOfAchievementDoing}
            </div>

            <div className="card">
              <ProgressBar
                value={
                  (userAchive.numberOfAchievementDoing /
                    currentTopUseForItem(userAchive)) *
                    100 >
                  100
                    ? 100
                    : (userAchive.numberOfAchievementDoing /
                        currentTopUseForItem(userAchive)) *
                      100
                }
                className="self-center w-full border rounded-xl align-middle "
                displayValueTemplate={valueTemplate}
                aria-valuemax={currentTopUseForItem(userAchive)}
                aria-valuenow={userAchive.numberOfAchievementDoing}
                aria-valuemin={0}
              ></ProgressBar>
            </div>
          </div>

          <div className="  text-left self-center sm:align-items-end gap-3 sm:gap-2">
            <button
              className=" btn-xs text-xs w-11 border-gray-500 bg-gray-600 text-white align-middle text-left rounded-md "
              value={userAchive.name}
              onClick={() => handleClick()}
            >
              View
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="AchievementsList  mt-4 mb-4">
      <div className="AchievementsListHeader   mb-4 ">
        <div className="flex  items-center space-x-2 justify-center text-3xl align-middle ">
          <TbFriends className=" mr-2 w-max " />
          <p className=" font-bold text-lg">Achievements List</p>
        </div>
      </div>

      <div className="card w-full  justify-center ">
        <OrderList
          value={userAchievements}
          itemTemplate={itemTemplate}
        ></OrderList>
      </div>
    </div>
  );
}

export default UserAchievemeant;
