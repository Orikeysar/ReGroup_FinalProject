import React, { useEffect, useMemo, useState } from "react";
import { GoogleMap, useLoadScript, Marker, InfoWindow, } from "@react-google-maps/api";
import { RiGroup2Fill } from "react-icons/ri";
import Spinner from "./Spinner";
import { db } from "../FirebaseSDK";
import {
  onSnapshot,
  doc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { formatRelative } from "date-fns";


export default function Map({ filteredGroups }) {
  // החזרת המפה כשהמרכז שלה ( ברירת מחדל ) היא רופין ובתוכה של הסימניות שנרנדר דינמי מהדאטה
  const [activeGroups, setActiveGroups] = useState([]);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCt1tGfbI6o0A6dcCFTstFsPlAUEQYaYS4",
  });

  //map props
  const [markers, setMarkers] = React.useState([]);
  const [selectedMarker, setSelectedMarker] = React.useState(null);
  const onMapClick = React.useCallback((e) => {
    setMarkers((current) => [
      ...current,
      {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
        time: new Date(),
      },
    ]);
  }, []);

  if (!isLoaded) return <Spinner />;

 
  

  return (
    <>
       <GoogleMap
        zoom={16}
        center={{ lat: 32.342884, lng: 34.912755 }}
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
            }}
          />
        ))}
        {selectedMarker ? (
          <InfoWindow
            position={{ lat: selectedMarker.location.latitude, lng: selectedMarker.location.longitude }}
            onCloseClick={() => {
              setSelectedMarker(null);
            }}
          >
            <div className="m-2">
              <h2>
               
                  title: { selectedMarker.groupTittle}
               </h2>
                <div>subjects: {selectedMarker.groupTags.forEach((tag)=>{
                     <p key={tag}>#{tag}</p>
                })}</div>
                <p>discription: {selectedMarker.description}</p>
                {/* <p>time: {selectedMarker.time.nanoseconds}</p> */}
              
              {/* /* <p>time: {formatRelative(selectedMarker.time, new Date())}</p> */ }
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap> 
      
    </>
  );
}

