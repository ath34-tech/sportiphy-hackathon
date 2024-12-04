  // HomePage.js
  import React, { useEffect, useState } from 'react';
  import '../css/Home.css';
  import RelatedNewsModal from '../components/RelatedNewsModal';
  import NewsCard from '../components/NewsCard';
  import ArticleCard from '../components/articleCard';
  import { FiMenu ,FiX} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import PreferencesModal from '../components/PreferencesModal';
  const HomePage = () => {
    const [articles, setArticles] = useState([]);
    const [LatestArticle, setLatestArticles] = useState([]);
    const [sports, setSports] = useState([]);
    const [players, setPlayers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [tournaments, setTournaments] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [menuOpen, setMenuOpen] = useState(true);
    const [relatedNews, setRelatedNews] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sport, setSport] = useState(['cricket', 'football', 'tennis', 'badminton', 'f1','basketball','boxing','rugby','hockey']);
    const [selectedSport, setSelectedSport] = useState([]);
    const articlesPerPage = 9; // Number of articles per page
    const [currentPage, setCurrentPage] = useState(1);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showPreferences, setShowPreferences] = useState(false);

    const totalPages = Math.ceil(LatestArticle.length / articlesPerPage);

    const generateRandomEmailAndPassword = () => {
      const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
      const specialCharacters = '!@#$%^&*()_+[]{}<>?,./';
      const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'example.com'];

      // Generate random username
      const usernameLength = Math.floor(Math.random() * 10) + 5;
      let username = '';
      for (let i = 0; i < usernameLength; i++) {
          username += characters.charAt(Math.floor(Math.random() * characters.length));
      }

      // Pick a random domain
      const domain = domains[Math.floor(Math.random() * domains.length)];
      const randomEmail = `${username}@${domain}`;

      // Generate random password
      const passwordLength = Math.floor(Math.random() * 6) + 8;
      const allCharacters = characters + characters.toUpperCase() + specialCharacters;
      let randomPassword = '';
      for (let i = 0; i < passwordLength; i++) {
          randomPassword += allCharacters.charAt(Math.floor(Math.random() * allCharacters.length));
      }

      return {email: randomEmail, password: randomPassword};
  };

    const signupVirtualUser=()=>{
      const userId=localStorage.getItem('user_id');
      if (userId){
        return;
      }
      const {email, password} = generateRandomEmailAndPassword();
      const userData = { "username":"virtual_user", "email":email, "password":password, "preferences":[],"players":[],"teams":[],"tournaments":[]};
      try{
      fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })
        .then(response => response.json())
        .then(data => {
          console.log('User signed up:', data)
          localStorage.setItem('user_id',data.uid); // Get user_id from local storage

        })
      }
      catch(err){
        console.log(err)
      }
    }
    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };
    const toggleMenu = () => setMenuOpen(!menuOpen);

    const geminiKey='AIzaSyASIxiKUuasdH49yXHy0grLBc6-Y-VKXKc'
   

    const CACHE_DURATION_MS = 1 * 60 * 60 * 1000; // 1 day in milliseconds.

  const fetchDataWithCache = async (url, cacheKey) => {
    try {
      const cachedData = JSON.parse(localStorage.getItem(cacheKey));
      const now = Date.now();
      // Check if cached data is still valid
      if (cachedData && now - cachedData.timestamp < CACHE_DURATION_MS) {
                return cachedData.data;
      }

      // Fetch new data if not cached or expired
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch from ${url}`);
      }

      const data = await response.json();
      // Cache the new data with a timestamp
      localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: now }));

      return data;
    } catch (err) {
      throw err;
    }
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);

      const userId = localStorage.getItem('user_id');
      if (!userId) throw new Error("User ID is missing from localStorage");

      const [
        latestArticles,
        sportNews,
        playerNews,
        teamNews,
        tournamentNews,
        recommendedArticles,

      ] = await Promise.all([
        fetchDataWithCache(`http://localhost:5000/get_all_articles`, 'latest_articles'),
        fetchDataWithCache(`http://localhost:5000/recommend_by_sport/${userId}`, 'sport_news'),
        fetchDataWithCache(`http://localhost:5000/recommend_by_players/${userId}`, 'player_news'),
        fetchDataWithCache(`http://localhost:5000/recommend_by_teams/${userId}`, 'team_news'),
        fetchDataWithCache(`http://localhost:5000/recommend_by_tournaments/${userId}`, 'tournament_news'),
        fetchDataWithCache(`http://localhost:5000/recommend_articles_get/${userId}`, 'recommended_articles'),

      ]);

      setArticles(recommendedArticles.recommended_articles || []);
      setSports(sportNews.news_list || []);
      setPlayers(playerNews.news_list || []);
      setTeams(teamNews.news_list || []);
      setTournaments(tournamentNews.news_list || []);
      setLatestArticles(latestArticles.articles || []);
    } catch (err) {
      setError('Error fetching data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAllData();
    signupVirtualUser();
  }, []);


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
      if(selectedSport.length==0){
        articles=articles;
      } else{
        articles=articles.filter((article) => selectedSport.includes(article.sport));
      }
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
    const toggleDropdown = () => {
      setDropdownOpen(!dropdownOpen);
    }
    const handleSearchChange = (e) => {
      setSearchTerm(e.target.value.toLowerCase());
    };
    const handleSportChange = (event) => {
      const sport = event.target.value;
      if (event.target.checked) {
        setSelectedSport((prev) => [...prev, sport]); // Add sport to the selected list
      } else {
        setSelectedSport((prev) => prev.filter((s) => s !== sport)); // Remove sport from the selected list
      }
    };
    const changePreference = () => {
      setShowPreferences(true);
    }
    const UpdatePreference = (preferences) => {
      const id=localStorage.getItem('user_id');
      fetch(`http://localhost:5000/update_preference`,{
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id:id,
          preferences:preferences
        })
      }).then(response => response.json()).then(data => {
        localStorage.setItem('preferences', JSON.stringify(preferences.sports)); // Get user_id from local storage
        localStorage.setItem('players', JSON.stringify(preferences.players)); // Get user_id from local storage
        localStorage.setItem('teams', JSON.stringify(preferences.teams)); // Get user_id from local storage
        localStorage.setItem('tournaments', JSON.stringify(preferences.tournaments))
            }).catch(err => {
        console.log(err);
      })
    }

    return (
      <>
                    
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
    <h1 className="text-3xl font-bold mx-10 disp-n">
      <Link to="/">Sportiphy</Link>
    </h1>

    {/* Sidebar Links */}
    <div className="flex flex-col items-center space-y-6 text-lg">
      {sport.map((sport) => (
        <Link key={sport} to={`/sports/${sport}`} className="hover:underline">
          {sport}
        </Link>
      ))}
    </div>

    {/* Logout Button */}
    <button
      onClick={changePreference}
      className="bg-white text-black font-bold py-2 px-4 rounded hover:bg-gray-200"
    >
      change preferences
    </button>
  </div>
</nav>

        {/* Main Content */}
        <div className="flex-grow bg-white text-black overflow-y-auto">
          {/* Mobile Navbar */}
          <div className="lg:hidden bg-black text-white p-4 flex justify-between items-center sticky">
            {/* <h1 className="text-xl font-bold">Sportiphy</h1> */}
            <FiMenu onClick={() => setMenuOpen(!menuOpen)} className="text-2xl cursor-pointer" />
            <h1 className="text-3xl font-bold mx-20">
      <Link to="/">Sportiphy</Link>
    </h1>
          </div>

          {/* Content */}
          <main className="p-8 lg:ml-15 space-y-12">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Latest News</h2>
            <input
    type="date"
    onChange={handleDateChange}
    className="mb-4 p-2 border rounded mx-3"
  />
              <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search articles..."
              className="w-100 p-2 border border-gray-300 rounded"
            />
      {/* <select 
        id="sport-filter"
        value={selectedSport}
        onChange={handleSportChange}
        className='mb-4 p-2 border rounded mx-3'
      > */}
           <div className="p-5">
      <div className="relative inline-block">
        <button
          onClick={toggleDropdown}
          className="px-4 py-2 bg-black text-white rounded-lg shadow-lg hover:bg-black focus:outline-none"
        >
          Select Sports
        </button>

        {dropdownOpen && (
          <div className="absolute mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            <div className="max-h-48 overflow-y-auto p-2">
              {sport.map((sport) => (
                <label
                  key={sport}
                  className="flex items-center space-x-2 py-1 px-2 hover:bg-gray-100 rounded-md"
                >
                  <input
                    type="checkbox"
                    value={sport}
                    onChange={handleSportChange}
                    checked={selectedSport.includes(sport)}
                    className="form-checkbox text-blue-500"
                  />
                  <span className="text-gray-700">
                    {sport.charAt(0).toUpperCase() + sport.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <h2 className="mt-5 text-2xl font-bold">Selected Sports</h2>
      <p className="text-gray-600">
        {selectedSport.length > 0
          ? selectedSport.join(", ")
          : "No sports selected."}
      </p>
    </div>
        {/* <option value="">All Sports</option>
        {sport.map((sport, index) => (
          <option key={index} value={sport}>
            {sport}
          </option>
        ))} */}
      {/* </select> */}



            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filterArticlesByDate(LatestArticle).length > 0 ? (
      filterArticlesByDate(LatestArticle).slice(
        (currentPage - 1) * articlesPerPage,
        currentPage * articlesPerPage
      ).map((article) => (
        <NewsCard
          key={article.id}
          article={article}
          handleShowRelatedNews={handleShowRelatedNews}
          handleReadArticle={handleReadArticle}
        />
      ))
    ) : (
      // <ReactLoading type={'balls'} color={'red'} height={'100%'} width={'100%'} />
<div>No Articles are found</div>
)}
</div>
<div className="mt-6 overflow-x-auto">
  <div className="flex space-x-2 sm:space-x-3 w-max mx-auto">
    {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
      <button
        key={pageNumber}
        onClick={() => handlePageChange(pageNumber)}
        className={`px-3 sm:px-4 py-2 rounded-lg border ${
          currentPage === pageNumber
            ? 'bg-black text-white border-blue-600'
            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-black hover:text-white'
        }`}
      >
        {pageNumber}
      </button>
    ))}
  </div>
</div>
          </section>
            <section>
              <h2 className="text-2xl font-semibold mb-4">Recommended Articles</h2>
  

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
      // <ReactLoading type={'balls'} color={'red'} height={'100%'} width={'100%'} />
<div>No Articles are found</div>
)}
              </div>
            </section>

            {[
              { title: 'Articles According to Your Favorite Sport', data: sports },
              { title: 'Player Fandom', data: players },
              // { title: 'Team Fandom', data: team},s 
              { title: 'Tournaments Followed', data: tournaments }
            ].map(({ title, data }) => (
              
              <section key={title}>
                <h2 className="text-2xl font-semibold mb-4">{title}</h2>
                {Array.isArray(data) && data.length > 0 ? (
                  data.map((item, index) => (
                    <div key={index}>
                      <h3 className="text-x text-gray-600 font-semibold mt-6 uppercase">{Object.keys(item)[0]}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {item[Object.keys(item)[0]] ? (
  item[Object.keys(item)[0]].map((article, idx) => (
    <ArticleCard key={idx} article={article} handleShowRelatedNews={handleShowRelatedNews} />
  ))
) : (
  <div>No articles available</div> // This can be a fallback when no data is found.
)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div>No related news found.</div>
                )}
              </section>
            ))}
          </main>
        </div>
      </div>
      <RelatedNewsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        relatedNews={relatedNews} 
      />
              {showPreferences && (
          <PreferencesModal
            submitSignup={UpdatePreference}
            closeModal={() => setShowPreferences(false)}
          />
        )}
      </>
      
    </>
  
    );
    
  };



  export default HomePage;
