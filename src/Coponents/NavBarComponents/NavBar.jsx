import React from "react";
import Logo from "../../asset/ReGroupIcon.png";
import { useNavigate } from "react-router-dom";
import Top10Modal from "../top10Components/Top10Modal";
import HamburgerMenu from "./HamburgerMenu";
import { Dialog } from "primereact/dialog";
import { useState, useEffect } from "react";
import Profile from "../../Pages/Profile";

function NavBar() {
  const navigate = useNavigate();
  const [activeUser, setActiveUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    return user;
  });
  const handleLogoClick = () => {
    localStorage.setItem("componentChoosen", "UserAchievemeant");
    navigate("/");
  };
  
  //אחראי על מודל המשתמש שלוחצים עליו
  const [visible, setVisible] = useState(false);
  const handleUserClick = () => {
    setVisible(true);
  };

  return (
 
    <div className="">
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
            className="btn btn-ghost left-0 normal-case w-40   "
            onClick={handleLogoClick}
          ></img>
          </div>
        <div className="navbar-end ">
        <Top10Modal />
        <div className="relative flex justify-center">
          <img
            className="rounded-full cursor-pointer transition duration-300 hover:scale-110 w-10 h-10 ml-4 "
            src={activeUser.userImg}
            alt={activeUser.name}
            onClick={handleUserClick}
          />
        </div>
        </div>
      </div>
      {visible && (
        <tr>
          <td>
            <div>
              {/* המודל של המשתמש שנבחר */}
              <div className="card flex justify-content-center">
                <Dialog
                  visible={visible}
                  onHide={() => setVisible(false)}
                  style={{ width: "50vw" }}
                  breakpoints={{ "960px": "75vw", "641px": "100vw" }}
                >
                  <div className="m-0">
                    {/* הפרטים של המשתמש */}
                    <Profile/>
                  </div>
                </Dialog>
              </div>
            </div>
          </td>
        </tr>
      )}
      </div>
   
  );
}

export default NavBar;
