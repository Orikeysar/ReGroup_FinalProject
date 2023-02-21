import React from 'react'
import Logo from '../asset/ReGroupIcon.png'
import { useNavigate } from "react-router-dom";

import { GiStarMedal,GiRingingBell } from 'react-icons/gi';
function NavBar() {
    const navigate = useNavigate();

   const handleLogoClick=()=>{
    navigate("/");

    }
    const handleTop10Click =() =>{


    }
  return (
    <>
    <div className="navbar bg-base-100 mb-4">
    <div className="navbar-start"> 
    <img src={Logo} alt="" className="btn btn-ghost left-0 normal-case border border-gray-400 " onClick={handleLogoClick}></img>
   
    </div>
    <div className="navbar-center">
     
     
    </div>
    <div className="navbar-end">
      <button className="showTop10 btn btn-ghost btn-circle bg-white h-5  "  onClick={handleTop10Click} >
      <GiStarMedal className='max-h-fit'/>
      </button>
      <button className="btn btn-ghost btn-circle  bg-white h-5  ">
        <GiRingingBell className='max-h-fit'/>
        <div className="indicator  bg-white ">
           
         
          <span className="badge badge-xs badge-primary indicator-item bg-info"></span>
         
        </div>
      </button>
    </div>
    
  </div>
  
  </>
  )
}

export default NavBar