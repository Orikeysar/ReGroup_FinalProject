import React, { useEffect, useMemo, useState } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
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

export default function Map() {
  // החזרת המפה כשהמרכז שלה ( ברירת מחדל ) היא רופין ובתוכה של הסימניות שנרנדר דינמי מהדאטה
  const [activeGroups, setActiveGroups] = useState([]);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCt1tGfbI6o0A6dcCFTstFsPlAUEQYaYS4",
  });
  
  if (!isLoaded) return <Spinner />;

  const colRef = collection(db, "activeGroups");
  const q = query(colRef);

  onSnapshot(q, (snapshot) => {
    let newActiveGroups = [];
    snapshot.docs.forEach((doc, index) => {
      newActiveGroups.push({ ...doc.data(), id: doc.id, index });
    });
    if (JSON.stringify(newActiveGroups) !== JSON.stringify(activeGroups)) {
      setActiveGroups(newActiveGroups);
    }
  });
  

  return (
    <>
       <GoogleMap
        zoom={16}
        center={{ lat: 32.342884, lng: 34.912755 }}
        mapContainerClassName=" map-container"
      >
        {activeGroups.map((item) => (
          <Marker
            key={item.index}
            title={item.groupTittle}
            position={{
              lat: item.location.latitude,
              lng: item.location.longitude,
            }}            
          />
        ))}
      </GoogleMap> 
      
    </>
  );
}
