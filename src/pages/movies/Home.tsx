import MoviesGrid from "../../components/movies/MoviesGrid";
import ControlsBar from "../../components/movies/ControlsBar";
import Loader from "../../components/Loader";
import "../../styles/Home.css";
import { useHomePage } from "../../hooks/useHomePage";

function Home() {
  const {
    searchQuery,
    setSearchQuery,
    filters,
    genres,
    hasActiveFilters,
    loading,
    handleSearch,
    handleClearSearch,
    applyFilters,
    clearFilters,
    filteredMovies,
  } = useHomePage();

  return (
    <div className="home">
      <ControlsBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        handleClearSearch={handleClearSearch}
        loading={loading}
        filters={filters}
        genres={genres}
        hasActiveFilters={hasActiveFilters}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
      />

      {loading ? <Loader /> : <>
        <MoviesGrid movies={filteredMovies} />
      </>}
    </div>
  );
}

export default Home;
