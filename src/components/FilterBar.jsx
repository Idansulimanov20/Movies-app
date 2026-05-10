import "../css/FilterBar.css";
import { FaCalendarAlt, FaChevronDown } from "react-icons/fa";
import { useMemo, useState } from "react";

function FilterBar({ filterText, setFilterText, yearFilter, setYearFilter }) {
  const [yearMenuOpen, setYearMenuOpen] = useState(false);
  const years = useMemo(
    () => Array.from({ length: 50 }, (_, i) => String(2027 - i)),
    []
  );
  const selectedYearLabel = yearFilter || "All Years";

  const selectYear = (year) => {
    setYearFilter(year);
    setYearMenuOpen(false);
  };

  return (
    <div className="filter-row">
      <input
        type="text"
        className="filter-input"
        placeholder="Filter search results by title..."
        value={filterText}
        onChange={(event) => setFilterText(event.target.value)}
      />
      <div
        className={`filter-year-picker ${yearMenuOpen ? "open" : ""}`}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setYearMenuOpen(false);
          }
        }}
      >
        <button
          type="button"
          className="filter-year-button"
          onClick={() => setYearMenuOpen((open) => !open)}
          aria-haspopup="listbox"
          aria-expanded={yearMenuOpen}
        >
          <FaCalendarAlt className="filter-year-icon" aria-hidden="true" />
          <span>{selectedYearLabel}</span>
          <FaChevronDown
            className={`filter-year-chevron ${yearMenuOpen ? "open" : ""}`}
            aria-hidden="true"
          />
        </button>

        {yearMenuOpen && (
          <div className="filter-year-menu" role="listbox" aria-label="Filter by release year">
            <button
              type="button"
              className={`filter-year-option ${yearFilter === "" ? "active" : ""}`}
              onClick={() => selectYear("")}
              role="option"
              aria-selected={yearFilter === ""}
            >
              All Years
            </button>
            {years.map((year) => (
              <button
                type="button"
                key={year}
                className={`filter-year-option ${yearFilter === year ? "active" : ""}`}
                onClick={() => selectYear(year)}
                role="option"
                aria-selected={yearFilter === year}
              >
                {year}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FilterBar;
