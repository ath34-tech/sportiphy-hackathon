import React from 'react';
import "../css/modal.css";

const Modal = ({ isOpen, onClose, url }) => {
  if (!isOpen) return null;  // Do not render the modal if it's closed

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button onClick={onClose} className="modal-close bg-black">X</button>
        
        {/* Embed the article using iframe */}
        <iframe 
          src={url} 
          width="100%" 
          height="500px" 
          title="Article View" 
        />
      </div>
    </div>
  );
};

export default Modal;
