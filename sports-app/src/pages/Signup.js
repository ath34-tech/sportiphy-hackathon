// Signup.js
import React, { useState } from 'react';
import PreferencesModal from '../components/PreferencesModal';
import '../css/App.css';
import { Link ,useNavigate} from 'react-router-dom';
import ReactLoading from 'react-loading';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPreferences, setShowPreferences] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = () => {
    setShowPreferences(true);
  };

  const submitSignup = (preferences) => {
    const userData = { "username":username, "email":email, "password":password, "preferences":preferences.sports,"players":preferences.players,"teams":preferences.teams,"tournaments":preferences.tournaments};
    setLoading(true);
    fetch('http://localhost:5000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })
      .then(response => response.json())
      .then(data => {
        console.log('User signed up:', data)
        localStorage.setItem('user_id',data.uid); // Get user_id from local storage
        localStorage.setItem('preferences', JSON.stringify(preferences.sports)); // Get user_id from local storage
        localStorage.setItem('players', JSON.stringify(preferences.players)); // Get user_id from local storage
        localStorage.setItem('teams', JSON.stringify(preferences.teams)); // Get user_id from local storage
        localStorage.setItem('tournaments', JSON.stringify(preferences.tournaments)); // Get user_id from local storage

        fetch('http://localhost:5000/fetch_news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ preferences }),  // Send preferences directly
        })
          .then(() => {navigate('/home');
            window.location.reload();


          })
          .catch(error => {
            console.error('Error fetching news:', error);
            navigate('/home');
            window.location.reload();


          });
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    loading ? (
      <ReactLoading type={'bubbles'} color={'black'} height={'50%'} width={'70%'} className='w-full max-w-md mx-auto h-screen flex items-center'/>                    
    ) : (
      <div className="min-h-screen bg-gradient-to-br from-black-400 to-white-500 flex items-center justify-center flex-col">
        <h1 className="text-4xl font-bold text-black mb-8 font-poppins">Sportiphy</h1>

        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Sign Up</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-green-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-green-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mb-6 border border-gray-300 rounded focus:outline-none focus:border-green-500"
          />
          <button
            onClick={handleSignup}
            className="w-full bg-black hover:bg-green-600 text-white font-bold py-2 rounded transition duration-200"
          >
            Next
          </button>
          <p className="mt-4 text-gray-600">
            Already have an account?{' '}
            <Link to="/" className="text-black hover:underline">
              Login
            </Link>
          </p>
        </div>

        {showPreferences && (
          <PreferencesModal
            submitSignup={submitSignup}
            closeModal={() => setShowPreferences(false)}
          />
        )}
      </div>
    )
  );
};
export default Signup;
