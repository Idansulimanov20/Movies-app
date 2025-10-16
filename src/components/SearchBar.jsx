import { FaSearch } from "react-icons/fa";

function SearchBar({ searchQuery, setSearchQuery, handleSearch }) {
  return (
    <form onSubmit={handleSearch} className="search-form">
      <div className="search-input-wrapper">
        <FaSearch className="search-icon" />
        <input
          value={searchQuery}
          type="text"
          placeholder="Search for a movie"
          className="search-input"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  );
}

export default SearchBar;
