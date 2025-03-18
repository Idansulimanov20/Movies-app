# Movie Website - React + API

This is a feature-rich **Movie Website** built using **React** for the front-end framework. The project integrates with an external movie API to provide users with an immersive movie browsing experience.

## Project Overview

This interactive website allows users to browse movies, search for specific titles, and save their favorites for later viewing. The application demonstrates effective use of React's core hooks system for state management and component lifecycle handling.

## Features

* **External API Integration**: Connects to a movie API to fetch comprehensive movie data.
* **Search Functionality**: Easily find movies by title with a responsive search feature.
* **Favorites System**: Save and manage your favorite movies with just one click.
* **React Hooks**: Utilizes useState, useEffect, and useContext for efficient state management.
* **Responsive Design**: Works seamlessly across desktop and mobile devices.

## Installation

To run this project locally, follow these steps:

1. **Clone the repository**:

```
git clone https://github.com/your-username/movie-website.git
```

2. **Navigate into the project directory**:

```
cd movie-website
```

3. **Install dependencies**:

```
npm install
```

4. **Create a .env file and add your API key**:

```
REACT_APP_API_KEY=your_api_key_here
```

5. **Start the development server**:

```
npm start
```

This will start the React development server. Open your browser and go to `http://localhost:3000` to use the application!

## Technologies Used

* **React**: Frontend framework to build the interactive movie website.
* **React Hooks**: useState, useEffect, and useContext for state management.
* **External Movie API**: Provides access to a vast database of movies and related information.
* **LocalStorage**: Persists user favorites across sessions.

## How React Hooks are Used

### useState

```jsx
// For managing movie data
const [movies, setMovies] = useState([]);

// For handling search
const [searchQuery, setSearchQuery] = useState('');

// For tracking loading states
const [isLoading, setIsLoading] = useState(true);
```

### useEffect

```jsx
// Fetching movies from the API
useEffect(() => {
  const fetchMovies = async () => {
    const data = await fetchTrendingMovies();
    setMovies(data.results);
    setIsLoading(false);
  };
  
  fetchMovies();
}, []);

// Searching for movies when query changes
useEffect(() => {
  if (searchQuery) {
    const searchMovies = async () => {
      const results = await searchMoviesByTitle(searchQuery);
      setSearchResults(results);
    };
    
    searchMovies();
  }
}, [searchQuery]);
```

### useContext

```jsx
// Setting up the favorites context
const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  
  // Functions to manage favorites
  const addFavorite = (movie) => {...};
  const removeFavorite = (id) => {...};
  
  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Using the context in components
const MovieCard = ({ movie }) => {
  const { favorites, addFavorite, removeFavorite } = useContext(FavoritesContext);
  
  const isFavorite = favorites.some(fav => fav.id === movie.id);
  
  return (
    <div className="movie-card">
      <h3>{movie.title}</h3>
      <button onClick={() => isFavorite ? removeFavorite(movie.id) : addFavorite(movie)}>
        {isFavorite ? '❤️' : '🤍'}
      </button>
    </div>
  );
};
```

## How to Use

1. Browse trending movies on the homepage.
2. Use the search bar to find specific movies by title.
3. Click the heart icon to add movies to your favorites.
4. Navigate to the favorites page to view and manage your saved movies.

## Customization

* You can modify the API endpoints to fetch different types of movie data.
* The favorites system can be extended to include ratings or personal notes.
* The UI can be customized to match your preferred style and branding.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
