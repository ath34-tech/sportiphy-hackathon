import React, { useState } from 'react';
import '../css/App.css';
import { Link, useNavigate } from 'react-router-dom';
import ReactLoading from 'react-loading';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);

    fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        var pref=data.preferences;
        console.log('User logged in:', data);
        localStorage.setItem('user_id',data.uid);
        localStorage.setItem('preferences', JSON.stringify(pref)); // Get user_id from local storage
        localStorage.setItem('tournaments', JSON.stringify(data.tournaments)); // Get user_id from local storage
        localStorage.setItem('players', JSON.stringify(data.players)); // Get user_id from local storage
        localStorage.setItem('teams', JSON.stringify(data.teams)); // Get user_id from local storage


        fetch('http://localhost:5000/fetch_news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pref }),  // Send preferences directly
        })
          .then(() => {

            navigate('/home');
            window.location.reload();

          }
        )
          .catch(error => {
            console.error('Error fetching news:', error);
            window.location.reload();


          });
               
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    loading?(
      <ReactLoading type={'bubbles'} color={'black'} height={'50%'} width={'70%'} className='w-full max-w-md mx-auto h-screen flex items-center'/>                    
    ):(
    <div className="min-h-screen bg-gradient-to-br from-white-500 to-black-400 flex items-center justify-center flex-col">
    <h1 className="text-4xl font-bold text-black mb-8 font-poppins">Sportiphy</h1>
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 mb-6 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
      />
      <button
        onClick={handleLogin}
        className="w-full bg-black hover:bg-blue-600 text-white font-bold py-2 rounded transition duration-200 "
      >
        Login
      </button>
      <p className="mt-4 text-gray-600">
        Don't have an account?{' '}
        <Link to="/signup" className="text-black-500 hover:underline ">
          Sign Up
        </Link>
      </p>
    </div>
  </div>
    )
  );
};

export default Login;
