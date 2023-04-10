import React, { useState } from "react";
import { OrderList } from "primereact/orderlist";
import { Avatar } from "primereact/avatar";
import { ProgressBar } from "primereact/progressbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import NavBar from "../Coponents/navbars/NavBar";
import CreateGroupButton from "../Coponents/GroupsComponents/CreateGroupButton";


function UserAchievemeant() {
  const [activeUser, setActiveUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    return user;
  });
  const [userAchievements, setUserAchievements] = useState(
    activeUser.userAchievements
  );
  
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
              {userAchive.name}:{" "}
              {Math.floor(
                userAchive.numberOfAchievementDoing / userAchive.valuePerAction
              )}
            </div>

            <div className="card">
              <ProgressBar
                value={
                  (userAchive.numberOfAchievementDoing /
                    currentTopUseForItem(userAchive)) *
                    100 >
                  100
                    ? 100
                    : (
                        (userAchive.numberOfAchievementDoing /
                          currentTopUseForItem(userAchive)) *
                        100
                      ).toFixed(1)
                }
                className="self-center w-full border rounded-xl align-middle "
                displayValueTemplate={valueTemplate}
                aria-valuemax={currentTopUseForItem(userAchive)}
                aria-valuenow={userAchive.numberOfAchievementDoing}
                aria-valuemin={0}
              ></ProgressBar>
            </div>
          </div>

          <div className=" pt-3 text-left self-center sm:align-items-end gap-3 sm:gap-2">
            {userAchive.numberOfAchievementDoing}{" "}
            <FontAwesomeIcon icon={faCoins} />
          </div>
        </div>
      </div>
    );
  };
  return (
    <>
    <div className="topNavBar w-full mb-24">
        <NavBar />
      </div>
    <div className="AchievementsList  mt-4 mb-4">
    <div className="rounded-xl flex items-center space-x-2 justify-center text-base align-middle mb-4 ">
    <img className=" w-10 h-10 rounded-full " src="https://firebasestorage.googleapis.com/v0/b/regroup-a4654.appspot.com/o/images%2Fachievement.png?alt=media&token=13f69c5c-c5e2-4fe8-a99e-3010975735a0" alt="Users Recored" />
        {" "}
        <p className=" font-bold text-xl">Achievements</p>
      </div>
      <div className="card w-full  justify-center shadow-md">
        <OrderList
          value={userAchievements}
          itemTemplate={itemTemplate}
        ></OrderList>
      </div>
    </div>
    <CreateGroupButton/>
    </>
  );
}

export default UserAchievemeant;
