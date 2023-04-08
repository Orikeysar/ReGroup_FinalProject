import { useState,useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

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
  //profile image is clicked
  const handleProfileClick = () => {
    alert('click')
  };
  //navigate
  const auth = getAuth();
  const [value, setValue] = useState(localStorage.getItem("componentChoosen"));
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("componentChoosen", value);
  }, [value]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleFriendNavButton = () => {
    localStorage.setItem("componentChoosen", "FriendsList");
    navigate("/");
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
    navigate("/");
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
        className={`fixed top-0 right-0 h-full w-60 bg-base-100 z-50 shadow-lg transition-transform ${
          isOpen ? "transform translate-x-0" : "transform translate-x-full"
        }`}
      >
        <div className="relative flex justify-center">
          <img
            className="rounded-full cursor-pointer transition duration-300 hover:scale-110 w-20 h-20 ml-4 mt-4"
            src={activeUser.userImg}
            alt="user profile"
            onClick={handleProfileClick}
          />
        </div>{" "}
        <ul className="p-4">
          <li className="mb-2">
            <a  className="btn btn-ghost w-full" value="MyGroupsPage" onClick={handleMyGroupNavButton}>
              My Groups
            </a>
          </li>
          <li className="mb-2">
            <a  className="btn btn-ghost w-full" value="groups" onClick={handleGroupsNavButton}>
              Find Groups
            </a>
          </li>
          <li className="mb-2">
            <a  className="btn btn-ghost w-full" onClick={handleCreateGroupNavButton} value="createGroups">
              Create Group
            </a>
          </li>
          <li className="mb-2">
            <a  className="btn btn-ghost w-full" value="FriendsList"  onClick={handleFriendNavButton}>
              Friends List
            </a>
          </li>
          <li className="mb-2" value="RecentActivities" onClick={handleRecentNavButton}>
            <a  className="btn btn-ghost w-full">
              Recent Activities
            </a>
          </li>
          <li className="mb-2"  onClick={onLogout}>
            <a  className="btn btn-ghost w-full">
              Log Out
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}

export default HamburgerMenu;
