import { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { Dialog } from "primereact/dialog";
import UserAchievemeant from "../../Pages/UserAchievemeant";
import Top10Modal from "../top10Components/Top10Modal";
import Top10ModalCard from "../top10Components/Top10ModalCard";

function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeUser, setactiveUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    return user;
  });
  //menu click
  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  //navigate
  const auth = getAuth();
  const [value, setValue] = useState(localStorage.getItem("componentChoosen"));
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("componentChoosen", value);
  }, [value]);

  const handleFriendNavButton = () => {
    localStorage.setItem("componentChoosen", "FriendsList");
    navigate("/myFriends");
  };

  const handleGroupsNavButton = () => {
    localStorage.setItem("componentChoosen", "groups");
    navigate("/findGroups");
  };

  const handleCreateGroupNavButton = () => {
    localStorage.setItem("componentChoosen", "createGroups");
    navigate("/createGroups");
  };

  const handleMyGroupNavButton = () => {
    localStorage.setItem("componentChoosen", "MyGroupsPage");
    navigate("/myGroups");
  };

  const handleRecentNavButton = () => {
    localStorage.setItem("componentChoosen", "RecentActivities");
    navigate("/recentActivities");
  };
  const handleAchievementsNavButton = () => {
    localStorage.setItem("componentChoosen", "achievements");
    navigate("/achievements");
  };
  const onLogout = () => {
    auth.signOut();
    navigate("/sign-in");
  };
  return (
    <>

      <button
        className="btn btn-ghost btn-sm rounded-btn ml-2"
        onClick={handleClick}
      >
        {isOpen ? (
          <HiX className="text-2xl" />
        ) : (
          <HiMenu className="text-2xl" />
        )}
      </button>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClick}
      ></div>
      <div
        className={`fixed top-0 left-0 h-full w-60 bg-base-100 z-50 shadow-lg transition-transform ${
          isOpen ? "transform translate-x-0" : "transform -translate-x-full"
        }`}
      >
        <ul className="p-4 mt-10">
          <li className="mb-2">
            <p
              className={`btn btn-ghost w-full ${
                localStorage.getItem("componentChoosen") === "MyGroupsPage" ? "bg-gray-100" : ""
              }`}
              value="MyGroupsPage"
              onClick={handleMyGroupNavButton}
            >
              My Groups
            </p>
          </li>
          <li className="mb-2">
            <p
              className={`btn btn-ghost w-full ${
                localStorage.getItem("componentChoosen") === "achievements" ? "bg-gray-100" : ""
              }`}
              value="achievements"
              onClick={handleAchievementsNavButton}
            >
             My Achievements
            </p>
          </li>
          <li className="mb-2">
            <p
              className={`btn btn-ghost w-full ${
                localStorage.getItem("componentChoosen") === "FriendsList" ? "bg-gray-100" : ""
              }`}
              value="FriendsList"
              onClick={handleFriendNavButton}
            >
              Friends List
            </p>
          </li>
          <li className="mb-2">
            <p
              className={`btn btn-ghost w-full ${
                localStorage.getItem("componentChoosen") === "groups" ? "bg-gray-100" : ""
              }`}
              value="groups"
              onClick={handleGroupsNavButton}
            >
              Find Groups
            </p>
          </li>
          <li className="mb-2">
            <p
              className={`btn btn-ghost w-full ${
                localStorage.getItem("componentChoosen") === "createGroups" ? "bg-gray-100" : ""
              }`}
              onClick={handleCreateGroupNavButton}
              value="createGroups"
            >
              Create Group
            </p>
          </li>
          <li
            className="mb-2"
            value="RecentActivities"
            onClick={handleRecentNavButton}
          >
            <p className={`btn btn-ghost w-full ${
                localStorage.getItem("componentChoosen") === "RecentActivities" ? "bg-gray-100" : ""
              }`}>Recent Activities</p>
          </li>
          <li className="mb-2" onClick={onLogout}>
            <p className="btn btn-ghost w-full">Log Out</p>
          </li>
        </ul>
      </div>
      
    </>
  );
}

export default HamburgerMenu;
