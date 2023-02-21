
import { useEffect, useState,useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const useAuthStatus = () => {
  const [logedIn, setLogedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const isUserSignIn = useRef(true)
  useEffect(() => {
    if(isUserSignIn){

      const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
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
