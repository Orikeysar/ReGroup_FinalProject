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
          <img className=" w-10 h-10 rounded-full shadow-md" src="https://firebasestorage.googleapis.com/v0/b/regroup-a4654.appspot.com/o/images%2Fwinning.png?alt=media&token=f0f3025b-80fc-4758-a39f-a0abb24c338e" alt="Users Recored" />
      </label>
      {/* Put this part before </body> tag */}
      <input type="checkbox" id="my-modal-4" className="modal-toggle" />
      <label htmlFor="my-modal-4" className="modal cursor-pointer ">
        <label className="modal-box relative w-4/5 h-4/5" htmlFor="">
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
