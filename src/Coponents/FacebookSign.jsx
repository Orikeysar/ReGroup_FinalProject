import React from "react";
import { FaFacebookF } from "react-icons/fa";
import { uuidv4 } from "@firebase/util";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, FacebookAuthProvider } from "firebase/auth";
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
function FacebookSign() {
  const navigate = useNavigate();

  
  const onFaceBookClick = async () => {
    try {
      const auth = getAuth();
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);

      if (!result) {
        toast.error("cound not signin to facebook");
      }
      // The signed-in user info.

      // This gives you a Facebook Access Token. You can use it to access the Facebook API.

      const credential = FacebookAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;
      const user = result.user;

      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
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
              TopLevelOne:100,
              TopLeveTwo:200,
              TopLevelThree:500,
              valuePerAction: 5


            },
            {
              name: "Open Groups",
              numberOfAchievementDoing: 0,
              activeLevel: 1,
              achievementImg:"",
              TopLevelOne:40,
              TopLeveTwo:100,
              TopLevelThree:200,
              valuePerAction: 10
            },
            {
              name: "Helped Answered",
              numberOfAchievementDoing: 0,
              activeLevel: 1,
              achievementImg:"",
              TopLevelOne:100,
              TopLeveTwo:200,
              TopLevelThree:500,
              valuePerAction: 3
            },
            {
              name: "Like From Community",
              numberOfAchievementDoing: 0,
              activeLevel: 1,
              achievementImg:"",
              TopLevelOne:200,
              TopLeveTwo:500,
              TopLevelThree:1000,
              valuePerAction: 1
            },
          ],
    
        });

        toast.success("Build user with facebook success");
      }
      const docUserRef = doc(db, "users", user.uid);
      const docSnapUser = await getDoc(docUserRef);
      //Check if user exists,if not, create user
      if (docSnapUser.exists()) {
        const userData = {
          id: docSnapUser.uid,
          data: docSnapUser.data(),
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
        await setDoc(doc(db, "top10",uuidv4()), {
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
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = FacebookAuthProvider.credentialFromError(error);
    }
  };

  return (
    <div className="socialLogin mb-3 mt-3 text-center w-full">
      <button
        className="socialIconDiv btn-primary w-full min-h-12 max-h-12 bg-blue-500"
        onClick={onFaceBookClick}
      >
        <p className="text-center">
          Sign in with Facebook
          <FaFacebookF className=" relative left-1/2 w-6 h-6" />
        </p>
      </button>
    </div>
  );
}

export default FacebookSign;
