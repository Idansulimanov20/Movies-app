import { useEffect, useState } from "react";
import MoviesGrid from "../components/MoviesGrid";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import Loader from "../components/Loader";

import "../css/Home.css";
import { searchMovies, getPopularMovies } from "../services/api";

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
        console.error(err);
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
      const results = await searchMovies(searchQuery);
      setMovies(results);
      setFilterText("");
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error fetching data. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filteredMovies = movies.filter((movie) =>
    movie.title?.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="home">
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        loading={loading}
      />

      <FilterBar filterText={filterText} setFilterText={setFilterText} />

      {error && <div className="error-message">{error}</div>}

      {loading ? <Loader /> : <MoviesGrid movies={filteredMovies} />}
    </div>
  );
}

export default Home;
