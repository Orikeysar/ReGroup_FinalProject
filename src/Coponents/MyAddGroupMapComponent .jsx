import React, { useEffect,useState } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import useMoveMarker from "../Hooks/useMoveMarker";
import Spinner from "./Spinner";



//פונקציית המפה  עצמה
function  MapAdd() {

  //מגדיר את האישור שלנו לגוגל מאפס בעזרת האייפיאי
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCt1tGfbI6o0A6dcCFTstFsPlAUEQYaYS4"
  });
  

  

    let [currentCoordinates,setCurrentCoordinates] = useState([32.342884,34.912755 ]);

 
//פונקצייה להזזת המרקר ממקום למקום
function TravellingMarker({ position, ...rest }) {
  let [coordinates, setDestination] = useMoveMarker([
    position.lat,
    position.lng
  ]);

  useEffect(() => {
    setDestination([position.lat, position.lng]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position]);

  return (
    <Marker
      position={{
        lat: coordinates[0],
        lng: coordinates[1]
      }}
      // {...rest}
    />
  );
}


   
 //החזרת המפה כשהמרכז שלה ( ברירת מחדל ) היא רופין ובתוכה של הסימניות שנרנדר דינמי
  return (
    <>{loadError && <p>{loadError}</p>}
    {!isLoaded && <p>Loading .. </p>}
    {isLoaded &&(
      <GoogleMap
        zoom={15}
        center={ {lat: 32.342884, lng: 34.912755 }}
        mapContainerClassName=" map-container"
        onClick={e => {
            setCurrentCoordinates([e.latLng.lat(), e.latLng.lng()]);
          }}
      >
       
      

      <TravellingMarker
              position={{
                lat: currentCoordinates[0],
                lng: currentCoordinates[1]
              }}
          />
    </GoogleMap>
    )}
    </>
  );
}export default MapAdd
