// src/components/Modal.js
import React from 'react';
import './Modal.css'; // Optional: Add your CSS styles here

const Modal = ({ show, handleClose, title, content }) => {
    if (!show) {
        return null; // Don't render anything if not shown
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">{title}</h2>
                <p className="modal-body">{content}</p>
                <button className="modal-close" onClick={handleClose}>Close</button>
            </div>
        </div>
    );
};

export default Modal;