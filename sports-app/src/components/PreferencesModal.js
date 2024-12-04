import React, { useEffect, useState } from 'react';

const sports = ['Cricket', 'Football', 'Basketball', 'Tennis', 'Hockey', 'f1', 'Rugby', 'Golf', 'Badminton', 'Baseball'];
const players = [
  "Virat Kohli", "Babar Azam", "Joe Root", "Kane Williamson", "Steve Smith",
  "Rohit Sharma", "David Warner", "Jasprit Bumrah", "Shaheen Afridi", "Trent Boult",
  "Pat Cummins", "Ben Stokes", "Marnus Labuschagne", "KL Rahul", "Quinton de Kock",
  "Shubman Gill", "Mitchell Starc", "Hardik Pandya", "Rashid Khan", "Shakib Al Hasan",
  "Lionel Messi", "Cristiano Ronaldo", "Kylian Mbappe", "Neymar Jr", "Erling Haaland",
  "Robert Lewandowski", "Kevin De Bruyne", "Mohamed Salah", "Harry Kane", "Karim Benzema",
  "Sadio Mane", "Virgil van Dijk", "Luka Modric", "Bruno Fernandes", "Paul Pogba",
  "Antoine Griezmann", "Gianluigi Donnarumma", "Raheem Sterling", "Sergio Ramos", "Marcus Rashford",
  "Novak Djokovic", "Carlos Alcaraz", "Daniil Medvedev", "Stefanos Tsitsipas", "Jannik Sinner",
  "Holger Rune", "Alexander Zverev", "Andrey Rublev", "Casper Ruud", "Hubert Hurkacz",
  "Viktor Axelsen", "Kento Momota", "Lakshya Sen", "Anthony Sinisuka Ginting", "Lee Zii Jia",
  "Jonatan Christie", "Carolina Marin", "Tai Tzu-ying", "Chen Yufei", "Akane Yamaguchi",
  "Max Verstappen", "Lewis Hamilton", "Charles Leclerc", "George Russell", "Sergio Perez",
  "Carlos Sainz", "Lando Norris", "Fernando Alonso", "Esteban Ocon", "Pierre Gasly",
  "Magnus Carlsen", "Ian Nepomniachtchi", "Hikaru Nakamura", "Fabiano Caruana", "Ding Liren",
  "Anish Giri", "Alireza Firouzja", "Wesley So", "Levon Aronian", "Richard Rapport",
  "Vidit Gujrathi", "Pentala Harikrishna", "Rameshbabu Praggnanandhaa", "Arjun Erigaisi",
  "Nihal Sarin", "Koneru Humpy", "Dronavalli Harika"
];
const teams = [
  // Cricket Teams
  "India", "Australia", "England", "South Africa", "New Zealand",
  "Pakistan", "Sri Lanka", "West Indies", "Bangladesh", "Afghanistan",

  // Football Teams
  "Manchester United", "Real Madrid", "Barcelona", "Liverpool", "Paris Saint-Germain",
  "Manchester City", "Bayern Munich", "Chelsea", "Juventus", "AC Milan",

  // Basketball Teams
  "Los Angeles Lakers", "Golden State Warriors", "Chicago Bulls", "Miami Heat", "Brooklyn Nets",
  "Milwaukee Bucks", "Boston Celtics", "Phoenix Suns", "Philadelphia 76ers", "Denver Nuggets",

  // Baseball Teams
  "New York Yankees", "Los Angeles Dodgers", "San Francisco Giants", "Chicago Cubs", "Boston Red Sox",
  "Houston Astros", "Atlanta Braves", "Philadelphia Phillies", "St. Louis Cardinals", "Toronto Blue Jays",

  // Ice Hockey Teams
  "Toronto Maple Leafs", "Montreal Canadiens", "Boston Bruins", "Chicago Blackhawks", "Pittsburgh Penguins",
  "Detroit Red Wings", "Edmonton Oilers", "New York Rangers", "Vegas Golden Knights", "Colorado Avalanche",

  // Rugby Teams
  "New Zealand All Blacks", "England Roses", "South Africa Springboks", "Australia Wallabies", "France Les Bleus",
  "Ireland Wolfhounds", "Scotland Thistle", "Wales Dragons", "Argentina Pumas", "Italy Azzurri",

  // American Football Teams
  "Dallas Cowboys", "New England Patriots", "Green Bay Packers", "Kansas City Chiefs", "San Francisco 49ers",
  "Seattle Seahawks", "Buffalo Bills", "Pittsburgh Steelers", "Baltimore Ravens", "Miami Dolphins"
];
const tournaments = [
  // Cricket Tournaments
  "ICC Cricket World Cup", "Indian Premier League (IPL)", "Big Bash League (BBL)", "Ashes Series", 
  "Pakistan Super League (PSL)", "Caribbean Premier League (CPL)", "T20 World Cup", "Asia Cup", 
  "The Hundred", "Ranji Trophy",
  
  // Football Tournaments
  "FIFA World Cup", "UEFA Champions League", "English Premier League", "La Liga", 
  "Serie A", "Bundesliga", "Copa America", "Africa Cup of Nations", 
  "Copa del Rey", "FA Cup",
  
  // Basketball Tournaments
  "NBA Finals", "EuroLeague", "FIBA World Cup", "NCAA March Madness", "Olympic Basketball Tournament",
  "Basketball Champions League", "Copa del Rey de Baloncesto", "FIBA Asia Cup", 
  "Chinese Basketball Association (CBA)", "WNBA Finals",
  
  // Baseball Tournaments
  "World Series", "MLB Playoffs", "Nippon Professional Baseball (NPB)", "Caribbean Series", 
  "Korean Series", "College World Series", "Little League World Series", "Premier12", 
  "Arizona Fall League", "World Baseball Classic",
  
  // Ice Hockey Tournaments
  "Stanley Cup Playoffs", "IIHF World Championship", "Winter Olympics", "World Junior Championship", 
  "NHL All-Star Game", "Spengler Cup", "Kontinental Hockey League (KHL)", "Memorial Cup", 
  "Swedish Hockey League (SHL)", "Champions Hockey League (CHL)",
  
  // Rugby Tournaments
  "Rugby World Cup", "Six Nations Championship", "The Rugby Championship", "Heineken Champions Cup", 
  "Super Rugby", "Premiership Rugby", "Top 14", "Currie Cup", 
  "Pro14", "Mitre 10 Cup",
  
  // Tennis Tournaments
  "Wimbledon", "US Open", "Australian Open", "French Open", "ATP Finals",
  "WTA Finals", "Davis Cup", "Fed Cup", "Laver Cup", "Indian Wells Masters"
]

const PreferencesModal = ({ submitSignup, closeModal }) => {
  const [selectedSports, setSelectedSports] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedTournaments, setSelectedTournaments] = useState([]);

  useEffect(()=>{
    const preferences = localStorage.getItem('preferences'); // Get user_id from local storage
    const players = localStorage.getItem('players'); // Get user_id from local storage
    const teams = localStorage.getItem('teams'); // Get user_id from local storage
    const tournaments = localStorage.getItem('tournaments')
    setSelectedSports(JSON.parse(preferences))
    setSelectedPlayers(JSON.parse(players))
    setSelectedTeams(JSON.parse(teams))
    setSelectedTournaments(JSON.parse(tournaments))
  },[])
  const toggleSelection = (item, selectedItems, setSelectedItems) => {
    setSelectedItems(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleConfirm = () => {
      submitSignup({
        sports: selectedSports,
        players: selectedPlayers,
        teams: selectedTeams,
        tournaments: selectedTournaments,
      });
      closeModal();
    
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded-lg shadow-lg max-w-xl w-full mx-4 p-6">
      <h3 className="text-2xl font-semibold mb-4 text-center">Select Your Preferences</h3>

      {/* Scrollable Content Container */}
      <div className="overflow-y-auto max-h-[60vh] mb-4">
        {/* Sports Selection */}
        <div className="mb-4">
          <h4 className="text-lg font-medium mb-2">Sports</h4>
          <div className="flex flex-wrap gap-2">
            {sports.map((sport) => (
              <div
                key={sport}
                className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedSports.includes(sport) ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => toggleSelection(sport, selectedSports, setSelectedSports)}
              >
                {sport}
              </div>
            ))}
          </div>
        </div>

        {/* Players Selection */}
        <div className="mb-4">
          <h4 className="text-lg font-medium mb-2">Players</h4>
          <div className="flex flex-wrap gap-2">
            {players.map((player) => (
              <div
                key={player}
                className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedPlayers.includes(player) ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => toggleSelection(player, selectedPlayers, setSelectedPlayers)}
              >
                {player}
              </div>
            ))}
          </div>
        </div>

        {/* Teams Selection */}
        <div className="mb-4">
          <h4 className="text-lg font-medium mb-2">Teams</h4>
          <div className="flex flex-wrap gap-2">
            {teams.map((team) => (
              <div
                key={team}
                className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedTeams.includes(team) ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => toggleSelection(team, selectedTeams, setSelectedTeams)}
              >
                {team}
              </div>
            ))}
          </div>
        </div>

        {/* Tournaments Selection */}
        <div className="mb-4">
          <h4 className="text-lg font-medium mb-2">Tournaments</h4>
          <div className="flex flex-wrap gap-2">
            {tournaments.map((tournament) => (
              <div
                key={tournament}
                className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedTournaments.includes(tournament) ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => toggleSelection(tournament, selectedTournaments, setSelectedTournaments)}
              >
                {tournament}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <button onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded-lg text-gray-700 hover:bg-gray-400">
          Cancel
        </button>
        <button onClick={handleConfirm} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-red-600">
          Confirm
        </button>
      </div>
    </div>
  </div>
  );
};

export default PreferencesModal;
