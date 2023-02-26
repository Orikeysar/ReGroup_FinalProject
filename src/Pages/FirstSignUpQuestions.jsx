import React from "react";
import SelectCheckBox from "../Coponents/SelectCheckBox.jsx"
//מציג שאלון ראשוני למשתמש
function FirstSignUpQuestions() {
<<<<<<< Updated upstream
  const onSubmit = () => {};
=======
  // באישור שליחה של המשתמש ניצור אובייקט חדש של יוזר ונעדכן את הלוקל סטורג 
  const onSubmitForm = (event) => {
    event.preventDefault();
    const user = {
      id: userData.id,
      name: name,
      email: userData.email,
      degree: degree,
      friendsList: userData.friendsList,
      courses: selectedCourses,
      firstLogIn: false,
      userImg: img,
      recentActivities:userData.recentActivities
    };
    
    console.log(user)
    localStorage.setItem("userData", JSON.stringify(user));
    navigate("/");

  };
  const navigate = useNavigate();

  const [userData, setUserData] = useState(() => {
    // Read the initial value of the user data from localStorage
    const storedUserData = localStorage.getItem("userData");
    // If there is a stored value, parse it and use it as the initial state
    return storedUserData ? JSON.parse(storedUserData) : {};
  });
  

  const [name, setName] = useState(userData.name);
  const [img, setImg] = useState(userData.userImg);
  const [degree, setDegree] = useState(userData.degree);
  const [selectedCourses, setSelectedCourses] = useState([]);

  const handleSelectedCourses = (selectedCourses) => {
    setSelectedCourses(selectedCourses);
  };
  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handleImgChange = (e) => {
    setImg(e.target.value);
  };
  const handleDegreeChange = (e) => {
    setDegree(e.target.value);
  };


>>>>>>> Stashed changes
  return (
    <div className="hero sizeForm">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl text-gray-600 font-bold">Welcome !</h1>
          <p className="py-6  text-gray-600">
            One more step and you're done. Please fill in the following details:
          </p>
          <form style={{display:"grid"}} onSubmit={onSubmit}>
            <div style={{margin:15,justifySelf:"center", width:290}} className="form-control">
              <label className="input-group input-group-md">
                <span>Full Name</span>
                <input
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered input-md"
                />
              </label>
            </div>
            <div style={{justifySelf:"center",margin:15, width:290}} className=" form-control">
              <label className="input-group input-group-md">
                <span style={{width:96.16}}>Degree</span>
                <input
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered input-md"
                />
              </label>
            </div>
            {/* קריאה לרנדור כל הקורסים שיש בדאטה  */}
            <div style={{margin:15,justifySelf:"center", width:290,}}>
              <SelectCheckBox></SelectCheckBox>
            </div>
            
          </form>
          <button style={{margin:10}} className="btn btn-primary bg-gray-700">submit</button>
        </div>
      </div>
    </div>
  );
}

export default FirstSignUpQuestions;
