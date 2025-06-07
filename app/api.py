import requests 
import  sqlite3

API_KEY = "8dde78186347488fbdc6995321354e7c"
BASE_URL = "https://api.themoviedb.org/3"

def get_genre_id(genre_name: str):
    genre_name = genre_name.strip().lower()  # <- normalize user input
    response = requests.get(f"{BASE_URL}/genre/movie/list", params={"api_key": API_KEY})
    genres = response.json().get("genres", [])
    for genre in genres:
        if genre["name"].lower() == genre_name:
            return genre["id"]
    return None


def search_movies_by_genre_and_keywords(genre: str, keywords: str):
    genre_id = get_genre_id(genre)
    if not genre_id:
        print("Invalid Genre.")
        return []

    keyword_id = None

    if keywords.strip():
        # Step 1: Search TMDb for the keyword ID
        keyword_response = requests.get(f"{BASE_URL}/search/keyword", params={
            "api_key": API_KEY,
            "query": keywords
        })
        keyword_results = keyword_response.json().get("results", [])
        if keyword_results:
            keyword_id = keyword_results[0]["id"]
        else:
            print(f"No keyword found for '{keywords}' — showing genre only.")
    
    # Step 2: Discover movies using genre and keyword ID (if found)
    discover_params = {
        "api_key": API_KEY,
        "with_genres": genre_id,
        "sort_by": "popularity.desc"
    }

    if keyword_id:
        discover_params["with_keywords"] = keyword_id

    response = requests.get(f"{BASE_URL}/discover/movie", params=discover_params)
    return response.json().get("results", [])


def init_db():
    conn = sqlite3.connect("movies.db")
    c = conn.cursor() 
    #create table 'watched' only if it doesnt already exist
    c.execute('''CREATE TABLE IF NOT EXISTS watched ( 
              id INTEGER PRIMARY KEY, 
              title TEXT, 
              rating INTEGER
            )''')
    conn.commit()
    conn.close()

def add_to_watched(title, rating):
    conn = sqlite3.connect("movies.db")
    c = conn.cursor()
    c.execute("INSERT INTO watched (title, rating) VALUES (?, ?)", (title, rating))
    conn.commit()
    conn.close()


def show_watched():
    conn = sqlite3.connect("movies.db")
    c = conn.cursor()
    for row in c.execute("SELECT title, rating FROM watched"):
        print(f"{row[0]} - Rated: {row[1]}/5")
    conn.close()




