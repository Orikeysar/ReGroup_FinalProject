import React from 'react'
import spinerGif from "../../asset/spinerGif.gif";
function Spinner() {
  return (
    <div className='container'>
      <div className='m-5 mt-20 '>
<img src={spinerGif} alt="spinner"  className="mx-auto text-center"
        width={180}
      /> 

      </div>
    </div>
  )
}

export default Spinner
