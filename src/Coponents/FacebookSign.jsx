import React from "react";
import { FaFacebookF } from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
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
       toast.error("cound not signin to facebook")
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
          userAchievements: [
            {
              name: "Assist Friend",
              numberOfAchievementDoing: 0,
              activeLevel: 1,
            },
            {
              name: "Open Groups",
              numberOfAchievementDoing: 0,
              activeLevel: 1,
            },
            {
              name: "Helped Answered",
              numberOfAchievementDoing: 0,
              activeLevel: 1,
            },
            {
              name: "Love From Community",
              numberOfAchievementDoing: 0,
              activeLevel: 1,
            },
          ],
          recentActivitiesGroups: [],
          recentActivitiesGeneral: [],
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
