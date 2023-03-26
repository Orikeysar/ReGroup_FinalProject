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
import { db } from "../FirebaseSDK";
import { toast } from "react-toastify";
import { uuidv4 } from "@firebase/util";
import { FaGoogle } from "react-icons/fa";
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
          userRef:user.uid,
          friendsList: [],
          courses: [],
          alerts: [],
          points: 0,
          recentActivities: [],
          userAchievements: [
            {
              name: "Assist Friend",
              numberOfAchievementDoing: 0,
              activeLevel: 1,
              achievementImg:"",
              topLevelOne:100,
              topLeveTwo:200,
              topLevelThree:500,
              valuePerAction: 5


            },
            {
              name: "Open Groups",
              numberOfAchievementDoing: 0,
              activeLevel: 1,
              achievementImg:"",
              topLevelOne:40,
              topLeveTwo:100,
              topLevelThree:200,
              valuePerAction: 10
            },
            {
              name: "Helped Answered",
              numberOfAchievementDoing: 0,
              activeLevel: 1,
              achievementImg:"",
              topLevelOne:100,
              topLeveTwo:200,
              topLevelThree:500,
              valuePerAction: 3
            },
            {
              name: "Like From Community",
              numberOfAchievementDoing: 0,
              activeLevel: 1,
              achievementImg:"",
              topLevelOne:200,
              topLeveTwo:500,
              topLevelThree:1000,
              valuePerAction: 1
            },
          ],
         
        });
        toast.success("Build user with facebook success");
      }

      //Check if user exists,if not, create user
      if (docSnap.exists()) {
        const userData = {
          data: docSnap.data(),
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
         //SET USER TOP10 
        await setDoc(doc(db, "top10",auth.currentUser.uid), {
          name: user.displayName,
          email: user.email,
          points: 0,
          userImg: user.photoURL,
        });
        navigate("/");
        toast.success("Sign in Complete");
      } else {
        toast.error("Could not get data from server");
      }
    } catch (error) {
      console.log(error);
      toast.error("Could not Authorize with google");
    }
  };
  return (
    <div className="socialLogin mb-3 mt-3 text-center w-full">
      <button
        className="socialIconDiv btn-primary w-full min-h-12 max-h-12 bg-red-400"
        onClick={onGoogleClick}
      >
        <p className="text-center">
          {" "}
          Sign in with Google
          <FaGoogle className=" relative left-1/2 w-6 h-6" />{" "}
        </p>
      </button>
    </div>
  );
}

export default GoogleSign;
