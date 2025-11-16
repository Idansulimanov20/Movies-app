import "../css/ControlsBar.css";
function FilterBar({ filterText, setFilterText, yearFilter, setYearFilter }) {
  return (
    <div className="filter-bar">
      <input
        type="text"
        className="filter-input"
        placeholder="Filter by title..."
        value={filterText}
        onChange={(event) => setFilterText(event.target.value)}
      />

      <select
        className="filter-select"
        value={yearFilter}
        onChange={(event) => setYearFilter(event.target.value)}
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
  );
}

export default FilterBar;
