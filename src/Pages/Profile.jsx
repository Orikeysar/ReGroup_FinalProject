import React from "react";
import { useState, useEffect } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../FirebaseSDK";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../Coponents/GeneralComponents/Spinner";
import { FiEdit } from "react-icons/fi";
import ProfileImgEdit from "../Coponents/UserProfileComponents/ProfileImgEdit";
import { MDBCard, MDBCardBody, MDBCardImage, MDBBtn } from "mdb-react-ui-kit";
function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();

  const [componentChoosen, setComponentChoosen] = useState(
    localStorage.getItem("componentChoosen")
  );
  const [activeUser, setActiveUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    return user;
  });
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: activeUser.name,
    degree: activeUser.degree,
  });
  const { name, degree } = formData;

  useEffect(() => {
    setComponentChoosen(localStorage.getItem("componentChoosen"));
  });

  const onLogout = () => {
    auth.signOut();
    navigate("/sign-in");
  };

  const onEdit = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
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

  if (activeUser == null) {
    return <Spinner />;
  }

  const editImageIconClicked = () => {
    if (localStorage.getItem("componentChoosen") === "EditImage") {
      localStorage.setItem("componentChoosen", "/");
      navigate("/");
    } else {
      localStorage.setItem("componentChoosen", "EditImage");
      setComponentChoosen("EditImage");
      navigate("/");
    }
  };

  return (
    <div className="container">
      <div className="row userInfo">
        <div className="col-md-4 animated fadeIn " key={activeUser.name}>
          <div className="card ">
            <div className="card-body flex-row ">
              <MDBCard key={activeUser.name}>
                <MDBCardBody className="text-center contents">
                  <button
                    id="about"
                    className="relative  right-0 flex-grow-0 max-h-4 w-5  "
                  >
                    {" "}
                    <FiEdit onClick={editImageIconClicked} />
                  </button>
                  <MDBCardImage
                    src={activeUser.userImg}
                    alt="User Image"
                    className=" rounded-full ml-10"
                    style={{ width: "200px", height: "200px" }}
                    fluid
                  />
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
                  <p className="text-gray-600 mb-2 text-2xl ml-2">
                    <input
                      type="text"
                      id="name"
                      className={!changeDetails ? " bg-white text-center" : " underline text-center"}
                      disabled={!changeDetails}
                      value={name}
                      onChange={onEdit}
                    />
                  </p>
                  <p className="text-gray-500 mb-2 text-xl ml-2">
                    {activeUser.email}
                  </p>
                  <p className="text-gray-500 mb-4 text-xl ml-2">
                    <input
                      type="text"
                      id="degree"
                      className={!changeDetails ? "bg-white text-center" : "underline text-center"}
                      disabled={!changeDetails}
                      value={degree}
                      onChange={onEdit}
                    />
                  </p>
                  <div className="d-flex justify-content-center ml-2">
                    <MDBBtn outline className="" onClick={onLogout}>
                      Log Out
                    </MDBBtn>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </div>
          </div>
        </div>
      </div>

      <div className=" mb-4">
        {/* //select between components */}
        {componentChoosen === "EditImage" ? <ProfileImgEdit /> : null}
      </div>
    </div>
  );
}

export default Profile;
