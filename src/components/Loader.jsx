import "../css/Loader.css";

const loaderLogo =
  "data:image/png;base64,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";

function Loader() {
  return (
    <div className="movies-loader-container" role="status" aria-live="polite">
      <div className="movies-loader-shell" aria-hidden="true">
        <div className="movies-loader-ring"></div>
        <div className="movies-loader-core">
          <img
            src={loaderLogo}
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
