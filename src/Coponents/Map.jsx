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

export default function Map({ filteredGroups }) {
  // החזרת המפה כשהמרכז שלה ( ברירת מחדל ) היא רופין ובתוכה של הסימניות שנרנדר דינמי מהדאטה
  // const [activeGroups, setActiveGroups] = useState([]);
  // const [filteredGroups, setFilteredGroups] = useState(activeGroups);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCt1tGfbI6o0A6dcCFTstFsPlAUEQYaYS4",
  });

  if (!isLoaded) return <Spinner />;

  // const colRef = collection(db, "activeGroups");
  // const q = query(colRef);

  // onSnapshot(q, (snapshot) => {
  //   let newActiveGroups = [];
  //   snapshot.docs.forEach((doc, index) => {
  //     newActiveGroups.push({ ...doc.data(), id: doc.id, index });
  //   });
  //   if (JSON.stringify(newActiveGroups) !== JSON.stringify(activeGroups)) {
  //     setActiveGroups(newActiveGroups);
  //   }
  // });

  // const filterMarkers =()=> {
  //   setFilteredGroups(activeGroups);
  //   if (filtters.course) {
  //     filteredGroups = filteredGroups.filter((group) => group.groupTittle === filtters.course);
  //   }
  //   if (filtters.subjects && filtters.subjects.length > 0) {
  //     filteredGroups = filteredGroups.filter((group) => filtters.subjects.includes(group.subject));
  //   }
  //   if (filtters.number) {
  //     filteredGroups = filteredGroups.filter((group) => group.groupSize === filtters.number);
  //   }
  //   setFilteredGroups(filteredGroups);
  // }
    
  
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
          />
        ))}
      </GoogleMap>
    </>
  );
}
