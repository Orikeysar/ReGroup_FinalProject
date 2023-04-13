import { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import Logo from "../../asset/ReGroupIcon.png";
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
  //לחיצה על הלוגו
  const handleLogoClick = () => {
    localStorage.setItem("componentChoosen", "UserAchievemeant");
    navigate("/");
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
  const handleRequestsToGroupsNavButton = () => {
    localStorage.setItem("componentChoosen", "requestGroups");
    navigate("/requestGroups");
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
        <ul className="p-4 mt-4">
          <li className="mb-2 border-b-2 border-gray-300">
            <div className="navbar-center">
              <img
                src={Logo}
                alt=""
                className="btn btn-ghost left-0 normal-case w-40   "
                onClick={handleLogoClick}
              ></img>
            </div>
          </li>
          <li>
            <p className="font-semibold">Profile</p>
            <ul>
              <li>
                <p
                  className={`btn btn-ghost w-full ${
                    localStorage.getItem("componentChoosen") === "MyGroupsPage"
                      ? "bg-gray-100"
                      : ""
                  }`}
                  value="MyGroupsPage"
                  onClick={handleMyGroupNavButton}
                >
                  My Groups
                </p>
              </li>
              <li>
                <p
                  className={`btn btn-ghost w-full ${
                    localStorage.getItem("componentChoosen") === "achievements"
                      ? "bg-gray-100"
                      : ""
                  }`}
                  value="achievements"
                  onClick={handleAchievementsNavButton}
                >
                  My Achievements
                </p>
              </li>
              <li>
                <div className="relative">
                  <p
                    className={`btn btn-ghost w-full ${
                      localStorage.getItem("componentChoosen") === "FriendsList"
                        ? "bg-gray-100"
                        : activeUser.friendsListToAccept.length > 0
                        ? "animate-pulse"
                        : ""
                    }`}
                    value="FriendsList"
                    onClick={handleFriendNavButton}
                  >
                    My Friends
                  </p>
                  {activeUser.friendsListToAccept.length > 0 && (
                    <div className="mt-3 absolute top-0 right-0 bg-red-500 rounded-full h-6 w-6 flex items-center justify-center text-white text-xs">
                      {activeUser.friendsListToAccept.length}
                    </div>
                  )}
                </div>
              </li>

              <li>
                <p
                  className={`btn btn-ghost w-full ${
                    localStorage.getItem("componentChoosen") ===
                    "RecentActivities"
                      ? "bg-gray-100"
                      : ""
                  }`}
                  value="RecentActivities"
                  onClick={handleRecentNavButton}
                >
                  Recent Activities
                </p>
              </li>
            </ul>
          </li>
          <li>
            <p className="font-semibold border-t-2 border-gray-300 pt-3">
              Groups
            </p>
            <ul>
              <li>
                <p
                  className={`btn btn-ghost w-full ${
                    localStorage.getItem("componentChoosen") === "groups"
                      ? "bg-gray-100"
                      : ""
                  }`}
                  value="groups"
                  onClick={handleGroupsNavButton}
                >
                  Find Groups
                </p>
              </li>
              <li>
                <p
                  className={`btn btn-ghost w-full ${
                    localStorage.getItem("componentChoosen") === "createGroups"
                      ? "bg-gray-100"
                      : ""
                  }`}
                  onClick={handleCreateGroupNavButton}
                  value="createGroups"
                >
                  Create Group
                </p>
              </li>
              <li>
                <div className="relative">
                  <p
                    className={`btn btn-ghost w-full ${
                      localStorage.getItem("componentChoosen") ===
                      "requestsGroups"
                        ? "bg-gray-100"
                        : activeUser.groupParticipantsToApproval.length > 0
                        ? "animate-pulse"
                        : ""
                    }`}
                    value="requestsGroups"
                    onClick={handleRequestsToGroupsNavButton}
                  >
                    Requests
                  </p>
                  {activeUser.groupParticipantsToApproval.length > 0 && (
                    <div className="mt-3 absolute top-0 right-0 bg-red-500 rounded-full h-6 w-6 flex items-center justify-center text-white text-xs">
                      {activeUser.groupParticipantsToApproval.length}
                    </div>
                  )}
                </div>
              </li>
            </ul>
          </li>
          <li className="mb-1 border-t-2 border-gray-300" onClick={onLogout}>
            <p className="btn btn-ghost w-full bg-red-100 mt-2">Log Out</p>
          </li>
        </ul>
        <p className="border-t-2 border-gray-300">
          {" "}
          &copy; Ori Keysar & Gal Binyamin {new Date().getFullYear()}
        </p>
      </div>
    </>
  );
}

export default HamburgerMenu;
