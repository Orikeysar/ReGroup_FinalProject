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
      <div className="mx-auto">
        <div className="md:w-1/2 mx-auto">
          <div className="card ">
            <div className="card-body flex flex-col items-center">
              <div className=" ml-32">
                <button
                  id="about"
                  className="relative right-0 flex-grow-0 max-h-4 w-5  "
                >
                  {" "}
                  <FiEdit onClick={editImageIconClicked} />
                </button>
              </div>
              <MDBCard key={activeUser.name}>
                <MDBCardBody className="text-center contents">
                  <div className="flex justify-center">
                    <MDBCardImage
                      src={activeUser.userImg}
                      alt="User Image"
                      className="rounded-full w-48 h-48 mb-4 border-slate-600 border-solid border-2"
                      fluid
                    />
                  </div>
                  <div>
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
                    <p className=" text-2xl mb-2">
                      <input
                        type="text"
                        id="name"
                        className={
                          !changeDetails
                            ? "bg-white text-center"
                            : "underline text-center"
                        }
                        disabled={!changeDetails}
                        value={name}
                        onChange={onEdit}
                      />
                    </p>
                  </div>
                  <p className="text-gray-700 text-xl mb-2">
                    {activeUser.email}
                  </p>
                  <p className="text-gray-700 text-xl mb-4">
                    <input
                      type="text"
                      id="degree"
                      className={
                        !changeDetails
                          ? "bg-white text-center"
                          : "underline text-center"
                      }
                      disabled={!changeDetails}
                      value={degree}
                      onChange={onEdit}
                    />
                  </p>
                  <div className="flex justify-center">
                    <MDBBtn outline onClick={onLogout}>
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
