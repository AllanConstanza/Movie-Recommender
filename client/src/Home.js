import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { ResetContext } from './ResetContext';
import './App.css';

function Home() {
    const [genre, setGenre] = useState('');
    const [keywords, setKeywords] = useState('');
    const [movies, setMovies] = useState([]);
    const [watchLater, setWatchLater] = useState([]);
    const [searchTriggered, setSearchTriggered] = useState(false);
    const { darkMode } = useContext(ThemeContext);
    const { resetFlag } = useContext(ResetContext);
    const [statusMessage, setStatusMessage] = useState('');


    const fetchPopularMovies = async () => {
        try {
            const res = await fetch('http://localhost:5050/popular');
            const data = await res.json();
            setMovies(data.movies);
            setSearchTriggered(false);
        } catch (err) {
            console.error("Failed to fetch popular movies:", err);
        }
    };

    useEffect(() => {
        fetchPopularMovies();
    }, []);

    useEffect(() => {
        if (resetFlag) {
            setGenre('');
            setKeywords('');
            fetchPopularMovies();
        }
    }, [resetFlag]);

    const getRecommendations = async () => {
        try {
            const response = await fetch(
                `http://localhost:5050/recommend?genre=${genre}&keywords=${keywords}`
            );
            const data = await response.json();
            setMovies(data.movies || []);
            setSearchTriggered(true);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    const saveToWatchLater = async (movie) => {
        if (watchLater.includes(movie.title)) {
            setStatusMessage("❗ Already in Watch Later");
            setTimeout(() => setStatusMessage(''), 2000);
            return;
        }

        try {
            const response = await fetch('http://localhost:5050/watch-later', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(movie),
            });
            const data = await response.json();
            setWatchLater((prev) => [...prev, movie.title]);
            setStatusMessage("✅ Added to Watch Later");
            setTimeout(() => setStatusMessage(''), 2000);
        } catch (err) {
            console.error("Error saving movie:", err);
        }
    };


    return (
        <div className={darkMode ? 'dark-mode' : ''} style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center' }}>🎬 Movie Recommender</h1>
            {statusMessage && (
                <div className="status-msg">{statusMessage}</div>
            )}


            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <input
                    type="text"
                    placeholder="Genre (e.g., horror)"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    style={{ padding: '0.5rem', flex: 1 }}
                />
                <input
                    type="text"
                    placeholder="Keywords (optional)"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    style={{ padding: '0.5rem', flex: 1 }}
                />
                <button onClick={getRecommendations} style={{ padding: '0.5rem 1rem' }}>
                    Search
                </button>
            </div>

            <h2 style={{ textAlign: 'center' }}>
                {searchTriggered ? '🎯 Recommendations' : '🔥 Popular Right Now'}
            </h2>

            <div className="movie-grid">
                {movies.length > 0 ? (
                    movies.map((movie, index) => (
                        <div key={index} className="movie-card fade-in">
                            <div
                                onClick={() => {
                                    if (!watchLater.includes(movie.title)) {
                                        saveToWatchLater(movie);
                                    }
                                }}
                                className="watch-icon"
                            >
                                {watchLater.includes(movie.title) ? '✔️' : '➕'}
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
                    <p className="empty-msg">No movies to show.</p>
                )}
            </div>
        </div>
    );
}

export default Home;
