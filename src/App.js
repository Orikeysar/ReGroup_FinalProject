import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import FirstSignUpQuestions from "./Pages/FirstSignUpQuestions";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Profile from "./Pages/Profile";
import PraivteRoute from "./Coponents/PraivteRoute.jsx";
<<<<<<< Updated upstream
=======
import ForgotPassword from "./Pages/ForgotPassword";
>>>>>>> Stashed changes
function App() {
  return (
    <>
      <div className="container h-full">
        <Router>
<<<<<<< Updated upstream
          <div className="topNavBar w-full ">
           
            <NavBar />
          </div>
=======
          
>>>>>>> Stashed changes
          <div className="bodyContent">
            <Routes>
             
              {/* //to render component inside of component and route you need to route inside route */}
          <Route path='/' element={<PraivteRoute/>}>
          <Route path="/" element={<Profile />} />
          <Route path="/FirstSignUpQuestions" element={<FirstSignUpQuestions />} />

          </Route>
           
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
            </Routes>
          </div>
        </Router>
<<<<<<< Updated upstream
=======
       
        
>>>>>>> Stashed changes
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <div className="buttomNavBar w-full pb-2 absolute bottom-0">
          <BottumNavBar/>
        </div>
      </div>
    </>
  );
}

export default App;
