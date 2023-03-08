import  { useEffect, useState } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import useMoveMarker from "../Hooks/useMoveMarker";
import { GrLocationPin} from "react-icons/gr";

//פונקציית המפה  עצמה
function MapAdd(setCordinateMarker) {
  const [currentCoordinates, setCurrentCoordinates] = useState([
    32.342884, 34.912755,
  ]);
  const [mapCenter, setMapCenter] = useState({
    lat: 32.342884,
    lng: 34.912755,
  });
  //מגדיר את האישור שלנו לגוגל מאפס בעזרת האייפיאי
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCt1tGfbI6o0A6dcCFTstFsPlAUEQYaYS4",
  });

  const onMouseOver = (e) => {
    console.log("maouse in marker");
  };

  //פונקצייה להזזת המרקר ממקום למקום
  function TravellingMarker({ position, ...rest }) {
    let [coordinates, setDestination] = useMoveMarker([
      position.lat,
      position.lng,
    ]);

    useEffect(() => {
      setDestination([position.lat, position.lng]);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <Marker
        onMouseOver={onMouseOver}
        position={{
          lat: coordinates[0],
          lng: coordinates[1],
        }}
        // {...rest}
      />
    );
  }

  //החזרת המפה כשהמרכז שלה ( ברירת מחדל ) היא רופין ובתוכה של הסימניות שנרנדר דינמי
  return (
    <>
      {loadError && <p>{loadError}</p>}
      {!isLoaded && <p>Loading .. </p>}
      {isLoaded && (
        <div>
          <div className="createGroupMapHeader">
            <button
              onClick={() => {
                setMapCenter({
                  lat: 32.34219292102018,
                  lng: 34.91201501449191,
                });
                setCurrentCoordinates([32.34219292102018, 34.91201501449191]);
              }}
              className="btn btn-sm m-2  bg-slate-200 text-black "
            >
              <GrLocationPin className="fill-white"/>
              Libary
            </button>
            <button
              onClick={() => {
                setMapCenter({
                  lat: 32.34358598195018,
                  lng: 34.91350448033373,
                });
                setCurrentCoordinates([32.34358598195018, 34.91350448033373]);
              }}
              className="btn btn-sm m-2 bg-slate-200 text-black"
            >
              <GrLocationPin className="fill-white"/>
              building 5
            </button>
            <button
              onClick={() => {
                setMapCenter({
                  lat: 32.34186000228468,
                  lng: 34.91045634687421,
                });
                setCurrentCoordinates([32.34186000228468, 34.91045634687421]);
              }}
              className="btn btn-sm m-2 bg-slate-200 text-black"
            >
               <GrLocationPin className="fill-white"/>
              building 20
            </button>
          </div>

          <GoogleMap
            zoom={15}
            center={{ lat: 32.342884, lng: 34.912755 }}
            mapContainerClassName=" map-container"
            onClick={(e) => {
              setCurrentCoordinates([e.latLng.lat(), e.latLng.lng()]);
            }}
          >
            <TravellingMarker
              position={{
                lat: currentCoordinates[0],
                lng: currentCoordinates[1],
              }}
            />
          </GoogleMap>
        </div>
      )}
    </>
  );
}
export default MapAdd;
