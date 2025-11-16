import "../css/FilterBar.css";

function FilterBar({ filterText, setFilterText }) {
  return (
    <input
      type="text"
      placeholder="Filter results..."
      className="filter-input"
      value={filterText}
      onChange={(e) => setFilterText(e.target.value)}
    />
  );
}

export default FilterBar;
