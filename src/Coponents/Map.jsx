import React, { useEffect, useMemo } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import Spinner from "./Spinner";

export default function SetMap() {
  //מגדיר את האישור שלנו לגוגל מאפס בעזרת האייפיאי
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCt1tGfbI6o0A6dcCFTstFsPlAUEQYaYS4",
  });
  if (!isLoaded) return <Spinner />;
  return <Map />;
}

function Map(props) {
 //החזרת המפה כשהמרכז שלה ( ברירת מחדל ) היא רופין ובתוכה של הסימניות שנרנדר דינמי
  return (
    <>
      <GoogleMap
        zoom={16}
        center={{ lat: 32.342884, lng: 34.912755 }}
        mapContainerClassName=" map-container"
      >
       {props.isMarkerShown && <Marker position={{ lat: 32.342884, lng: 34.912755 }} /> } 
      </GoogleMap>
    </>
  );
}
