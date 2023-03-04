
import { useEffect, useState,useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const useAuthStatus = () => {
  const [logedIn, setLogedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const isUserSignIn = useRef(true)
  const [activeUser, setActiveUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    return user;
  });
  useEffect(() => {
    if(isUserSignIn){

      const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user && activeUser ) {
        setLogedIn(true);
      }
      setLoading(false);
    });
 
    }
    return () => {
      isUserSignIn.current = false

    }
     },[isUserSignIn]);
  return {logedIn,loading}
};

export default useAuthStatus;
