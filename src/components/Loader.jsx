import "../css/Loader.css";
import logo from "../assets/icon-loader.png";

function Loader() {
  return (
    <div className="movies-loader-container" role="status" aria-live="polite">
      <div className="movies-loader-shell" aria-hidden="true">
        <div className="movies-loader-ring"></div>
        <div className="movies-loader-core">
          <img
            src={logo}
            alt=""
            className="movies-loader-logo"
            loading="eager"
            decoding="sync"
            fetchPriority="high"
          />
        </div>
      </div>
      <div className="movies-loader-bars" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <span className="movies-loader-label">Loading movies</span>
    </div>
  );
}

export default Loader;
