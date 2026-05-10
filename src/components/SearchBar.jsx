import "../css/SearchBar.css";
import { FaSearch, FaTimes } from "react-icons/fa";

function SearchBar({ searchQuery, setSearchQuery, handleSearch, loading }) {
  const isDisabled = searchQuery.trim() === "" || loading;

  return (
    <form className="search-row" onSubmit={handleSearch} role="search">
      <div className="search-field">
        <FaSearch className="search-icon" aria-hidden="true" />
        <input
          type="search"
          className="search-input"
          placeholder="Search movies, actors, genres..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          aria-label="Search movies"
        />
        {searchQuery && (
          <button
            type="button"
            className="search-clear-button"
            onClick={() => setSearchQuery("")}
            aria-label="Clear search"
          >
            <FaTimes aria-hidden="true" />
          </button>
        )}
      </div>
      <button
        type="submit"
        className="search-button"
        disabled={isDisabled}
      >
        {loading ? "Searching" : "Search"}
      </button>
    </form>
  );
}

export default SearchBar;
