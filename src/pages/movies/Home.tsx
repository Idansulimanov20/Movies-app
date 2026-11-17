import MoviesGrid from "../../components/movies/MoviesGrid";
import ControlsBar from "../../components/movies/ControlsBar";
import Loader from "../../components/Loader";
import "../../styles/Home.css";
import { useHomePage } from "../../hooks/useHomePage";

function Home() {
  const {
    searchQuery,
    setSearchQuery,
    filterText,
    setFilterText,
    yearFilter,
    setYearFilter,
    loading,
    handleSearch,
    handleClearSearch,
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
        filterText={filterText}
        setFilterText={setFilterText}
        yearFilter={yearFilter}
        setYearFilter={setYearFilter}
      />

      {loading ? <Loader /> : <MoviesGrid movies={filteredMovies} />}
    </div>
  );
}

export default Home;
