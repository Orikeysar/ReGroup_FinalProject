import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { OrderList } from "primereact/orderlist";
import { userDataTest, defultAchievementList } from "../asset/UserDataExample";
import { TbFriends } from "react-icons/tb";
import { Avatar } from "primereact/avatar";
import { ProgressBar } from 'primereact/progressbar';
//render card of friend

function UserAchievemeant() {
  const [userAchievementsDefult, setuserAchievementsDefult] = useState(
    defultAchievementList
  );
   const [userData, setUserData] = useState(userDataTest);
  const [userAchievements, setUserAchievements] = useState(userData.achievementList);
 

  const valueTemplate = (value) => {
    return (
    <div className="text-white self-center text-center relative left-full  ">
      <React.Fragment>
        {value +'%'}
      </React.Fragment></div>
    );
  };

  const itemTemplate = (product) => {



    return (
      <div className="col-12 mt-4">
        <div className="grid grid-cols-6 gap-3 text-left ">
          <div className="flex-column col-span-1">
            
            <Avatar
              image={product.AchievementImg}
              size="normal"
              shape="circle"
            />
          </div>

          <div className=" align-middle text-center flex-col col-span-4 sm:align-items-start gap-3">
            
            <div className="font-semibold align-middle">
              {product.name}: {product.numberOfAchievementDoing}
            </div>
        
    
            <div className="card">
              <ProgressBar
                value={ (( product.numberOfAchievementDoing/product.currentTopUse)*100) >100? 100 :( product.numberOfAchievementDoing/product.currentTopUse)*100 }
              className ="self-center w-full border rounded-xl  "
                displayValueTemplate={valueTemplate}
                aria-valuemax={product.currentTopUse}
                aria-valuenow ={product.numberOfAchievementDoing}
                aria-valuemin = {0}
              ></ProgressBar>
              </div>
          
          </div>

          <div className="flex-column  text-center self-center sm:align-items-end gap-3 sm:gap-2">
            <Button
              className=" btn-xs border-gray-500 bg-gray-600 text-white  rounded-md mb-2"
              value={product.name}
            >
              View
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="AchievementsList  mt-4 mb-4">
      <div className="AchievementsListHeader   mb-4 ">
        <div className="flex  items-center space-x-2 justify-center text-3xl align-middle ">
          <TbFriends className=" mr-2 w-max " />
          <p className=" font-bold text-lg">Achievements List</p>
        </div>
      </div>

      <div className="card w-full justify-center ">
        <OrderList
          value={userAchievements}
          itemTemplate={itemTemplate}
        ></OrderList>
      </div>
    </div>
  );
}

export default UserAchievemeant;
