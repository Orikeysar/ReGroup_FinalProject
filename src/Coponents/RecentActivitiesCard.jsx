import React from "react";
import { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom"
import { v4 as uuidv4 } from "uuid";
import { FaUserFriends,FaHandshake,BiLike } from 'react-icons/fa';

function RecentActivitiesCard({ type }) {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(() => {
      // Read the initial value of the user data from localStorage
      const storedUserData = localStorage.getItem("userData");
      // If there is a stored value, parse it and use it as the initial state
      return JSON.parse(storedUserData);
    });
    const [activitiesTypeGroups, setActivitiesTypeGroups] = useState([]);
    const [activitiesTypeGeneral, setActivitiesTypeGeneral] = useState([]);
  
    useEffect(() => {
      if (userData && userData.recentActivities) {
        userData.recentActivities.forEach((item) => {
          if (item.type === "groups") {
            setActivitiesTypeGroups((prevState) => [...prevState, item]);
          } else {
            setActivitiesTypeGeneral((prevState) => [...prevState, item]);
          }
        });
      }
    }, []);
  
    console.log(activitiesTypeGroups);
    console.log(activitiesTypeGeneral);
  
    if (type == "General") {
      return (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th></th>
                <th>Description</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {activitiesTypeGeneral.map((item) => (
                <tr key={uuidv4()}>
                  <td>{item.icon}</td>
                  <td>{item.text}</td>
                  <td>{item.timeStamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      return (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>curse</th>
                <th>subjects</th>
                <th>Description</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {activitiesTypeGroups.map((item) => (
                <tr key={uuidv4()}>
                  <td>{item.curse}</td>
                  <td>{item.subjects.map((sub) => sub.name)}</td>
                  <td>{item.text}</td>
                  <td>{item.timeStamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  }
  
  export default RecentActivitiesCard;
  