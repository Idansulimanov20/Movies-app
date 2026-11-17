import { Drawer, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { FaCheck, FaSlidersH, FaStar, FaTimes } from "react-icons/fa";
import { DEFAULT_DISCOVERY_FILTERS } from "../../hooks/useHomePage";
import "../../styles/FilterBar.css";

const sortOptions = [
  { value: "popularity.desc", label: "Most popular" },
  { value: "vote_average.desc", label: "Top rated" },
  { value: "primary_release_date.desc", label: "Newest first" },
  { value: "primary_release_date.asc", label: "Oldest first" },
];

function FilterSelect({ label, value, options, onChange }) {
  return <div className="styled-select">
    <span className="styled-select-label">{label}</span>
    <Select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      inputProps={{ "aria-label": label }}
      MenuProps={{ slotProps: { paper: { sx: { backgroundColor: "#25282f", border: "1px solid rgba(255,255,255,.14)", borderRadius: "9px", color: "#d9dde4", marginTop: "4px", maxHeight: 260 } } } }}
      sx={{ backgroundColor: "#202329", borderRadius: "8px", color: "#f2f3f5", height: 42, width: "100%", ".MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,.12)" }, "&:hover .MuiOutlinedInput-notchedOutline, &.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(231,63,70,.72)" }, ".MuiSvgIcon-root": { color: "#9da5b0" } }}
    >
      {options.map((option) => <MenuItem key={option.value} value={option.value} sx={{ fontSize: ".83rem", fontWeight: 700, "&.Mui-selected, &.Mui-selected:hover, &:hover": { backgroundColor: "rgba(231,63,70,.15)", color: "#fff" } }}>{option.label}</MenuItem>)}
    </Select>
  </div>;
}

function FilterBar({ filters, genres, hasActiveFilters, applyFilters, clearFilters, loading }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(filters);
  const [rangeError, setRangeError] = useState("");
  const currentYear = new Date().getFullYear();

  useEffect(() => setDraft(filters), [filters, open]);
  useEffect(() => {
    const from = draft.yearFrom.trim();
    const to = draft.yearTo.trim();
    const isValidYear = (year) => /^\d{4}$/.test(year) && Number(year) >= 1888 && Number(year) <= currentYear + 1;

    if ((from && !isValidYear(from)) || (to && !isValidYear(to))) {
      setRangeError(`Enter a valid 4-digit year between 1888 and ${currentYear + 1}.`);
    } else if (from && to && Number(from) > Number(to)) {
      setRangeError("The starting year cannot be later than the ending year.");
    } else {
      setRangeError("");
    }
  }, [draft.yearFrom, draft.yearTo, currentYear]);
  useEffect(() => {
    const closeOnEscape = (event) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const updateYear = (key, value) => setDraft((current) => ({ ...current, [key]: value.replace(/\D/g, "").slice(0, 4) }));
  const toggleGenre = (genreId) => setDraft((current) => ({ ...current, genreIds: current.genreIds.includes(genreId) ? current.genreIds.filter((id) => id !== genreId) : [...current.genreIds, genreId] }));
  const apply = async () => { if (rangeError) return; await applyFilters(draft); setOpen(false); };
  const reset = () => { setDraft(DEFAULT_DISCOVERY_FILTERS); setRangeError(""); };
  const clearAll = async () => { reset(); setOpen(false); await clearFilters(); };
  const selectedGenreNames = genres.filter((genre) => filters.genreIds.includes(genre.id));
  const filterCount = selectedGenreNames.length + Number(Boolean(filters.titleQuery.trim())) + Number(Boolean(filters.yearFrom || filters.yearTo)) + Number(Boolean(filters.minRating)) + Number(filters.sortBy !== DEFAULT_DISCOVERY_FILTERS.sortBy);

  return <div className="discovery-filter">
    <div className="filter-toolbar">
      <div className="filter-toolbar-copy"><span className="filter-kicker">Curated for tonight</span><span className="filter-heading">Refine your discovery</span></div>
      <button type="button" className={`filters-trigger ${hasActiveFilters ? "has-filters" : ""}`} onClick={() => setOpen(true)} aria-expanded={open} aria-controls="discover-filter-drawer"><FaSlidersH aria-hidden="true" /><span>Filters</span>{hasActiveFilters && <span className="filter-count">{filterCount}</span>}</button>
    </div>

    {hasActiveFilters && <div className="active-filter-list" aria-label="Active filters">
      {filters.titleQuery.trim() && <span className="active-filter">Title: “{filters.titleQuery.trim()}”</span>}
      {selectedGenreNames.map((genre) => <span className="active-filter" key={genre.id}>{genre.name}</span>)}
      {(filters.yearFrom || filters.yearTo) && <span className="active-filter">{filters.yearFrom || "Any year"} – {filters.yearTo || "Now"}</span>}
      {filters.minRating > 0 && <span className="active-filter"><FaStar aria-hidden="true" /> {filters.minRating}+ rating</span>}
      {filters.sortBy !== DEFAULT_DISCOVERY_FILTERS.sortBy && <span className="active-filter">{sortOptions.find((option) => option.value === filters.sortBy)?.label}</span>}
      <button type="button" className="clear-active-filters" onClick={clearAll} disabled={loading}>Clear all</button>
    </div>}

    <Drawer
      anchor="right"
      open={open}
      onClose={() => setOpen(false)}
      slotProps={{ paper: { sx: { backgroundColor: "#15171c", borderLeft: "1px solid rgba(255,255,255,.12)", boxShadow: "-28px 0 70px rgba(0,0,0,.52)", width: { xs: "100%", sm: 460 } } } }}
    >
      <section id="discover-filter-drawer" className="filter-drawer" role="dialog" aria-modal="true" aria-label="Discover filters">
        <header className="filter-drawer-header"><div><span className="filter-kicker">Discover</span><h2>Find your next favorite</h2></div><button type="button" className="drawer-close" onClick={() => setOpen(false)} aria-label="Close filters"><FaTimes aria-hidden="true" /></button></header>
        <div className="filter-drawer-body">
          <section className="filter-section"><div className="filter-section-heading"><div><h3>Movie title</h3><p>Filter the current results by a title or keyword.</p></div></div><input className="filter-text-input" type="search" value={draft.titleQuery} onChange={(event) => setDraft((current) => ({ ...current, titleQuery: event.target.value }))} placeholder="Try “The Dark Knight” or “Batman”" aria-label="Filter by movie title" /></section>
          <section className="filter-section"><div className="filter-section-heading"><div><h3>Genres</h3><p>Mix and match moods. Movies from any chosen genre will appear.</p></div>{draft.genreIds.length > 0 && <span>{draft.genreIds.length} selected</span>}</div><div className="genre-chips">{genres.map((genre) => <button type="button" key={genre.id} aria-pressed={draft.genreIds.includes(genre.id)} className={`genre-chip ${draft.genreIds.includes(genre.id) ? "selected" : ""}`} onClick={() => toggleGenre(genre.id)}>{draft.genreIds.includes(genre.id) && <FaCheck aria-hidden="true" />}{genre.name}</button>)}</div></section>
          <section className="filter-section"><div className="filter-section-heading"><div><h3>Release window</h3><p>Enter a starting and ending year, or leave either side open.</p></div></div><div className="year-selects"><label className="year-input"><span>From</span><input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={4} value={draft.yearFrom} onChange={(event) => updateYear("yearFrom", event.target.value)} placeholder={`e.g. ${currentYear - 10}`} aria-label="Starting release year" /></label><span>to</span><label className="year-input"><span>To</span><input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={4} value={draft.yearTo} onChange={(event) => updateYear("yearTo", event.target.value)} placeholder={`e.g. ${currentYear}`} aria-label="Ending release year" /></label></div>{rangeError && <p className="filter-range-error" role="alert">{rangeError}</p>}</section>
          <section className="filter-section"><h3>Minimum community rating</h3><div className="rating-options">{[0, 6, 7, 8].map((rating) => <button type="button" key={rating} aria-pressed={draft.minRating === rating} className={draft.minRating === rating ? "selected" : ""} onClick={() => setDraft((current) => ({ ...current, minRating: rating }))}>{rating === 0 ? "Any rating" : <><FaStar aria-hidden="true" /> {rating}.0+</>}</button>)}</div></section>
          <section className="filter-section"><h3>Sort results</h3><FilterSelect label="Order" value={draft.sortBy} options={sortOptions} onChange={(value) => setDraft((current) => ({ ...current, sortBy: value }))} /></section>
        </div>
        <footer className="filter-drawer-footer"><button type="button" className="filter-reset" onClick={reset}>Reset filters</button><button type="button" className="filter-apply" onClick={apply} disabled={loading || Boolean(rangeError)}>{loading ? "Finding movies…" : "Show movies"}</button></footer>
      </section>
    </Drawer>
  </div>;
}

export default FilterBar;
