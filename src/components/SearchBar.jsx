import "../css/SearchBar.css";

function SearchBar({ searchQuery, setSearchQuery, handleSearch, loading }) {
  const isDisabled = searchQuery.trim() === "" || loading;

  return (
    <div className="search-row">
      <input
        type="text"
        className="search-input"
        placeholder="Search for a movie"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
      />
      <button
        className="search-button"
        onClick={handleSearch}
        disabled={isDisabled}
      >
        {loading ? "..." : "Search"}
      </button>
    </div>
  );
}

export default SearchBar;
