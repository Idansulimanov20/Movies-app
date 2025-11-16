import { useEffect, useState } from "react";
import MoviesGrid from "../components/MoviesGrid";
import ControlsBar from "../components/ControlsBar";
import Loader from "../components/Loader";

import "../css/Home.css";
import { searchMovies, getPopularMovies } from "../services/api";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterText, setFilterText] = useState("");
  const [yearFilter, setYearFilter] = useState("");
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
      setYearFilter("");
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error fetching data. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filteredMovies = movies.filter((movie) => {
    const matchesTitle =
      movie.title &&
      movie.title.toLowerCase().includes(filterText.toLowerCase());

    const matchesYear =
      !yearFilter ||
      (movie.release_date && movie.release_date.startsWith(yearFilter));

    return matchesTitle && matchesYear;
  });

  return (
    <div className="home">
      <ControlsBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        loading={loading}
        filterText={filterText}
        setFilterText={setFilterText}
        yearFilter={yearFilter}
        setYearFilter={setYearFilter}
      />

      {error && <div className="error-message">{error}</div>}

      {loading ? <Loader /> : <MoviesGrid movies={filteredMovies} />}
    </div>
  );
}

export default Home;
