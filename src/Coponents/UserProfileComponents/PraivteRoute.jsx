import React from 'react'
import { Navigate,Outlet } from 'react-router-dom'
import {useAuthStatus} from '../../Hooks/useAuthStatus'
import Spinner from "../GeneralComponents/Spinner";

//THIS IS PRAIVET ROUT THAT CHECK IF WE HAVE SIGN USER IN SYSTEM
//IF WE HAVE GO TO PROFILE PAGE IF NOT GO TO SIGN IN PAGE
function PraivteRoute() {
    const {logedIn,loading} = useAuthStatus()
    if(loading ){
        return <Spinner/>
    }
  return (
    logedIn ? <Outlet/>: <Navigate to='/sign-in'/>
  )
}

export default PraivteRoute
