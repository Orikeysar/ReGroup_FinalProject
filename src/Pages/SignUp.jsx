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
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import GoogleSign from "../Coponents/GoogleSign";

function SignUp() {
  //SET ICON SHOW PASSWORD
  const [showPassword, setShowPassword] = useState(false);
  //SET EMAIL AND PASSWORD IN ONE OBJECT
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    userImg: "",
    Degree: "",
    firstLogIn: "",
    friendsList: [],
    points: 0,
    userAchievements:[],
    recentActivitiesGroups:[],
    recentActivitiesGeneral:[],


  });
  //INSERT INTO THE EMAIL AND PASSWORD VARIABLES
  const { name, email, password } = formData;
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

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      updateProfile(auth.currentUser, { displayName: name });

      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, "users", user.uid), formDataCopy);

      navigate("/");
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

           {/* INPUT IMAGES */}
          <div>
          <label className="label">
            <span className="label-text">Insert Profile Image</span>
          </label>
         
          <label className="input-group ">
           
            <input
               id='images'
              type="file"
              placeholder="Email"
              onChange={onChange}
              value={email}
              max='1'
            accept='.jpg,.png,.jpeg'
            multiple
            required
              className="file-input file-input-bordered w-full max-w-xs"
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
