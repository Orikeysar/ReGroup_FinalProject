import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

const CreateGroupButton = () => {
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
    }, 300);
    navigate("/createGroups");

  };

  return (
    <p
      href="#"
      className={`create-group-btn ${isClicked ? 'clicked' : ''}`}
      onClick={handleClick}
    >
      <FontAwesomeIcon icon={faPlus} className="icon" />
      CREATE GROUP
    </p>
  );
};

export default CreateGroupButton;
