import React from "react";
import { useState } from "react";
import { Avatar } from "primereact/avatar";
import { uuidv4 } from "@firebase/util";

import UserProfileModal from "../UserProfileComponents/UserProfileModal";
import { Dialog } from "primereact/dialog";
import Chip from "@mui/material/Chip";
import randomColor from "randomcolor";
function GroupInvationsCard({ groupData }) {
  const date = new Date();
  // const handleGroupTime = (timeStamp) => {
  //   if (timeStamp != null || timeStamp != undefined) {
  //     let time = timeStamp.toDate();
  //     let hours = time.getHours();
  //     let minutes = time.getMinutes();
  //     minutes < 10
  //       ? (time = "start at " + hours + ": 0" + minutes)
  //       : (time = hours + ":" + minutes);
  //     //יציג עיגול ירוק עם כיתוב של פתוח עם הזמן הגיע
  //     console.log(date.getHours());
  //     if (hours > date.getHours()) {
  //       return time;
  //     } else if (hours === date.getHours() && minutes > date.getMinutes()) {
  //       return time;
  //     } else {
  //       return (
  //         <>
  //           <FaCircle style={{ color: "green", marginRight: "5px" }} />
  //           <span>Open</span>
  //         </>
  //       );
  //     }
  //   }
  // };
  //אחראי על המודל של המשתמש לאחר לחיצה
  const [visible, setVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleUserClick = (id) => {
    setSelectedUserId(id);
    setVisible(true);
  };

  return (
    <div className=" w-auto h-46 m-2 max-w-full">
      <p className=" flex mt-1 justify-end ">
        {/* {handleGroupTime(groupData.timeStamp)} */}
      </p>
      <div className="flex flex-col lg:flex-row">
        <div className="lg:ml-2">
          <div className="grid grid-cols-6 gap-2">
            <div className="col-span-2">
              <Avatar image={groupData.groupImg} size="xlarge" shape="circle" />
            </div>
            <div className="col-span-4 mt-1 font-bold text-lg">
              <p className="mt-3 ml-3">{groupData.groupTittle}</p>
            </div>
          </div>
          <div className="ml-3 mt-2 flex flex-wrap justify-center text-sm">
            {groupData.groupTags.map((sub, index) => {
              let color = randomColor({
                luminosity: "light",
                hue: "random",
              });
              return (
                <Chip
                  key={uuidv4()}
                  style={{ backgroundColor: color }}
                  className="mr-2 mt-2 font-bold"
                  variant="outlined"
                  label={sub}
                />
              );
            })}
          </div>
        </div>
        <div className="lg:ml-3 mt-3 lg:mt-0 lg:border lg:rounded-lg lg:w-1/3">
          <p className="ml-3 mt-3 text-sm underline">Description:</p>
          <p className="ml-3 mt-3 text-lg text-center">{groupData.description}</p>
        </div>
        <div className="w-full lg:w-1/3 mt-3 lg:mt-0 lg:ml-3">
          <div className="flex flex-wrap lg:flex-nowrap">
            {groupData.participants.map((participant) => {
              return (
                <Chip
                  key={uuidv4()}
                  avatar={
                    <Avatar
                      size="small"
                      shape="circle"
                      image={participant.userImg}
                    />
                  }
                  onClick={() => handleUserClick(participant.userRef)}
                  color="success"
                  className="mr-2 mb-2 lg:mr-0 lg:mb-0"
                  variant="outlined"
                  label={participant.name}
                />
              );
            })}
          </div>
        </div>
      </div>

      {visible && (
        <div>
          {/* המודל של המשתמש שנבחר */}
          <div className="card flex justify-content-center">
            <Dialog
              header="User profile"
              visible={visible}
              onHide={() => setVisible(false)}
              style={{ width: "50vw" }}
              breakpoints={{ "960px": "75vw", "641px": "100vw" }}
            >
              <div className="m-0">
                {/* הפרטים של המשתמש */}
                <UserProfileModal id={selectedUserId} />
              </div>
            </Dialog>
          </div>
        </div>
      )}
    </div>
  );
}

export default GroupInvationsCard;
