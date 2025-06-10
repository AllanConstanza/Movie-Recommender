import React, { useEffect, useState, useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import './App.css';

const API_BASE = 'https://movie-backend-lqru.onrender.com'; // Replace with your deployed backend URL

function WatchLater() {
  const [movies, setMovies] = useState([]);
  const { darkMode } = useContext(ThemeContext);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    fetchWatchLater();
  }, []);

  const fetchWatchLater = async () => {
    try {
      const response = await fetch(`${API_BASE}/watch-later`);
      const data = await response.json();
      setMovies(data.movies);
    } catch (err) {
      console.error("Failed to fetch Watch Later list:", err);
    }
  };

  const removeMovie = async (title) => {
    try {
      const response = await fetch(`${API_BASE}/watch-later`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      const data = await response.json();
      setStatusMessage("❌ Removed from Watch Later");
      setTimeout(() => setStatusMessage(''), 2000);
      fetchWatchLater();
    } catch (err) {
      console.error("Error removing movie:", err);
    }
  };

  return (
    <div className={darkMode ? 'dark-mode' : ''} style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      {statusMessage && <div className="status-msg">{statusMessage}</div>}

      <h2 style={{ textAlign: 'center' }}>📌 Watch Later List</h2>

      <div className="movie-grid">
        {movies.length > 0 ? (
          movies.map((movie, idx) => (
            <div key={idx} className="movie-card fade-in">
              <div
                onClick={() => removeMovie(movie.title)}
                className="remove-icon"
                title="Remove from Watch Later"
              >
                ✕
              </div>
              {movie.poster ? (
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster}`}
                  alt={movie.title}
                  className="movie-img"
                />
              ) : (
                <div className="no-img">No Image</div>
              )}
              <h3>{movie.title}</h3>
              <p>{movie.overview}</p>
            </div>
          ))
        ) : (
          <p className="empty-msg">You have no movies saved yet.</p>
        )}
      </div>
    </div>
  );
}

export default WatchLater;

