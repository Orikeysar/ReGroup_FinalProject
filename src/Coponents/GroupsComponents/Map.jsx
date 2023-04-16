import React, { useEffect, useState, useRef } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import Spinner from "../Spinner";
import { uuidv4 } from "@firebase/util";
import iconImg from '../../asset/iconImg.jpeg'
import JoinGroupCard from "./JoinGroupCard";

export default function Map({ filteredGroups }) {
  //פרטי המשתמש המחובר
  const [activeUser, setActiveUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    return user;
  });
  // החזרת המפה כשהמרכז שלה ( ברירת מחדל ) היא רופין ובתוכה של הסימניות שנרנדר דינמי מהדאטה
  const [activeGroups, setActiveGroups] = useState([]);
  //אישור מגוגל
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCt1tGfbI6o0A6dcCFTstFsPlAUEQYaYS4",
  });

  //מרכז ברירת המחדל של המפה הוא רופין
  const [center, setCenter] = useState({ lat: 32.342884, lng: 34.912755 });
  //ישמש להצגת המרחק מהמארקר שנלחץ למיקום שלנו
  const [distance, setDistance] = useState(null);
  //מארקרים של המפה
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  //הצגת משתתפים של קבוצה ויצירת הפונקציה שתסגור את הדרופדאון בלחיצה החוצה ותתאים את גודל הכרטיס בהתאם
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  //אחראי על רינדור קבוצות מלאות שאנחנו כן משתתפםי בהם, ואם לא יחזיר ריק
  const handleRenderGroup = (item) => {
    for (let i = 0; i < item.participants.length; i++) {
      if (item.participants[i].userRef === activeUser.userRef) {
        return (
          <Marker
            key={uuidv4()}
            title={item.groupTittle}
            position={offsetCoordinates(
              item.location.latitude,
              item.location.longitude,
              item.index
            )}
            onClick={() => {
              setSelectedMarker(item);
              handleDistance(item.location);
            }}
            icon={item.groupTittle === "my location" ? item.groupImg : null}
          />
        );
      }
    }
  };
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
//אחראי על האייקון של המארקר
const handleIconGroupImg=(group)=>{
  const canvas = document.createElement('canvas');
  canvas.width = 30;
  canvas.height = 30;
  const ctx = canvas.getContext('2d');
  const img1 = new Image();
  img1.crossOrigin = 'anonymous';
  img1.src = group.groupImg;
  img1.onload = () => {
    ctx.drawImage(img1, 0, 0, 15, 30);
    const img2 = new Image();
    img2.crossOrigin = 'anonymous';
    img2.src = iconImg;
    img2.onload = () => {
    ctx.drawImage(img2, 15, 0, 15, 30);
    const icon = canvas.toDataURL();
    return icon;
  }
}
}
  //פונקציה המקבלת את מיקום המארקר שנלחץ, מוצאת את המיקום הנוכחי שלי ומחשבת את המרחק בנינו
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
  //ריכוז המפה למיקום הנוכחי שלי
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
        groupImg: {
          url: "https://cdn-icons-png.flaticon.com/512/75/75768.png",
          scaledSize: new window.google.maps.Size(42, 42),
        },
        groupSize: 1,
        participants: [],
      });
    });
  };
  //מוצא את המיקום של רופין
  const handleRuppinLocation = () => {
    setCenter({ lat: 32.342884, lng: 34.912755 });
  };
  //אם שני מרקרים על אותו המיקום, יזיז את המארקר טיפה הצידה
  const offsetCoordinates = (lat, lng, index) => {
    const offsetAngle = (index * 360) / 10; // Adjust the divisor to change the spacing between markers
    const offsetDistance = 0.0001; // Adjust the value to change the distance between markers

    const newLat =
      lat + offsetDistance * Math.cos((offsetAngle * Math.PI) / 180);
    const newLng =
      lng + offsetDistance * Math.sin((offsetAngle * Math.PI) / 180);

    return { lat: newLat, lng: newLng };
  };

  if (!isLoaded) return <Spinner />;

  return (
    <>
      {distance ? (
        <label className="grid justify-center font-bold text-md mb-3 p-2 rounded-lg shadow-md ">
          Distance from my location :{distance}{" "}
        </label>
      ) : null}
      <button onClick={handleMyLocation} className="btn btn-xs mb-2">
        My location
      </button>
      <button onClick={handleRuppinLocation} className="btn btn-xs mb-2 ml-1">
        Ruppin center
      </button>
      <GoogleMap
        zoom={16}
        center={center}
        mapContainerClassName=" map-container mb-20"
      >
        {filteredGroups.map((item) =>
          item.groupSize > item.participants.length ? (
            // item.groupImg=()=>handleIconGroupImg(item),
            <Marker
              key={uuidv4()}
              title={item.groupTittle}
              position={offsetCoordinates(
                item.location.latitude,
                item.location.longitude,
                item.index
              )}
              onClick={() => {
                setSelectedMarker(item);
                handleDistance(item.location);
              }}
              icon={item.groupTittle==="my location"?item.groupImg:null}
            />
          ) : (
            handleRenderGroup(item)
          )
        )}

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
            <JoinGroupCard group={selectedMarker} />
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </>
  );
}
