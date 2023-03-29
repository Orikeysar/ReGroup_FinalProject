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
          userRef:user.uid,
          friendsList: [],
          courses: [],
          alerts: [],
          points: 0,
          recentActivities: [],
          userAchievements: [
            {
              name: "Joined Groups",
              numberOfAchievementDoing: 0,
              activeLevel: 1,
              achievementImg: "https://firebasestorage.googleapis.com/v0/b/regroup-a4654.appspot.com/o/images%2Fjoin.png?alt=media&token=4395691e-43bf-4f76-9dab-a5aae3841bec",
              topLevelOne: 100,
              topLeveTwo: 200,
              topLevelThree: 500,
              valuePerAction: 5,
              actionsNumber:0
            },
            {
              name: "Opened Groups",
              numberOfAchievementDoing: 0,
              activeLevel: 1,
              achievementImg: "https://firebasestorage.googleapis.com/v0/b/regroup-a4654.appspot.com/o/images%2Fteamwork.png?alt=media&token=21523315-cbdc-42e3-b046-2fe14652b1b4",
              topLevelOne: 40,
              topLeveTwo: 100,
              topLevelThree: 200,
              valuePerAction: 10,
              actionsNumber:0
      
            },
            {
              name: "Helped Answered",
              numberOfAchievementDoing: 0,
              activeLevel: 1,
              achievementImg: "https://firebasestorage.googleapis.com/v0/b/regroup-a4654.appspot.com/o/images%2Fhelp.png?alt=media&token=bf9b9c24-fd26-440b-893b-7a68437377fb",
              topLevelOne: 100,
              topLeveTwo: 200,
              topLevelThree: 500,
              valuePerAction: 3,
            },
            {
              name: "Like From Community",
              numberOfAchievementDoing: 0,
              activeLevel: 1,
              achievementImg: "https://firebasestorage.googleapis.com/v0/b/regroup-a4654.appspot.com/o/images%2Fheart.png?alt=media&token=682793cd-cca9-4b4c-8615-d265a5bac2bb",
              topLevelOne: 200,
              topLeveTwo: 500,
              topLevelThree: 1000,
              valuePerAction: 1,
            },
            {
              name: "Community Member",
              numberOfAchievementDoing: 0,
              activeLevel: 1,
              achievementImg: "https://firebasestorage.googleapis.com/v0/b/regroup-a4654.appspot.com/o/images%2Fpeople.png?alt=media&token=9b1c3358-d184-4397-89d8-5898044a3556",
              topLevelOne: 400,
              topLeveTwo: 1000,
              topLevelThree: 1800,
              valuePerAction: 5,
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
