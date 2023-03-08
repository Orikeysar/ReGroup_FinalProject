import React, { useEffect, useState } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import Spinner from "./Spinner";

function Map() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCt1tGfbI6o0A6dcCFTstFsPlAUEQYaYS4",
  });

  const [currentCoordinates, setCurrentCoordinates] = useState([
    32.342884, 34.912755,
  ]);
  const [allGroups, setAllGroups] = useState([{lat: 32.342884, lng: 34.912755 },{lat: 32.142884, lng: 34.712755 },{lat: 32.942884, lng: 34.112755 }]);
  //פונקצייה להזזת המרקר ממקום למקום
  function ArrayAllGroups({ allGroups,position }) {
    useEffect(() => {
      allGroups.map((marker) => {
        return (
          <Marker
            position={{
              lat: marker.lat,
              lng: marker.lng,
            }}

            // {...rest}
          />
        );
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  }

  //החזרת המפה כשהמרכז שלה ( ברירת מחדל ) היא רופין ובתוכה של הסימניות שנרנדר דינמי
  return (
    <>
      {/* //מגדיר את האישור שלנו לגוגל מאפס בעזרת האייפיאי */}
      {loadError && <p>{loadError}</p>}
      {!isLoaded && <p>Loading .. </p>}
      {isLoaded && (
        <GoogleMap
          zoom={16}
          center={{ lat: 32.342884, lng: 34.912755 }}
          mapContainerClassName=" map-container"
        >
          <ArrayAllGroups arrayallgroups={ArrayAllGroups}  />
        </GoogleMap>
      )}
    </>
  );
}

export default Map;
