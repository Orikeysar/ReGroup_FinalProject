import React from "react";
import { GiStarMedal, GiRingingBell } from "react-icons/gi";
import Top10ModalCard from "./Top10ModalCard";
function Top10Modal() {
  return (
    <div>
      {/* The button to open modal */}
 
      <label
        htmlFor="my-modal-4"
        className="showTop10 btn btn-ghost btn-circle bg-white h-5  "
      >
        <GiStarMedal className="max-h-fit" />
      </label>
      {/* Put this part before </body> tag */}
      <input type="checkbox" id="my-modal-4" className="modal-toggle" />
      <label htmlFor="my-modal-4" className="modal cursor-pointer ">
        <label className="modal-box relative h-full" htmlFor="">
        <div className="overflow-x-auto w-full">
          <label className="justify-center text-center text-xl font-bold">
        <p className="sticky top-0">Top 10 students</p>
      </label>
  <table className="table w-full mb-3">
    {/* head */}
    <tbody>
     <Top10ModalCard/>
    </tbody>
   
  </table>
</div>
        </label>
      </label>
    </div>
  );
}

export default Top10Modal;
