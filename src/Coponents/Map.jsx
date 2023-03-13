import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { RiGroup2Fill } from "react-icons/ri";
import Spinner from "./Spinner";
import { formatRelative } from "date-fns";
import { Avatar } from "primereact/avatar";
import CircleIcon from "@mui/icons-material/Circle";
import Circle from "@mui/icons-material/Circle";
import { uuidv4 } from "@firebase/util";

export default function Map({ filteredGroups }) {
  // החזרת המפה כשהמרכז שלה ( ברירת מחדל ) היא רופין ובתוכה של הסימניות שנרנדר דינמי מהדאטה
  const [activeGroups, setActiveGroups] = useState([]);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCt1tGfbI6o0A6dcCFTstFsPlAUEQYaYS4",
  });
  const date = new Date();
  const [center, setCenter] = useState({ lat: 32.342884, lng: 34.912755 });
  const [distance, setDistance] = useState(null);
  //map props
  const [markers, setMarkers] = React.useState([]);
  const [selectedMarker, setSelectedMarker] = React.useState(null);
  // const onMapClick = React.useCallback((e) => {
  //   setMarkers((current) => [
  //     ...current,
  //     {
  //       lat: e.latLng.lat(),
  //       lng: e.latLng.lng(),
  //       time: new Date(),
  //     },
  //   ]);
  // }, []);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [dropdownRef]);

  const handleDropdownClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleDistance = (markerLocation) => {
    navigator.geolocation.getCurrentPosition(function (position) {
      var myLat = position.coords.latitude;
      var myLng = position.coords.longitude;
      // Get the latitude and longitude of the marker
      var markerLat = markerLocation.latitude;
      var markerLng = markerLocation.longitude;

      // Calculate the distance using the Haversine formula
      var R = 6371; // Earth's radius in kilometers
      var dLat = ((markerLat - myLat) * Math.PI) / 180;
      var dLng = ((markerLng - myLng) * Math.PI) / 180;
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((myLat * Math.PI) / 180) *
          Math.cos((markerLat * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c; // Distance in kilometers
      setDistance(d.toFixed(2) + " km");
    });
  };
  const handleMyLocation = () => {
    navigator.geolocation.getCurrentPosition(function (position) {
      var myLat = position.coords.latitude;
      var myLng = position.coords.longitude;
      var newCenter = { lat: myLat, lng: myLng };
      setCenter(newCenter);
      filteredGroups.push({
        groupTittle: "my location",
        location: {
          latitude: myLat,
          longitude: myLng,
        },
        index: filteredGroups.length + 1,
        icon: {
          url: "https://cdn-icons-png.flaticon.com/512/75/75768.png",
          scaledSize: new window.google.maps.Size(45, 45),
        },
      });
    });
  };
  const handleGroupTime = (timeStamp) => {
    let hours = date.getHours(new Date(timeStamp / 1000000));
    let minutes = date.getMinutes(new Date(timeStamp / 1000000));
    console.log(hours);
    console.log(minutes);
    if (hours > date.getHours()) {
      return "<Circle/>";
    }
    if (hours === date.getHours() && minutes > date.getMinutes()) {
      return "<Circle/>";
    }
    return hours + ":" + minutes;
  };
  const handleGroupParticipants = (participants) => {
    return (
      <div className="dropdown">
        <label
          onClick={handleDropdownClick}
          tabIndex={0}
          className="btn btn-xs m-1"
        >
          participants
        </label>
        {showDropdown && (
          <ul
            ref={dropdownRef}
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            {participants.map((user) => {
              return (
                <li
                  key={uuidv4()}
                  className="flex flex-row"
                  onClick={() => console.log("user click")}
                >
                  <Avatar image={user.userImg} size="large" shape="circle" />
                  <label className=" text-md font-bold">{user.name}</label>
                </li>
              );
            })}
            ,
          </ul>
        )}
      </div>
    );
  };

  if (!isLoaded) return <Spinner />;

  return (
    <>
      {distance ? (
        <label className="grid justify-center font-bold text-md mb-3">
          Distance from my location :{distance}{" "}
        </label>
      ) : null}
      <button onClick={handleMyLocation} className="btn btn-xs mb-2">
        my location
      </button>
      <GoogleMap
        zoom={16}
        center={center}
        mapContainerClassName=" map-container"
      >
        {filteredGroups.map((item) => (
          <Marker
            key={item.index}
            title={item.groupTittle}
            position={{
              lat: item.location.latitude,
              lng: item.location.longitude,
            }}
            onClick={() => {
              setSelectedMarker(item);
              handleDistance(item.location);
            }}
            icon={item.groupTittle === "my location" ? item.icon : null}
          />
        ))}
        {selectedMarker ? (
          <InfoWindow
            position={{
              lat: selectedMarker.location.latitude,
              lng: selectedMarker.location.longitude,
            }}
            onCloseClick={() => {
              setSelectedMarker(null);
              setDistance(null);
            }}
          >
            <div className=" w-auto h-46 m-2">
              <p className=" flex mt-1 justify-end ">
                start at {handleGroupTime(selectedMarker.timeStamp.nanoseconds)}
              </p>
              <div className=" flex flex-row">
                <div className=" ml-2">
                  <Avatar
                    image={selectedMarker.groupImg}
                    size="xlarge"
                    shape="circle"
                  />
                </div>
                <div>
                  <p className="ml-3 mt-1 justify-center font-bold text-xl">
                    {selectedMarker.groupTittle}{" "}
                  </p>
                  <p className="ml-3 mt-1 justify-center  text-lg">
                    {selectedMarker.groupTags
                      .map((sub, index) => {
                        // Check if this is the last item in the array
                        const isLast =
                          index === selectedMarker.groupTags.length - 1;
                        // Append a "|" character if this is not the last item
                        const separator = isLast ? "" : " | ";
                        // Return the subject name with the separator character
                        return sub + separator;
                      })
                      .join("")}{" "}
                  </p>
                </div>
              </div>

              <div className=" ml-3 mt-3 text-lg">
                <p>{selectedMarker.description}</p>
                {/* /* <p>time: {formatRelative(selectedMarker.time, new Date())}</p> */}
              </div>
              <div className="flex flex-row ml-3 mt-3">
                <div>
                  {handleGroupParticipants(selectedMarker.participants)}
                </div>
                <div className=" ml-auto justify-end">
                  <button
                    onClick={() => console.log("joined")}
                    className="btn btn-xs  ml-auto mt-1"
                  >
                    Join
                  </button>
                </div>
              </div>
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </>
  );
}
