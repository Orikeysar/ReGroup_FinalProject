import React, { Component, useState } from "react";
import { dataSelection } from "../asset/DataSelection";
import { MultiSelect } from "primereact/multiselect";

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";

//core
import "primereact/resources/primereact.min.css";

//icons
import "primeicons/primeicons.css";
//מקבלת מערך ריק ופונקציה 
export default function MultiSelectCheckBox({
  selectedCourses,
  handleSelectedCourses,
}) {
  const handleChange = (e) => {
    handleSelectedCourses(e.value);
  };

  {
    //מחזיר את הרשימה של כל הקורסים שקיימים
    return (
      <div className="card flex justify-content-center w-5/6">
        <MultiSelect
          value={selectedCourses}
          onChange={handleChange}
          options={dataSelection}
          optionLabel="id"
          placeholder="Choose courses "
          maxSelectedLabels={2}
          className="w-full md:w-20rem"
        />
      </div>
    );
  }
}
