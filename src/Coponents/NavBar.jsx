import React from "react";
import Logo from "../asset/ReGroupIcon.png";
import { useNavigate } from "react-router-dom";
import Top10Modal from "./Top10Modal";
import HamburgerMenu from "./HamburgerMenu";

function NavBar() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    localStorage.setItem("componentChoosen", "UserAchievemeant");
    navigate("/");
  };

  return (
    <>
      <div
        className="navbar bg-base-100 mb-4 fixed w-full top-0 z-50"
        style={{
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
          padding: "10px",
        }}
      >
        <div className="navbar-start">
        <HamburgerMenu/>

        </div>
        <div className="navbar-center"><img
            src={Logo}
            alt=""
            className="btn btn-ghost left-0 normal-case "
            onClick={handleLogoClick}
          ></img>
          </div>
        <div className="navbar-end ">
          <Top10Modal />
        </div>
      </div>
    </>
  );
}

export default NavBar;
