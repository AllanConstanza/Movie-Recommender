# 🎬 Movie Recommender App

**Please allow up to 30 seconds to initially load in movies**
A full stack web application that helps users discover popular and genre-specific movies, and save favorites to a “Watch Later” list.

🌐 **Live Website**:  
🔗 [https://movie-recommender-frontend-6xfo.onrender.com/](https://movie-recommender-frontend-6xfo.onrender.com/)

---

## Built With

### Frontend
- **React.js** (with functional components and hooks)
- **CSS** for styling and responsiveness
- **Render (Static Site)** for deployment

### Backend
- **Flask** (Python web framework)
- **SQLite** for persistent watch-later storage
- **TMDB API** (The Movie Database) for real movie data
- **Render** for backend hosting (free version takes few seconds to start up)

---

## Features

- Browse popular movies
- Search for recommendations by genre and keywords
- Add movies to your **Watch Later** list
- Remove movies from Watch Later
- Toggle light/dark theme
- Feedback messages on actions (e.g. added/removed)

---

## How It Works
**Please allow up to 30 seconds to initially load in movies**

- On load, the app fetches **popular movies** from the TMDB API.
- Users can search using **genre** and optional **keywords**.
- Movie cards show title, poster, and a brief description.
- Clicking ➕ adds a movie to your Watch Later list (unless already saved).
- The **Watch Later** page shows all saved movies and lets users remove them.
- Changes are stored in a local SQLite database on the Flask backend.
