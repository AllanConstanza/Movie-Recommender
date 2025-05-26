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
                while True:
                    rating_input = input(f"Rate '{selected['title']}' out of 5: ")
                    try:
                        rating = int(rating_input)
                        if 1 <= rating <= 5:
                            add_to_watched(selected['title'], rating)
                            break
                        else:
                            print("Please enter a number between 1 and 5.")
                    except ValueError:
                        print("Invalid input. Please enter a whole number like 4 or 5.")
            elif idx.strip() != "":
                print("Invalid selection. Please enter a number between 1 and 5, or leave blank to skip.")


        elif choice == "2":
            show_watched()
        elif choice == "3":
            break
        else:
            print("Invalid input.")

if __name__ == "__main__":
    main()
