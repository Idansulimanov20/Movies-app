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
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        loading={loading}
      />
      <FilterBar
        filterText={filterText}
        setFilterText={setFilterText}
        yearFilter={yearFilter}
        setYearFilter={setYearFilter}
      />
    </div>
  );
}

export default ControlsBar;
