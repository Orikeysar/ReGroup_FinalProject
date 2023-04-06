import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../FirebaseSDK";
import {
  setDoc,
  doc,
  serverTimestamp,
  collection,
  getDocs,
} from "firebase/firestore";
import { toast } from "react-toastify";
import GoogleSign from "../Coponents/GoogleSign";
import SelectCheckBox from "../Coponents/SelectCheckBox";
import { uuidv4 } from "@firebase/util";
import { saveMessagingDeviceToken } from "../messaging";


function SignUp() {
  //SET ICON SHOW PASSWORD
  const [showPassword, setShowPassword] = useState(false);
  //SET EMAIL AND PASSWORD IN ONE OBJECT
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    userImg: "",
    userRef:"",
    degree: "",
    friendsList: [],
    courses: [],
    points: 0,
    recentActivities: [],
    friendsListToAccept:[],
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
        topLevelOne: 200,
        topLeveTwo: 400,
        topLevelThree: 800,
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
        valuePerAction: 2,
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
  //INSERT INTO THE EMAIL AND PASSWORD VARIABLES
  const { name, email, password, degree } = formData;

  const navigate = useNavigate();
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,

      //CHECK WHAT THE ID IN THE UNPUT THAT CHANGE AND INSERT USER INPUT
      //LIKE THIS YOU CAN MENAGE setText TOGETHER ON MANY TARGETS
      [e.target.id]: e.target.value,
    }));
  };
  //SUBMIT THE FORM WHEN CLICKING ON SIGN UP BUTTON
  //FUNCTION RGISTER USER IN TO DATABASE
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
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
      const querySnapshotAchie = await getDocs(collection(db, "achievements"));
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

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      updateProfile(auth.currentUser, { displayName: name });

      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timeStamp = serverTimestamp();
      formDataCopy.userRef=user.uid;

      await setDoc(doc(db, "users", user.uid), formDataCopy);
      //SET USER TOP10
      await setDoc(doc(db, "top10", auth.currentUser.uid), {
        name: formDataCopy.name,
        email: formDataCopy.email,
        points: formDataCopy.points,
        userImg: formDataCopy.userImg,
      });

      localStorage.setItem("componentChoosen", "UserAchievemeant");
      localStorage.setItem("activeUser", JSON.stringify(formDataCopy));
      navigate("/");
      saveMessagingDeviceToken(auth.currentUser.uid);
    } catch (error) {
      toast.error("Bad Cardictionals details,try again");
    }
  };

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">hedear!</p>
      </header>

      <form onSubmit={onSubmit} className=" place-content-center">
        {/* INSERT NAME */}
        <div>
          <label className="label">
            <span className="label-text">Your Name</span>
          </label>
          <label className="input-group">
            <span className="w-24">Name</span>
            <input
              id="name"
              type="text"
              placeholder="Name"
              onChange={onChange}
              value={name}
              className="nameInput input input-bordered"
            />
          </label>
        </div>
        {/* IMSERT EMAIL */}
        <div>
          <label className="label">
            <span className="label-text">Your Email</span>
          </label>
          <label className="input-group ">
            <span className="w-24">Email</span>
            <input
              id="email"
              type="email"
              placeholder="Email"
              onChange={onChange}
              value={email}
              className="emailInput input input-bordered"
            />
          </label>
        </div>
        {/* INPUT PASSWORD */}
        <div className="passwordInputDiv">
          <label className="label">
            <span className="label-text">Your Password</span>
          </label>

          <label className="input-group max-w-100px">
            <span>Password</span>
            <div className="">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={onChange}
                value={password}
                className="passwordInput input input-bordered "
              />
              <FontAwesomeIcon
                icon={faEye}
                alt="show password"
                className="showPassword  bg-white  shadow-sm  relative right-6 btn-ghost btn-circle h-5 w-5"
                //WHEN CLICK THE FUNCTION CHANGE FROM TRUE TO FALSE DEPENDS ON PREVIOUS STATE
                onClick={() => setShowPassword((prevState) => !prevState)}
              />
            </div>
          </label>

          {/* DEGREE INPUT */}

          <div>
            <label className="label">
              <span className="label-text">Your degree</span>
            </label>
            <label className="input-group">
              <span className="w-24">Degree</span>
              <input
                id="degree"
                type="text"
                placeholder="Degree"
                onChange={onChange}
                value={degree}
                className="degreeInput input input-bordered"
              />
            </label>
          </div>
        </div>

        <div className="signUpBar">
          <button className="signUpButton btn-primary w-full bg-neutral-focus min-h-12 max-h-12 mt-2">
            Sign up
          </button>
        </div>
      </form>
      {/* Google Oauth Place */}
      <GoogleSign />

      <Link to="/sign-in" className="registerLink link-primary underline">
        Sign In Insted{" "}
      </Link>
    </div>
  );
}

export default SignUp;
