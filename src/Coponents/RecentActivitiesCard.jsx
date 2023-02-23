import React from 'react'
import { useState, useEffect, useNavigate } from 'react';

function RecentActivitiesCard({type}) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(() => {
    // Read the initial value of the user data from localStorage
    const storedUserData = localStorage.getItem("userData");
    // If there is a stored value, parse it and use it as the initial state
    return storedUserData ? JSON.parse(storedUserData) : {};
  });
  const [activitiesTypeGroups, setActivitiesTypeGroups] = useState(([])=>{
    userData.recentActivities.forEach(item => {
        if(item.type=="groups"){
            setActivitiesTypeGroups(item)
        }
    });
    
  });
  const [activitiesTypeGeneral, setActivitiesTypeGeneral] = useState(([])=>{
    userData.recentActivities.forEach(item => {
        if(item.type=="general"){
            setActivitiesTypeGeneral(item)
        }
    });
  });
  

    if(type=="general"){
        return (
            <div className="overflow-x-auto">
          <table className="table w-full">
            {/* head*/}
            <thead>
              <tr>
                <th></th>
                <th>{}</th>
                <th>{}</th>
                <th>{}</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              <tr>
                <th>1</th>
                <td>Cy Ganderton</td>
                <td>Quality Control Specialist</td>
                <td>Blue</td>
              </tr>
              {/* row 2 */}
              <tr className="active">
                <th>2</th>
                <td>Hart Hagerty</td>
                <td>Desktop Support Technician</td>
                <td>Purple</td>
              </tr>
              {/* row 3 */}
              <tr>
                <th>3</th>
                <td>Brice Swyre</td>
                <td>Tax Accountant</td>
                <td>Red</td>
              </tr>
            </tbody>
          </table>
        </div>
          )

    } else {
        return (
            <div className="overflow-x-auto">
          <table className="table w-full">
            {/* head*/}
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Job</th>
                <th>Favorite Color</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              <tr>
                <th>1</th>
                <td>Cy Ganderton</td>
                <td>Quality Control Specialist</td>
                <td>Blue</td>
              </tr>
              {/* row 2 */}
              <tr className="active">
                <th>2</th>
                <td>Hart Hagerty</td>
                <td>Desktop Support Technician</td>
                <td>Purple</td>
              </tr>
              {/* row 3 */}
              <tr>
                <th>3</th>
                <td>Brice Swyre</td>
                <td>Tax Accountant</td>
                <td>Red</td>
              </tr>
            </tbody>
          </table>
        </div>
          )

    }
  

}

export default RecentActivitiesCard