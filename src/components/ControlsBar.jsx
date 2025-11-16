import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import "../css/ControlsBar.css";

function ControlsBar({
  searchQuery,
  setSearchQuery,
  handleSearch,
  loading,
  filterText,
  setFilterText,
  yearFilter,
  setYearFilter,
}) {
  return (
    <div className="controls-bar">
      {/* שורת החיפוש */}
      <div className="search-row">
        <input
          type="text"
          className="search-input"
          placeholder="Search for a movie"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="search-button"
          onClick={handleSearch}
          disabled={searchQuery.trim() === "" || loading}
        >
          {loading ? "..." : "Search"}
        </button>
      </div>

      {/* שורת הפילטר */}
      <div className="filter-row">
        <input
          type="text"
          className="filter-input"
          placeholder="Filter search results by title..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <select
          className="filter-select"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
        >
          <option value="">All Years</option>
          {Array.from({ length: 50 }).map((_, i) => {
            const year = 2027 - i;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}

export default ControlsBar;
