import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import GoogleSign from "../Coponents/GoogleSign";
import Logo from "../asset/ReGroupIcon.png";
import FacebookSign from "../Coponents/FacebookSign";
import {
  getDoc,
  doc,
  collection,
  getDocs,} from "firebase/firestore";
import { db } from "../FirebaseSDK";
function SignIn() {
  //SET ICON SHOW PASSWORD
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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
           const user={
            data:docSnap.data()
           } 
          localStorage.setItem("componentChoosen", "UserAchievemeant");
          localStorage.setItem("activeUser",JSON.stringify(user.data))
        } else{
          toast.info("couldnt find data. please try again")
          window.location.reload()
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
  const querySnapshotAchie = await getDocs(collection(db, "achievements"));
  if (querySnapshotAchie) {
    querySnapshotAchie.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      achievementsTempList.push(doc.data());
    });
  
    localStorage.setItem("achievements", JSON.stringify(achievementsTempList));
  }
  //GETTING TOP10 LIST AND INSERT TO LOCAL STORAGE
  
        navigate("/");
        toast.success("Sign in Complete");
      }

    } catch (eror) {
      toast.error("Bad User Cradintial, try again or SignUp");
    }
  };

  return (
    <div className="pageContainer">
      <header className=" underline ">
        <img src={Logo} alt="" className="logo  " />
        <p className="pageHeader text-center">Wellcom to ReGroup!</p>
      </header>

      <form onSubmit={onSubmit}>
        <input
          type="email"
          className="emailInput placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm mt-4"
          placeholder="Email"
          id="email"
          onChange={onChange}
          value={email}
        />
        <div className="passwordInputDiv w-full ">
          <FontAwesomeIcon
            icon={faEye}
            alt="show password"
            className="showPassword  bg-white  shadow-sm  relative left-1 top-9 btn-ghost btn-circle h-5 w-5"
            //WHEN CLICK THE FUNCTION CHANGE FROM TRUE TO FALSE DEPENDS ON PREVIOUS STATE
            onClick={() => setShowPassword((prevState) => !prevState)}
          />
          <input
            type={showPassword ? "text" : "password"}
            className="passwordInput  placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm "
            placeholder="Password"
            id="password"
            value={password}
            onChange={onChange}
          />
        </div>
        <Link to="/forgotPassword" className="forgotPasswordLink btn btn-link">
          Fotgot Password
        </Link>

        <div className="signInBar mb-3 mt-3 text-center w-full">
          <button className="signInButton btn-primary w-full bg-neutral-focus min-h-12 max-h-12 ">
            <p>Sign In</p>
          </button>
        </div>
      </form>
      {/* Google Oauth Place */}

      <GoogleSign />
      {/* Facebook Oauth Place */}

      <FacebookSign />

      <Link to="/sign-up" className="registerLink btn btn-link ">
        Sign Up Insted
      </Link>
    </div>
  );
}

export default SignIn;
