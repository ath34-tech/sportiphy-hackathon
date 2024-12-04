// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import './css/App.css';
import SportPage from './pages/sportPage';
const App = () => {
  // Check for user_id in localStorage
  const userId = localStorage.getItem('user_id');

  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Redirect to Home if userId exists, else show Login and Signup */}
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/sports/:sport" element={<SportPage/>} />
          <Route path="/home" element={<Home /> } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
