import React, { useState, useEffect } from "react";
import { OrderList } from "primereact/orderlist";
import { Avatar } from "primereact/avatar";
import { ProgressBar } from "primereact/progressbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import NavBar from "../Coponents/navbars/NavBar";
import CreateGroupButton from "../Coponents/GroupsComponents/CreateGroupButton";
import { Modal, Box } from "@mui/material";


function UserAchievemeant() {
  const [activeUser, setActiveUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    return user;
  });
  const [userAchievements, setUserAchievements] = useState(
    activeUser.userAchievements
  );
  //מודל מידע ראשוני
  const [displayPopUp, setDisplayPopUp] = useState(true);
  // when pop-up is closed this function triggers
  const closePopUp = () => {
    // setting key "seenPopUp" with value true into localStorage
    localStorage.setItem("seenPopUpAchievements", true);
    // setting state to false to not display pop-up
    setDisplayPopUp(false);
  };

  // check if  user seen and closed the pop-up
  useEffect(() => {
    // getting value of "seenPopUp" key from localStorage
    let returningUser = localStorage.getItem("seenPopUpAchievements");
    // setting the opposite to state, false for returning user, true for a new user
    setDisplayPopUp(!returningUser);
  }, []);
  //אחראי על הסטייל של המודל הראשוני
  const PopUpInfoStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 300,
    height: 400,
    boxShadow: 24,
    padding: 2,
    textAlign: "center",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 0 20px rgba(0,0,0,0.3)",
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
      {/* הצגת המודל הראשוני עם המידע  */}
      <div className=" float-none">
          {displayPopUp && (
            <Modal
              open={true}
              // once pop-up will close "closePopUp" function will be executed
              onClose={closePopUp}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={PopUpInfoStyle}>
                {/* what user will see in the modal is defined below */}
                <img src="https://firebasestorage.googleapis.com/v0/b/regroup-a4654.appspot.com/o/images%2Fachievement.png?alt=media&token=13f69c5c-c5e2-4fe8-a99e-3010975735a0" className=" flex rounded-2xl h-20 w-20 mb-2 mx-auto"/>
                <h1>Your personal achievements</h1>
                <p className="mt-2">
                In certain actions in the app, you gain the accumulated score and show your level in that achievement.
                </p>
                <p className="mt-2">
                Besides the individual achievements you will be able to see your total cumulative score in the student comparison.
                </p>
                <button className="mt-2" onClick={closePopUp}>
                  OK
                </button>
              </Box>
            </Modal>
          )}
        </div>
    <div className="  mt-4 mb-4">
    <div className="rounded-xl flex items-center space-x-2 justify-center text-base align-middle mb-4 ">
    <img className=" w-10 h-10 rounded-full " src="https://firebasestorage.googleapis.com/v0/b/regroup-a4654.appspot.com/o/images%2Fachievement.png?alt=media&token=13f69c5c-c5e2-4fe8-a99e-3010975735a0" alt="Users Recored" />
        {" "}
        <p className=" font-bold text-xl">Achievements</p>
      </div>
      <div className="card w-full justify-center shadow-md">
        <OrderList
        className="h-full max-h-full"
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
