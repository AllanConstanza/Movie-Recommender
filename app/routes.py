from flask import Blueprint, request, jsonify
from .api import search_movies_by_genre_and_keywords, add_to_watched, show_watched
import sqlite3
import requests

TMDB_API_KEY = "8dde78186347488fbdc6995321354e7c"

main = Blueprint("main", __name__)

@main.route('/watch-later', methods=['POST'])
def add_to_watch_later():
    data = request.get_json()
    title = data.get("title")
    overview = data.get("overview")
    poster = data.get("poster")

    conn = sqlite3.connect("movies.db")
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS watch_later (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT UNIQUE,
            overview TEXT,
            poster TEXT
        )
    ''')

    # Check if movie already exists
    c.execute("SELECT 1 FROM watch_later WHERE title = ?", (title,))
    if c.fetchone():
        conn.close()
        return jsonify({"message": "Movie already in Watch Later."}), 409

    c.execute("INSERT INTO watch_later (title, overview, poster) VALUES (?, ?, ?)", (title, overview, poster))
    conn.commit()
    conn.close()

    return jsonify({"message": "Movie added to watch later!"}), 201
@main.route('/watch-later', methods=['GET'])
def get_watch_later():
    conn = sqlite3.connect("movies.db")
    c = conn.cursor()
    c.execute("SELECT title, overview, poster FROM watch_later")
    movies = [{"title": row[0], "overview": row[1], "poster": row[2]} for row in c.fetchall()]
    conn.close()
    return jsonify({"movies": movies})

@main.route("/recommend")
def recommend():
    genre = request.args.get("genre")
    keywords = request.args.get("keywords", "")

    movies = search_movies_by_genre_and_keywords(genre, keywords)

    results = []
    for movie in movies[:12]:
        results.append({
            "title": movie.get("title"),
            "overview": movie.get("overview", "")[:150] + "..." if movie.get("overview") else "",
            "poster": movie.get("poster_path")
        })

    return jsonify({"movies": results})

@main.route('/watch-later', methods=['DELETE'])
def remove_from_watch_later():
    data = request.get_json()
    title = data.get("title")

    conn = sqlite3.connect("movies.db")
    c = conn.cursor()
    c.execute("DELETE FROM watch_later WHERE title = ?", (title,))
    conn.commit()
    conn.close()

    return jsonify({"message": f"{title} removed from Watch Later!"}), 200



@main.route("/popular")
def popular_movies():
    url = f"https://api.themoviedb.org/3/movie/popular?api_key={TMDB_API_KEY}&language=en-US&page=1"
    response = requests.get(url)
    if response.status_code != 200:
        return jsonify({"movies": []})

    data = response.json().get("results", [])
    movies = []
    for movie in data[:12]:
        movies.append({
            "title": movie.get("title"),
            "overview": movie.get("overview", "")[:150] + "...",
            "poster": movie.get("poster_path")
        })

    return jsonify({"movies": movies})

@main.route("/test", methods=["GET"])
def test_route():
    return jsonify({"message": "Test route works!"})
