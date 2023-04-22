import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";
import { db } from "../../FirebaseSDK";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  updateDoc,
  doc,
  getDoc,
  onSnapshot,
  collection,
  getDocs,
  orderBy,
  query,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
function ProfileImgEdit() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState();

  const [activeUser, setactiveUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    return user;
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    // שומר את התמונה החדשה בסטוראג במידה ונשמר שומר את הנתיב בקלאוד דאטה
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = auth.currentUser.uid;

        const storageRef = ref(storage, "images/" + fileName);
        const metadata = {
          contentType: "image/jpeg",
          name: auth.currentUser.uid,
        };
        //מעלה את התמונה לסטורג דאטה
        const uploadTask = uploadBytesResumable(storageRef, image, metadata);
        //בדיקת סטאוטוס העלאה
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
                //עדכון התנתיב של התמונה בקלאוד דאטה
                await updateDoc(userRef, {
                  userImg: downloadURL,
                });
                //update top 10 image in data
                await updateDoc(top10Ref, {
                  userImg: downloadURL,
                });
                const docSnap = await getDoc(userRef);
                //Check if user exists
                if (docSnap.exists()) {
                  const user = {
                    data: docSnap.data(),
                  };
                  localStorage.setItem("componentChoosen", "UserAchievemeant");
                  localStorage.setItem("activeUser", JSON.stringify(user.data));
                  toast.success("image saved and upload to your profile");
 
                  window.location.reload();
                } else {
                  toast.error(
                    "we have problem to locate your user pls sign in and try again"
                  );
                  navigate("/sign-in");
                } 
                // Update the image for all of the user's friends
  activeUser.friendsList.map( (friend) => {
    try {
       UpdateFriendsListImg(friend, downloadURL);
    } catch (error) {
      console.log(`Error updating friend ${friend.userRef}: ${error}`);
    }
  });
              }
            );
          }
        );
      });
    };
if(profileImage !=null || profileImage !== undefined ||profileImage !== ""){
 storeImage(profileImage);
}else{
  toast.info("please choose an image")
}
   
  };

  const UpdateFriendsListImg = async (friend, downloadURL) => {
    if (downloadURL != null || downloadURL != undefined) {
      try {
        console.log("Updating friend with ID:", friend.userRef);
        const fRef = doc(db, "users", friend.userRef)
        // Get the friend's document snapshot
        const docSnapfriend = await getDoc(fRef);
        console.log("docSnapfriend:", docSnapfriend);
        if (docSnapfriend.exists()) {
          let tempFriend = docSnapfriend.data();
  
          // Get the friend's list of friends
          let myFriendFriendsList = tempFriend.friendsList;
  
          // Update the image for the current user in the friend's list of friends
          myFriendFriendsList.forEach((friendToFriend) => {
            if (friendToFriend.userRef === activeUser.userRef) {
              friendToFriend.ImgRef = downloadURL;
            }
          });
  
          // Update the friend's document with the updated friends list
          await updateDoc(doc(db, "users", friend.userRef), {
            friendsList: myFriendFriendsList,
          });
  
          console.log("Friend's image updated");
        } else {
          console.log("No such friend!");
        }
      } catch (error) {
        console.log(`Error updating friend ${friend.userRef}: ${error}`);
        throw error; // rethrow the error so the calling function can handle it
      }
    }
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
