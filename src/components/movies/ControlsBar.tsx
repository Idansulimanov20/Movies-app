import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import "../../styles/ControlsBar.css";

function ControlsBar({
  searchQuery,
  setSearchQuery,
  handleSearch,
  handleClearSearch,
  loading,
  filters,
  genres,
  hasActiveFilters,
  applyFilters,
  clearFilters,
}) {
  return (
    <div className="controls-bar">
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        handleClearSearch={handleClearSearch}
        loading={loading}
      />
      <FilterBar
        filters={filters}
        genres={genres}
        hasActiveFilters={hasActiveFilters}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
        loading={loading}
      />
    </div>
  );
}

export default ControlsBar;
