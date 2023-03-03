import React from "react";
import { useState } from "react";
import { getDoc, doc, collection, getDocs } from "firebase/firestore";
import { db } from "../FirebaseSDK";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";
import { async } from "@firebase/util";
import { modifyUser } from "../asset/CloudFunctions";

function Top10ModalCard() {
  const [activeUser, setActiveUser] = useState(() => {
    // Read the initial value of the user data from localStorage
    const storedactiveUser = localStorage.getItem("activeUser");
    // If there is a stored value, parse it and use it as the initial state
    return JSON.parse(storedactiveUser);
  });

  const [top10list, setTop10list] = useState(() => {
    // Read the initial value of the user data from localStorage
    const storedTop10List = localStorage.getItem("top10");
    // If there is a stored value, parse it and use it as the initial state
    return JSON.parse(storedTop10List);
  });
// const top10list=modifyUser();
  
  
  return (
    <>
      {top10list.map((item) => (
        <tr key={item.email}>
          <th
            className={
              activeUser.email == item.email ? " bg-blue-300" : " bg-white"
            }
          >
            <label>{item.place}</label>
          </th>
          <td
            className={
              activeUser.email == item.email ? " bg-blue-300" : " bg-white"
            }
          >
            <div className="flex items-center space-x-3">
              <div className="avatar">
                <div className="mask mask-squircle w-12 h-12">
                  <img
                    src={
                      activeUser.email == item.email
                        ? activeUser.userImg
                        : item.userImg
                    }
                    alt="error"
                  />
                </div>
              </div>
              <div>
                <div className="font-bold">
                  {activeUser.email == item.email ? activeUser.name : item.name}
                </div>
                <div className="text-sm opacity-50">
                  {activeUser.email == item.email
                    ? activeUser.points
                    : item.points}
                </div>
              </div>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

export default Top10ModalCard;
