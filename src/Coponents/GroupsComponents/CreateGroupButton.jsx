import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const CreateGroupButton = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [showIconOnly, setShowIconOnly] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
    }, 300);
    navigate('/createGroups');
  };

  const handleScroll = () => {
    setShowIconOnly(window.scrollY > 0);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <p
      href="#"
      className={`create-group-btn ${isClicked ? 'clicked' : ''} ${
        showIconOnly ? 'icon-only' : ''
      }`}
      onClick={handleClick}
    >
      <FontAwesomeIcon icon={faPlus} className="icon" />
      {showIconOnly ? null : 'CREATE GROUP'}
    </p>
  );
};

export default CreateGroupButton;
