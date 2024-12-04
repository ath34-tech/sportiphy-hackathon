import React, { useState, useEffect } from 'react';
import "../css/card.css"
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from 'react-icons/fa'; // Import the icons
import Modal from './NewsModal';
const NewsCard = ({ article, handleShowRelatedNews, handleReadArticle }) => {
  const [clicked, setClicks] = useState(false);
  const [imageUrl, setImageUrl] = useState(null); // State to hold the image URL
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReadMore = () => {
    setIsModalOpen(true); // Open the modal when "Read More" is clicked
  };
  // Function to fetch image URL based on the article's query (sport)
  const removeHtmlTags = (str) => {
    return str.replace(/<[^>]*>/g, ''); // Regex to remove HTML tags
  };
  // Fetch image URL when the component mounts or when the article sport changes
  const handleShare = (platform) => {
    const articleUrl = article.link;
    const articleTitle = article.title;
    const articleDescription = article.description;

    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(articleTitle)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(articleUrl)}&title=${encodeURIComponent(articleTitle)}&summary=${encodeURIComponent(articleDescription)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(articleTitle)}%20${encodeURIComponent(articleUrl)}`;
        break;
      default:
        console.error('Unsupported platform');
        return;
    }

    window.open(shareUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
     
    {/* Conditionally render the image once it's loaded */}
    {article.image ? (
      <img src={article.image} alt="Article Image" className="w-full h-64 object-cover" />
    ) : (
      <img src="https://via.placeholder.com/300" alt="Article Image" className="w-full h-64 object-cover" />
    )}
    <div className="p-6 relate">
      <h3 className="text-lg font-bold">{article.title}</h3>
      <p className="text-m">{article.time}</p>

      {/* Limit description to 4 lines */}
      <p className="text-gray-600 mt-3 line-clamp-3">{removeHtmlTags(article.description)}</p>
      <div>
        <div className="mt-5 flex justify-between items-center flex-shrink-0 btn-made-by-me">
        {/* Read More Button */}
        <button onClick={handleReadMore} className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800">
            Read more
          </button>

        {/* Know More Button */}
        <button
          className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
          onClick={() =>
            { 
              handleReadArticle(article);
              handleShowRelatedNews(article)}

            }
        >
          summarize
        </button>

        {/* Heart Button */}
        <button
          className="text-red-500 hover:text-red-600 w-10 h-10"
          onClick={() => {
            setClicks(true);
            handleReadArticle(article);
          }}
        >
          {clicked ? '❤️' : '🩶'}
        </button>
        </div>
        <div className="flex space-x-7 mt-4 mx-2 share-btn">
          <h3 className='text-gray-600 mt-0'>Share:</h3>
            <button
              className="text-blue-600 hover:text-blue-700 social-icon"
              onClick={() => handleShare('facebook')}

            >
              <FaFacebook size={24} />
              </button>
            <button
              className="text-blue-600 hover:text-blue-700 social-icon"
              onClick={() => handleShare('twitter')}
            >
              <FaTwitter size={24} />
            </button>
            <button
              className="text-blue-600 hover:text-blue-700 social-icon"
              onClick={() => handleShare('linkedin')}
            >
              <FaLinkedin size={24} />
            </button>
            <button
              className="text-blue-600 hover:text-blue-700 social-icon"
              onClick={() => handleShare('whatsapp')}
            >
              <FaWhatsapp size={24} />
            </button>
          </div>
      </div>
    </div>
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} url={article.link} />

  </div>
  );
};

export default NewsCard;
