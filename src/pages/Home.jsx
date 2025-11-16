import { useEffect, useState } from "react";
import MoviesGrid from "../components/MoviesGrid";
import "../css/Home.css";
import { searchMovies, getPopularMovies } from "../services/api";
import SearchBar from "../components/SearchBar";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterText, setFilterText] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const moviesData = await getPopularMovies();
        setMovies(moviesData);
      } catch (err) {
        console.log(err);
        setError("Error fetching data. Try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!searchQuery.trim()) return;
    if (loading) return;
    setLoading(true);
    try {
      const searchResults = await searchMovies(searchQuery);
      setMovies(searchResults);
      setError(null);
      setFilterText("");
    } catch (err) {
      console.log(err);
      setError("Error fetching data. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filteredMovies = movies.filter(
    (movie) =>
      movie.title &&
      movie.title.toLowerCase().startsWith(filterText.toLowerCase())
  );

  return (
    <div className="home">
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        loading={loading}
      />

      <input
        type="text"
        className="filter-input"
        placeholder="Filter results..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="movies-loader-container">
          <div className="movies-loader"></div>
        </div>
      ) : (
        <MoviesGrid movies={filteredMovies} />
      )}
    </div>
  );
}

export default Home;
