import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { OrderList } from "primereact/orderlist";
import { saveMessagingDeviceToken } from "../messaging";
import { TbFriends } from "react-icons/tb";
import { Avatar } from "primereact/avatar";
import { ProgressBar } from "primereact/progressbar";
import { onButtonClick } from "../FirebaseSDK";
import { getDoc, doc,updateDoc } from "firebase/firestore";
import { db } from "../FirebaseSDK";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { FiEdit } from "react-icons/fi";
import { AiOutlineMail } from "react-icons/ai";
import { BsFilePerson } from "react-icons/bs";
import { FaUniversity } from "react-icons/fa";
import ProfileImgEdit from "../Coponents/ProfileImgEdit";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getAuth, updateProfile } from "firebase/auth";

function UserAchievemeant() {
  const [componentChoosen, setComponentChoosen] = useState(
    localStorage.setItem("componentChoosen", "/")
  );
  const auth = getAuth();
  const navigate = useNavigate();

  const [activeUser, setActiveUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    return user;
  });
  const [userAchievements, setUserAchievements] = useState(
    activeUser.userAchievements
  );
  const handleClick = async () => {
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
  //profile details
  const [changeDetails, setChangeDetails] = useState(false);
  useEffect(() => {
    setComponentChoosen(localStorage.getItem("componentChoosen"));
  });
  
  const onEdit = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  const [formData, setFormData] = useState({
    name: activeUser.name,
    degree: activeUser.degree,
  });
  const { name, degree } = formData;

  //הפונקציה מעלה תמונה לסטורג ושולחת קישור לדאטה בייס
  const onSubmitEdit = async () => {
    try {
      if (activeUser.name !== name || activeUser.degree !== degree) {
        // Update display name in fb
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // Update in firestore
        const userRef = doc(db, "users", auth.currentUser.uid);

        await updateDoc(userRef, {
          name,
          degree,
        });

        const top10Ref = doc(db, "top10", auth.currentUser.uid);
        await updateDoc(top10Ref, {
          name,
        });
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const user = {
            data: docSnap.data(),
          };
          localStorage.setItem("activeUser", JSON.stringify(user.data));
        }

        toast.success("Updated profile details! ");
      }
    } catch (error) {
      console.log(error);
      toast.error("Could not update profile details");
    }
  };
  const editImageIconClicked = () => {
    if (localStorage.getItem("componentChoosen") === "EditImage") {
      localStorage.setItem("componentChoosen", "/");
    } else {
      localStorage.setItem("componentChoosen", "EditImage");
      setComponentChoosen("EditImage");
    }
  };


  return (
    <>
    <div className="row userInfo rounded-xl shadow-md">
        <div className="col-md-4 animated fadeIn " key={activeUser.name}>
          <div className="card ">
            <div className="card-body flex-row ">
              <div className="avatar w-2/5 ">
                <button
                  id="about"
                  className="relative  right-0 flex-grow-0 max-h-4 w-5  "
                >
                  {" "}
                  <FiEdit onClick={editImageIconClicked} />
                </button>
                <div className="w-28 rounded-full object-fill">
                  <img
                    src={activeUser.userImg}
                    className="object-center object-fill"
                    alt="תמונת פרופיל"
                  />
                </div>
              </div>

              <div className="userInfo justify-center w-3/5">
                <div className="flex flex-row-reverse">
                  <button>
                    <FiEdit
                      className="changePersonalDetails  "
                      onClick={() => {
                        changeDetails && onSubmitEdit();
                        setChangeDetails((prevState) => !prevState);
                      }}
                    >
                      {changeDetails ? "done" : "edit"}
                    </FiEdit>
                  </button>
                </div>
                <div className="text-xl text-center bg-transparent flex flex-row">
                  <BsFilePerson className="self-center" />
                  <input
                    type="text"
                    id="name"
                    className={
                      !changeDetails
                        ? "underline w-5/6  ml-4"
                        : "profileName ml-4 w-5/6 "
                    }
                    disabled={!changeDetails}
                    value={name}
                    onChange={onEdit}
                  />
                </div>
                <div className="flex flex-row ">
                  <AiOutlineMail className="self-center" />
                  <p className="card-text ml-4 ">{activeUser.email}</p>
                </div>
                <div className=" flex flex-row">
                  <FaUniversity className="self-center" />
                  <input
                    type="text"
                    id="degree"
                    className={
                      !changeDetails
                        ? "underline w-5/6  ml-4"
                        : "profileName ml-4 w-5/6 "
                    }
                    disabled={!changeDetails}
                    value={degree}
                    onChange={onEdit}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {componentChoosen === "EditImage" ?<ProfileImgEdit />:null}
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
    </>
  );
}

export default UserAchievemeant;
