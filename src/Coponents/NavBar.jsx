import React from "react";
import Logo from "../asset/ReGroupIcon.png";
import { useNavigate } from "react-router-dom";
import Top10Modal from "./Top10Modal";
function NavBar() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    localStorage.setItem("componentChoosen", "UserAchievemeant");
    //NEED TO CHECK IF NOT MAKING THE APP SLOWING DOWN
    navigate("/");
  };

  return (
    <>
      <div className="navbar bg-base-100 mb-4">
        <div className="navbar-start">
          <img
            src={Logo}
            alt=""
            className="btn btn-ghost left-0 normal-case border border-gray-400 "
            onClick={handleLogoClick}
          ></img>
        </div>
        <div className="navbar-center"></div>
        <div className="navbar-end">
          <Top10Modal />
          
        </div>
      </div>
    </>
  );
}

export default NavBar;
