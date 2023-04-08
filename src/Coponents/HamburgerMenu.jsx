import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [activeUser, setactiveUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    return user;
  });
  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  //profile image is clicked
  const handleProfileClick = () => {
    alert('click')
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
            <a href="#" className="btn btn-ghost w-full">
              My Groups
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="btn btn-ghost w-full">
              Find Groups
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="btn btn-ghost w-full">
              Create Group
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="btn btn-ghost w-full">
              Friends List
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="btn btn-ghost w-full">
              Recent Activities
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="btn btn-ghost w-full">
              Log Out
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}

export default HamburgerMenu;
