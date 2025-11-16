import "../css/SearchBar.css";

function SearchBar({ searchQuery, setSearchQuery, handleSearch, loading }) {
  const isDisabled = searchQuery.trim() === "" || loading;

  return (
    <form onSubmit={handleSearch} className="search-form">
      <input
        value={searchQuery}
        type="text"
        placeholder="Search for a movie"
        className="search-input"
        onChange={(event) => setSearchQuery(event.target.value)}
      />

      <button type="submit" className="search-button" disabled={isDisabled}>
        {loading ? "..." : "Search"}
      </button>
    </form>
  );
}

export default SearchBar;
