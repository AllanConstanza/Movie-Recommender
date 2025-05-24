from app.api import search_movies_by_genre_and_keywords, init_db, add_to_watched, show_watched

def main():
    init_db()
    while True:
        choice = input("\nChoose: [1] Recommend, [2] Show Watched, [3] Quit: ")
        if choice == "1":
            genre = input("Genre (e.g., horror): ")
            keywords = input("Keywords (optional): ")
            movies = search_movies_by_genre_and_keywords(genre, keywords)
            for i, movie in enumerate(movies[:5]):
                print(f"{i+1}. {movie['title']} - {movie.get('overview', '')[:80]}...")
            idx = input("Enter number to mark as watched and rate (or skip): ")
            if idx.isdigit():
                selected = movies[int(idx)-1]
                rating = input(f"Rate '{selected['title']}' out of 5: ")
                add_to_watched(selected['title'], int(rating))
        elif choice == "2":
            show_watched()
        elif choice == "3":
            break
        else:
            print("Invalid input.")

if __name__ == "__main__":
    main()
