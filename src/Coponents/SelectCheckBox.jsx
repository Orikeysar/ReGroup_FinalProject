import React, { Component, useState } from "react";
import { MultiSelect } from 'primereact/multiselect';

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";     
    
//core
import "primereact/resources/primereact.min.css";

//icons
import "primeicons/primeicons.css";                                         
        

export default function SelectCheckBoxs() {
    const [selectedCurses, setSelectedCurses] = useState([]);
    console.log(selectedCurses)
    
    {
        //מחזיר את הרשימה של כל הקורסים שקיימים
 return (
        <div className="card flex justify-content-center">
            <MultiSelect value={selectedCurses} onChange={(e) => setSelectedCurses(e.value)} options={""} optionLabel="id" 
                placeholder="Choose courses in your field of knowledge" maxSelectedLabels={30} className="w-full md:w-20rem" />
        </div>
    );

    }
    
   
}
    


  