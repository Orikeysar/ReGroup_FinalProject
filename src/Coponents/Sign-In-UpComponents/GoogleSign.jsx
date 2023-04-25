import React from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../../FirebaseSDK";
import { toast } from "react-toastify";
import { uuidv4 } from "@firebase/util";
import { FaGoogle } from "react-icons/fa";
import { saveMessagingDeviceToken } from "../../messaging";
import GoogleButton from "react-google-button";

function GoogleSign() {
  const navigate = useNavigate();

  const onGoogleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (!result) {
        toast.error("cound not signin to google");
      }
      const user = result.user;
      //Check for user
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      //Check if user exists,if not, create user
      if (!docSnap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          timeStamp: serverTimestamp(),
          userImg: user.photoURL,
          degree: "",
          userRef: user.uid,
          friendsList: [],
          courses: [],
          alerts: [],
          points: 0,
          recentActivities: [],
          friendsListToAccept: [],
          friendsWaitingToAcceptByAnotherUser:[],
          groupParticipantsToApproval:[],
        });
        //יצירת מערך ההישגים של המשתמש והכנסה לדאטה
        const userAchievements= [
          {
            userId:user.uid,
            name: "Joined Groups",
            numberOfAchievementDoing: 0,
            activeLevel: 1,
            achievementImg:
              "https://firebasestorage.googleapis.com/v0/b/regroup-a4654.appspot.com/o/images%2Fjoin.png?alt=media&token=4395691e-43bf-4f76-9dab-a5aae3841bec",
            valuePerAction: 5,
            actionsNumber: 0,
          },
          {
            userId:user.uid,
            name: "Opened Groups",
            numberOfAchievementDoing: 0,
            activeLevel: 1,
            achievementImg:
              "https://firebasestorage.googleapis.com/v0/b/regroup-a4654.appspot.com/o/images%2Fteamwork.png?alt=media&token=21523315-cbdc-42e3-b046-2fe14652b1b4",
            valuePerAction: 10,
            actionsNumber: 0,
          },
          {
            userId:user.uid,
            name: "Loyal Partner",
            numberOfAchievementDoing: 0,
            activeLevel: 1,
            achievementImg:
              "https://firebasestorage.googleapis.com/v0/b/regroup-a4654.appspot.com/o/images%2Fhelp.png?alt=media&token=bf9b9c24-fd26-440b-893b-7a68437377fb",
            valuePerAction: 3,
            actionsNumber: 0,
          },
          {
            userId:user.uid,
            name: "Participant Review",
            numberOfAchievementDoing: 0,
            activeLevel: 1,
            achievementImg:
              "https://firebasestorage.googleapis.com/v0/b/regroup-a4654.appspot.com/o/images%2Fheart.png?alt=media&token=682793cd-cca9-4b4c-8615-d265a5bac2bb",
            valuePerAction: 0,
            actionsNumber: 0,
          },
          {
            userId:user.uid,
            name: "Community Member",
            numberOfAchievementDoing: 0,
            activeLevel: 1,
            achievementImg:
              "https://firebasestorage.googleapis.com/v0/b/regroup-a4654.appspot.com/o/images%2Fpeople.png?alt=media&token=9b1c3358-d184-4397-89d8-5898044a3556",
            valuePerAction: 5,
            actionsNumber: 0,
          },
        ]
        userAchievements.forEach(item => {
          fetch(
            `https://proj.ruppin.ac.il/cgroup33/prod/api/usersAchievement`,
            {
              method: "POST",
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
          
        });
        //SET USER TOP10
        await setDoc(doc(db, "top10", auth.currentUser.uid), {
          name: user.displayName,
          email: user.email,
          points: 0,
          userImg: user.photoURL,
        });
        toast.success("Build user with google success");
      }
      const docSnapAgain = await getDoc(docRef);
      //Check if user exists,if not, create user
      if (docSnapAgain.exists()) {
        const userData = {
          data: docSnapAgain.data(),
        };

        localStorage.setItem("componentChoosen", "UserAchievemeant");
        localStorage.setItem("activeUser", JSON.stringify(userData.data));
        //GETTING ALL COURSES AND INSERT TO LOCAL STORAGE
        let coursesTempList = [];

        const querySnapshot = await getDocs(collection(db, "courses"));
        if (querySnapshot) {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            coursesTempList.push(doc.data());
          });

          localStorage.setItem("courses", JSON.stringify(coursesTempList));
        }
        //GETTING ALL ACHIEVEMEANTS AND INSERT TO LOCAL STORAGE
        let achievementsTempList = [];
        const querySnapshotAchie = await getDocs(
          collection(db, "achievements")
        );
        if (querySnapshotAchie) {
          querySnapshotAchie.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            achievementsTempList.push(doc.data());
          });

          localStorage.setItem(
            "achievements",
            JSON.stringify(achievementsTempList)
          );
        }
        navigate("/");
        toast.success("Sign in Complete");
        saveMessagingDeviceToken(auth.currentUser.uid);
      } else {
        toast.error("Could not get data from server");
      }
    } catch (error) {
      console.log(error);
      toast.error("Could not Authorize with google");
    }
  };
  return (
    <div className=" ml-6 mr-6">
    <button
      className="google-button rounded-full w-full mt-4"
      onClick={onGoogleClick}

    >
      <img
      className="w-8 h-8 rounded-full  "
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Sign in with Google"
      />{" "}
      Sign in with Google
    </button>
    </div>
  );
}

export default GoogleSign;
