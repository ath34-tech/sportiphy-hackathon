import React from 'react';

const ArticleCard = ({ article, handleShowRelatedNews }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
      <p className="text-gray-700 text-base mb-4">{article}</p>
      <button
        onClick={() => handleShowRelatedNews({description:article,title:""})}
        className="w-full py-2 bg-black text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200"
      >
        Know Related
      </button>
    </div>
  );
};

export default ArticleCard;
