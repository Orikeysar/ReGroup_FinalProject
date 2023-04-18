import React from "react";
import { useEffect, useState, useRef } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import useMoveMarker from "../../Hooks/useMoveMarker";
import { GrLocationPin } from "react-icons/gr";
import JoinGroupCard from "./JoinGroupCard";
import { uuidv4 } from "@firebase/util";

//פונקציית המפה  עצמה
function MapAdd({ setCordinates, filteredGroups,fillteredGroupShow }) {
  const [distance, setDistance] = useState(null);
  const [selectedMarker, setSelectedMarker] = React.useState(null);

  const [currentCoordinates, setCurrentCoordinates] = useState([
    32.342884, 34.912755,
  ]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const [mapCenter, setMapCenter] = useState({
    lat: 32.342884,
    lng: 34.912755,
  });
  //מגדיר את האישור שלנו לגוגל מאפס בעזרת האייפיאי
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCt1tGfbI6o0A6dcCFTstFsPlAUEQYaYS4",
  });

 //ריכוז המפה למיקום הנוכחי שלי
 const handleMyLocation = () => {
  navigator.geolocation.getCurrentPosition(function (position) {
    var myLat = position.coords.latitude;
    var myLng = position.coords.longitude;
    var newCenter = { lat: myLat, lng: myLng };
    setMapCenter(newCenter);
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
  setMapCenter({ lat: 32.342884, lng: 34.912755 });
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

  //פונקצייה להזזת המרקר ממקום למקום
  function TravellingMarker({ position, ...rest }) {
    let [coordinates, setDestination] = useMoveMarker([
      position.lat,
      position.lng,
    ]);

    useEffect(() => {
      setDestination([position.lat, position.lng]);
      const handleOutsideClick = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setShowDropdown(false);
        }
      };

      document.addEventListener("mousedown", handleOutsideClick);

      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }, [dropdownRef]);

    return (
      <Marker
        
        position={{
          lat: coordinates[0],
          lng: coordinates[1],
        }}
        // {...rest}
      />
    );
  }
  //check the distance between you to the marker
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
 

  //החזרת המפה כשהמרכז שלה ( ברירת מחדל ) היא רופין ובתוכה של הסימניות שנרנדר דינמי
  return (
    <>
      {loadError && <p>{loadError}</p>}
      {!isLoaded && <p>Loading .. </p>}
      {isLoaded && (
        <div className="w-full mb-2">
          <div className="createGroupMapHeader">
            <button
              onClick={() => {
                setMapCenter({
                  lat: 32.34219292102018,
                  lng: 34.91201501449191,
                });
                setCurrentCoordinates([32.34219292102018, 34.91201501449191]);
                setCordinates({
                  lat: 32.34219292102018,
                  lng: 34.91201501449191,
                });
              }}
              className="btn btn-sm m-2  bg-slate-200 text-black "
            >
              <GrLocationPin className="fill-white" />
              Libary
            </button>
            <button
              onClick={() => {
                setMapCenter({
                  lat: 32.34358598195018,
                  lng: 34.91350448033373,
                });
                setCurrentCoordinates([32.34358598195018, 34.91350448033373]);
                setCordinates({
                  lat: 32.34358598195018,
                  lng: 34.91350448033373,
                });
              }}
              className="btn btn-sm m-2 bg-slate-200 text-black"
            >
              <GrLocationPin className="fill-white" />
              building 5
            </button>
            <button
              onClick={() => {
                setMapCenter({
                  lat: 32.34186000228468,
                  lng: 34.91045634687421,
                });
                setCurrentCoordinates([32.34186000228468, 34.91045634687421]);
                setCordinates({
                  lat: 32.34186000228468,
                  lng: 34.91045634687421,
                });
              }}
              className="btn btn-sm m-2 bg-slate-200 text-black"
            >
              <GrLocationPin className="fill-white" />
              building 20
            </button>
          </div>
<div className="end-3 mb-1"> <button onClick={handleMyLocation} className="btn btn-xs mb-2">
        My location
      </button>
      <button onClick={handleRuppinLocation} className="btn btn-xs mb-2 ml-1">
        Ruppin center
      </button></div>
          <GoogleMap
            zoom={15}
            center={{ lat: 32.342884, lng: 34.912755 }}
            mapContainerClassName=" map-container"
            onClick={(e) => {
              setCurrentCoordinates([e.latLng.lat(), e.latLng.lng()]);
              setCordinates({ lat: e.latLng.lat(), lng: e.latLng.lng() });
            }}
          >
            <TravellingMarker
              position={{
                lat: currentCoordinates[0],
                lng: currentCoordinates[1],
              }}
            />

           {fillteredGroupShow? filteredGroups.map((item) => (
              <Marker
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                  scaledSize: new window.google.maps.Size(50, 50),
                }}
                key={uuidv4()}
                title={item.groupTittle}
                position={{
                  lat: item.location.latitude,
                  lng: item.location.longitude,
                }}
                onClick={() => {
                  setSelectedMarker(item);
                  handleDistance(item.location);
                }}
              />
            )) :  null   }
            
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
               <JoinGroupCard group={selectedMarker}/>
              </InfoWindow>
            ) : null}
          </GoogleMap>
        </div>
      )}
    </>
  );
}
export default MapAdd;
