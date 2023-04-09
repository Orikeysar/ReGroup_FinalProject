import { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import GoogleSign from "../Coponents/GoogleSign";
import Logo from "../asset/ReGroupIcon.png";
import FacebookSign from "../Coponents/FacebookSign";
import { getDoc, doc, collection, getDocs } from "firebase/firestore";
import { db } from "../FirebaseSDK";
import { saveMessagingDeviceToken } from "../messaging";

function SignIn() {
  //SET ICON SHOW PASSWORD
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  //animation logo
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  //SET EMAIL AND PASSWORD IN ONE OBJECT
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  //INSERT INTO THE EMAIL AND PASSWORD VARIABLES
  const { email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      //CHECK WHAT THE ID IN THE INPUT THAT CHANGE AND INSERT USER INPUT
      //LIKE THIS YOU CAN MENAGE setText TOGETHER ON MANY
      [e.target.id]: e.target.value,
    }));
  };
  //When SubmitForm SignIn
  const onSubmit = async (e) => {
    try {
      e.preventDefault();

      const auth = getAuth();
      //פוקנציה קיימת בפיירבייס המחזירה את היוזר והאם הוא קיים או לא.
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential.user) {
        const docRef = doc(db, "users", userCredential.user.uid);
        const docSnap = await getDoc(docRef);
        //Check if user exists,if not, create user
        if (docSnap.exists()) {
          const user = {
            data: docSnap.data(),
          };
          localStorage.setItem("componentChoosen", "UserAchievemeant");
          localStorage.setItem("activeUser", JSON.stringify(user.data));
        } else {
          toast.info("couldnt find data. please try again");
          window.location.reload();
        }
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
        //GETTING TOP10 LIST AND INSERT TO LOCAL STORAGE

        navigate("/");
        toast.success("Sign in Complete");
        saveMessagingDeviceToken(auth.currentUser.uid);
      }
    } catch (eror) {
      toast.error("Bad User Cradintial, try again or SignUp");
    }
  };

  return (
    <div className="pageContainer mt-10">
      <header className=" underline">
        <img
          src={Logo}
          alt=""
          className={`w-60 h-20 ml-16 mb-2 ${isLoaded ? "slide-in" : ""}`}
        />
        <p
          className={`font-semibold text-xl text-center ${
            isLoaded ? "slide-in" : ""
          }`}
        >
          Wellcome !
        </p>
      </header>

      <form onSubmit={onSubmit}>
        <input
          type="email"
          className="ml-16 placeholder:italic placeholder:text-slate-400 block bg-white  border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm mt-4"
          placeholder="Email"
          id="email"
          onChange={onChange}
          value={email}
        />
        <div className="ml-16 mb-4">
          <FontAwesomeIcon
            icon={faEye}
            alt="show password"
            className="showPassword  bg-white  shadow-sm  relative left-1 top-9 btn-ghost btn-circle h-5 w-5"
            //WHEN CLICK THE FUNCTION CHANGE FROM TRUE TO FALSE DEPENDS ON PREVIOUS STATE
            onClick={() => setShowPassword((prevState) => !prevState)}
          />
          <input
            type={showPassword ? "text" : "password"}
            className=" placeholder:italic placeholder:text-slate-400 block bg-white  border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm "
            placeholder="Password"
            id="password"
            value={password}
            onChange={onChange}
          />
        </div>
        <Link
          to="/forgotPassword"
          className="font-semibold text-sm  text-blue-700 mt-4 ml-8 mr-6"
        >
          Fotgot Password? click here
        </Link>

        <div className="mt-4 ml-6 mr-6">
          <button className="font-bold rounded-full btn-primary w-full bg-neutral-focus min-h-12 max-h-12 mt-2">
            Sign in
          </button>
        </div>
      </form>
      {/* Google Oauth Place */}

      <GoogleSign />
      {/* Facebook Oauth Place */}

      {/* <FacebookSign /> */}
      <div className="mt-4 ml-6 mr-6">
        <button className=" rounded-full w-full  min-h-12 max-h-12 mt-2">
          <Link to="/sign-up" className=" w-full register-link ">
            Sign up now
          </Link>
        </button>
      </div>
    </div>
  );
}

export default SignIn;
