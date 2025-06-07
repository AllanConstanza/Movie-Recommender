// App.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';
import Home from './Home';
import WatchLater from './WatchLater';
import { ThemeProvider, ThemeContext } from './ThemeContext';
import { ResetProvider, ResetContext } from './ResetContext';
import './App.css';

function NavBar() {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { triggerReset } = useContext(ResetContext);
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
    setTimeout(() => triggerReset(), 50);
  };

  return (
    <div className={darkMode ? 'navbar dark' : 'navbar'}>
      <Link to="/" onClick={handleHomeClick} className="nav-link">🏠 Home</Link>
      <Link to="/watch-later" className="nav-link">📌 Watch Later</Link>
      <button onClick={toggleTheme} className="theme-toggle">
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>
    </div>
  );
}

function AppWrapper() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/watch-later" element={<WatchLater />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ResetProvider>
        <Router>
          <AppWrapper />
        </Router>
      </ResetProvider>
    </ThemeProvider>
  );
}

export default App;
