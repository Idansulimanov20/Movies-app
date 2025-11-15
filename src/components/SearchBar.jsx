function SearchBar({ searchQuery, setSearchQuery, handleSearch, loading }) {
  return (
    <form onSubmit={handleSearch} className="search-form">
      <input
        value={searchQuery}
        type="text"
        placeholder="Search for a movie"
        className="search-input"
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <button type="submit" className="search-button" disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}

export default SearchBar;
