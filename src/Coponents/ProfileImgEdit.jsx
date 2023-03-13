import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";
import { db } from "../FirebaseSDK";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { updateDoc, doc, getDoc } from "firebase/firestore";

function ProfileImgEdit() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState();
  const [profileImageUrl, setProfileImageUrl] = useState();

  const onSubmit = async (e) => {
    e.preventDefault();

    // Store image in firebase
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = auth.currentUser.uid;

        const storageRef = ref(storage, "images/" + fileName);
        const metadata = {
          contentType: "image/jpeg",
          name: auth.currentUser.uid,
        };
        //UPLOAD THE FILE
        const uploadTask = uploadBytesResumable(storageRef, image, metadata);
        //CHECK THE UPLOAD STATUS
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            toast.info("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                toast.info("Upload is paused");
                break;
              case "running":
                toast.info("Upload is running");
                break;
              default:
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                console.log("File available at", downloadURL);
                setProfileImageUrl(downloadURL);

                const userRef = doc(db, "users", auth.currentUser.uid);
                const top10Ref = doc(db, "top10", auth.currentUser.uid);
                //update user image in data
                await updateDoc(userRef, {
                  userImg: downloadURL,
                });
                //update top 10 image in data
                await updateDoc(top10Ref, {
                  userImg: downloadURL,
                });
                const docSnap = await getDoc(userRef);
                //Check if user exists,if not, create user
                if (docSnap.exists()) {
                  const user = {
                    data: docSnap.data(),
                  };
                  localStorage.setItem("componentChoosen", "UserAchievemeant");
                  localStorage.setItem("activeUser", JSON.stringify(user.data));
                  toast.success("image saved and upload to your profile");

                  window.location.reload();
                }
              }
            );
          }
        );
      });
    };

    storeImage(profileImage);

    // Update user Image
  };

  const onMutate = (e) => {
    // Files
    if (e.target.files) {
      setProfileImage(e.target.files[0]);
    }
  };

  return (
    <div className="container text-center  ">
      {/* The button to open modal */}

      <div>
        <main className=" text-center border w-full">
          <form onSubmit={onSubmit}>
            <p className="imagesInfo">The image will be the cover.</p>
            <input
              className="formInputFile mb-4 mt-4 border "
              type="file"
              id="images"
              onChange={onMutate}
              max="1"
              accept=".jpg,.png,.jpeg"
              required
            />
            <div>
              <button type="submit" onClick={onSubmit} className="btn">
                Select file
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default ProfileImgEdit;
