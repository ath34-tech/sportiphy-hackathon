import React, { useState } from 'react';
import '../css/modal.css';

const Modal = ({ isOpen, onClose, relatedNews }) => {
  if (!isOpen) return null;

  // Function to convert markdown-style **bold** to HTML <b>bold</b>
  const convertBoldMarkdown = (text) => {
    return text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'); // Replace **text** with <b>text</b>
  };

  // Split the response into bullet points and convert markdown bold to HTML
  const newsItems = relatedNews
    .split("\n")
    .filter(item => item.trim().length > 0);
    

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h3 className="text-xl font-semibold mb-4">Related News</h3>
        <p>{newsItems}</p>
        <button 
          className="mt-4 bg-red-600 text-white py-2 px-4 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
