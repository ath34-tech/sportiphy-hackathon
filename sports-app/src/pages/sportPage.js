import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NewsCard from '../components/NewsCard';  // Import NewsCard component
import RelatedNewsModal from '../components/RelatedNewsModal'; // Import Related
import { Link } from 'react-router-dom';
import { FiMenu,FiX } from 'react-icons/fi';
import ReactLoading from 'react-loading';


const SportPage = () => {
    const { sport } = useParams(); // Get the sport param from the route
    const [articles, setArticles] = useState([]);
    const [menuOpen, setMenuOpen] = useState(true);
    const [relatedNews, setRelatedNews] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const toggleMenu = () => setMenuOpen(!menuOpen);

   

    useEffect(() => {
      const fetchArticles = async () => {
        setLoading(true); // Show loading spinner while fetching
        try {
          const cacheKey = `${sport}_sport_page`;
          const cachedData = localStorage.getItem(cacheKey);
  
          if (cachedData) {
            const parsedData = JSON.parse(cachedData);
  
            // Check if cached data is still valid (within 1 day)
            const isCacheValid =
              new Date().getTime() - parsedData.timestamp < 24 * 60 * 60 * 1000;
  
            if (isCacheValid) {
              setArticles(parsedData.articles); // Use cached articles
              setLoading(false);
              return;
            }
          }
  
          // Fetch fresh data if no valid cache is found
          const requestData = { sport_type: sport };
          const response = await fetch('http://127.0.0.1:5000/fetch_sport', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch articles');
          }
  
          const data = await response.json();
          setArticles(data.articles);
  
          // Cache the fresh data with a timestamp
          localStorage.setItem(
            cacheKey,
            JSON.stringify({ articles: data.articles, timestamp: new Date().getTime() })
          );
        } catch (error) {
          console.error('Error fetching articles:', error);
        } finally {
          setLoading(false); // Hide loading spinner
        }
      };
  
      fetchArticles();
    }, [sport]); // Dependency array ensures it runs when sport changes

    
      const handleReadArticle = async (article) => {
        try {
          // Step 1: Send the article content to Gemini API
          const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyASIxiKUuasdH49yXHy0grLBc6-Y-VKXKc`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: `Bring out name of players or team if mentioned, stadium, and tournament in the following format:\nPlayers:\nTeams:\nStadium:\nTournament:\n\nArticle:\n${article.description}`
                            }
                        ]
                    }
                ]
            })
        });
  
      
          if (!geminiResponse.ok) throw new Error("Failed to analyze article content with Gemini");
      
          const geminiData = await geminiResponse.json();
          const geminiText = geminiData.candidates[0].content.parts[0].text; // Adjust based on Gemini's actual response format
      
          // Step 2: Extract information with "Not mentioned" defaults if missing
    
          const players = geminiText.match(/Players:\s*(.*)/)?.[1]?.split(",") || [];
          const teams = geminiText.match(/Teams:\s*(.*)/)?.[1]?.split(",") || [];
          const stadium = geminiText.match(/Stadium:\s*(.*)/)?.[1]?.trim() || '';
          const tournament = geminiText.match(/Tournament:\s*(.*)/)?.[1]?.trim() || '';
      
          // Step 3: Log reading behavior to backend
          const logResponse = await fetch('http://localhost:5000/log_reading_behavior', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: localStorage.getItem('user_id'),  // Assuming user_id is stored in localStorage
              article_id: article.id,
              sport: article.sport,
              team: teams,
              player: players,
              stadium: [stadium],
              tournament: [tournament]
            })
          });
      
          if (!logResponse.ok) throw new Error("Failed to log reading behavior");
      
        } catch (err) {
          console.error("Error logging reading behavior:", err);
        }
      };
  
      const [selectedDate, setSelectedDate] = useState('');
      const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
      };
      const filterArticlesByDate = (articles) => {
        articles = articles.filter((article) =>
          article.title.toLowerCase().includes(searchTerm) ||
          article.description.toLowerCase().includes(searchTerm)
        );
        if (!selectedDate) return articles;  // If no date is selected, return all articles
      
        return articles.filter((article) => {
          const articleDate = new Date(article.time);  // Convert article's date to a Date object
          const selectedDateObj = new Date(selectedDate);  // Convert selected date to a Date object
      
          // Check if the article's date matches the selected date (considering only year, month, and day)
  
          return (
            articleDate.getFullYear() === selectedDateObj.getFullYear() &&
            articleDate.getMonth() === selectedDateObj.getMonth() &&
            articleDate.getDate() === selectedDateObj.getDate()
          );
        });
      };
      
      const fetchRelatedNews = async (article) => {
        const articleContent=`${article.title} \n ${article.description}`;
        console.log( `Article ${articleContent}`);
        try {
          const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyASIxiKUuasdH49yXHy0grLBc6-Y-VKXKc', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: `Give me summary of this news content in 60 words or more and make sure don't use any gibberish language and make all content relatable: ${articleContent}` }] }]
            })
          });
      
          if (!response.ok) throw new Error("Failed to fetch related news");
      
          const data = await response.json();
          const geminiText = data.candidates[0].content.parts[0].text; // Adjust based on Gemini's actual response format
      
          console.log("Related news:", data );
          return geminiText || "No related news found."; // Ensure we return a string
        } catch (error) {
          console.error("Error fetching related news:", error);
          return "Error fetching related news. Please try again.";
        }
      };
        
      const handleShowRelatedNews = async (article) => {
        const news = await fetchRelatedNews(article);
        if (news.includes("Please provide the article so I can identify the top 5 news")) {
          setRelatedNews("No related news");
        } else {
          setRelatedNews(news);
        }
        setRelatedNews(news);
        setIsModalOpen(true);
      };
  
      const logout = async (article) => {
        localStorage.clear();
        window.location.href = '/';
      }
      const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
      };
      return (
    filterArticlesByDate(articles).length <= 0 ? (
          <ReactLoading type={'bubbles'} color={'black'} height={'50%'} width={'70%'} className='w-full max-w-md mx-auto h-screen flex items-center'/>                    
        ) : (
          <>
            <div className="flex w-screen h-screen">
              {/* Sidebar */}
              <nav
                className={`bg-black text-white h-full fixed lg:relative transition-all duration-300 z-10 
                ${menuOpen ? 'w-64' : 'w-0 overflow-hidden'}`}
              >
                {/* Cross Button */}
                <div className="flex justify-end p-4 lg:hidden">
                  <FiX
                    className="text-2xl cursor-pointer"
                    onClick={toggleMenu} // Close the sidebar
                  />
                </div>
    
                <div className={`flex flex-col p-4 space-y-8 transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}>
                  {/* Sidebar Heading */}
                  <h1 className="text-3xl font-bold mx-10">
                    <Link to="/">Sportiphy</Link>
                  </h1>
    
                  {/* Sidebar Links */}
                  <div className="flex flex-col items-center space-y-6 text-lg">
                    {['cricket', 'football', 'tennis', 'badminton', 'f1','basketball','boxing','rugby','hockey'].map((sport) => (
                      <Link key={sport} to={`/sports/${sport}`} className="hover:underline">
                        {sport}
                      </Link>
                    ))}
                  </div>
    
                  {/* Logout Button */}
                  <button
                    onClick={logout}
                    className="bg-white text-black font-bold py-2 px-4 rounded hover:bg-gray-200"
                  >
                    Logout
                  </button>
                </div>
              </nav>
    
              {/* Main Content */}
              <div className="flex-grow bg-white text-black overflow-y-auto">
                {/* Mobile Navbar */}
                <div className="lg:hidden bg-black text-white p-4 flex justify-between items-center">
                  <FiMenu onClick={() => setMenuOpen(!menuOpen)} className="text-2xl cursor-pointer" />
                </div>
    
                {/* Content */}
                <main className="p-8 lg:ml-15 space-y-12">
                  <section>
                    <h2 className="text-2xl font-semibold mb-4">{sport}</h2>
                    <input
                      type="date"
                      onChange={handleDateChange}
                      className="mb-4 p-2 border rounded"
                    />
                      <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search articles..."
              className="w-100 p-2 border border-gray-300 rounded"
            />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {filterArticlesByDate(articles).length > 0 ? (
                        filterArticlesByDate(articles).map((article) => (
                          <NewsCard
                            key={article.id}
                            article={article}
                            handleShowRelatedNews={handleShowRelatedNews}
                            handleReadArticle={handleReadArticle}
                          />
                        ))
                      ) : (
                        <div>No articles found for this date</div>
                      )}
                    </div>
                  </section>
                </main>
              </div>
            </div>
    
            <RelatedNewsModal 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)} 
              relatedNews={relatedNews} 
            />
          </>
        )
      );
    };

export default SportPage;
