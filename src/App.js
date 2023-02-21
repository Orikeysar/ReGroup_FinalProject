import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import NavBar from "./Coponents/NavBar";
import BottumNavBar from "./Coponents/BottumNavBar";
import Profile from "./Pages/Profile";
import PraivteRoute from "./Coponents/PraivteRoute.jsx";
function App() {
  return (
    <>
      <div className="container">
        <Router>
          <div className="topNavBar w-full ">
           
            <NavBar />
          </div>
          <div className="bodyContent">
            <Routes>
             
              {/* //to render component inside of component and route you need to route inside route */}
          <Route path='/' element={<PraivteRoute/>}>
          <Route path="/" element={<Profile />} />
          </Route>
           
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
            </Routes>
          </div>
        </Router>
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
