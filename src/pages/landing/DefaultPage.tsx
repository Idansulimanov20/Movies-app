import { NavLink } from "react-router-dom";
import { FaArrowRight, FaHeart, FaPlay, FaSearch, FaStar } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { useAuth } from "../../contexts/useAuth";
import "../../styles/DefaultPage.css";
import { usePopularMovies } from "../../hooks/usePopularMovies";

const discoveryCards = [
  { title: "Explore movies", copy: "Search popular titles and find a new favorite.", to: "/home", icon: FaSearch },
  { title: "Ask the assistant", copy: "Get picks for a mood, moment, or movie night.", to: "/ai-assistance", icon: HiSparkles },
  { title: "Build your list", copy: "Keep every great suggestion ready for later.", to: "/favorites", icon: FaHeart },
];
const moodLinks = ["Action", "Comedy", "Thriller", "Romance", "Family"];

function DefaultPage() {
  const { isAuthenticated } = useAuth();
  const popularMovies = usePopularMovies();

  return (
    <div className="default-page cinematic-home">
      <section className="cinematic-hero" aria-labelledby="home-title">
        {popularMovies[0]?.poster_path && <img className="hero-backdrop" src={`https://image.tmdb.org/t/p/original${popularMovies[0].poster_path}`} alt="" aria-hidden="true" />}
        <div className="cinematic-copy">
          <p className="welcome-kicker">Tonight&apos;s best escape</p>
          <h1 id="home-title">Find a movie worth cancelling plans for.</h1>
          <p className="welcome-text">
            Personal picks, fresh discoveries, and a watchlist built around your actual taste.
          </p>
          <div className="welcome-actions">
            <NavLink to="/home" className="get-started-btn">
              <FaPlay aria-hidden="true" />
              Start discovering
            </NavLink>
            <NavLink to={isAuthenticated ? "/favorites" : "/login"} className="welcome-secondary-btn">
              {isAuthenticated ? "View your watchlist" : "Sign in to save picks"}
            </NavLink>
          </div>
          <div className="mood-row" aria-label="Explore by mood">
            <span>Pick a mood</span>{moodLinks.map((mood) => <NavLink key={mood} to="/home">{mood}</NavLink>)}
          </div>
        </div>
        <div className="cinematic-poster" aria-label="Popular movies right now">
          <span className="poster-label">POPULAR NOW</span>
          <div className="popular-poster-stack">
            {popularMovies.length > 0 ? popularMovies.slice(0, 6).map((movie, index) => (
              <img
                key={movie.id}
                className={`popular-poster poster-${index + 1}`}
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                loading={index === 0 ? "eager" : "lazy"}
              />
            )) : <span className="poster-loading">Loading tonight&apos;s picks…</span>}
          </div>
          <span className="poster-caption"><FaPlay aria-hidden="true" /> Your next favorite starts here</span>
        </div>
      </section>

      <section className="popular-section" aria-labelledby="popular-title">
        <div className="popular-heading">
          <div>
            <p className="welcome-kicker">Popular tonight</p>
            <h2 id="popular-title">The movies everyone is talking about.</h2>
          </div>
          <NavLink to="/home" className="section-link">See all movies <FaArrowRight aria-hidden="true" /></NavLink>
        </div>
        <div className="popular-movies-grid">
          {popularMovies.slice(0, 6).map((movie, index) => (
            <NavLink key={movie.id} to="/home" className="popular-movie-card" aria-label={`Discover ${movie.title}`}>
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} loading={index < 3 ? "eager" : "lazy"} />
              <span className="popular-movie-gradient" aria-hidden="true" />
              <span className="popular-movie-rank">{String(index + 1).padStart(2, "0")}</span>
              <span className="popular-movie-copy"><strong>{movie.title}</strong><span>{movie.release_date?.slice(0, 4) || "Coming soon"}</span></span>
            </NavLink>
          ))}
          {popularMovies.length === 0 && <div className="popular-loading">Loading popular movies…</div>}
        </div>
      </section>

      <section className="discovery-section" aria-labelledby="discovery-title">
        <div className="section-heading">
          <p className="welcome-kicker">Make it a great night</p>
          <h2 id="discovery-title">One place for every kind of movie mood.</h2>
        </div>
        <div className="discovery-grid">
          {discoveryCards.map(({ title, copy, to, icon: Icon }) => (
            <NavLink key={title} to={to} className="discovery-card">
              <span className="discovery-icon"><Icon aria-hidden="true" /></span>
              <span className="discovery-card-content"><strong>{title}</strong><span>{copy}</span></span>
              <FaArrowRight className="discovery-arrow" aria-hidden="true" />
            </NavLink>
          ))}
        </div>
      </section>

      <section className="ai-spotlight" aria-labelledby="ai-spotlight-title">
        <div className="ai-spotlight-orb orb-one" aria-hidden="true" />
        <div className="ai-spotlight-orb orb-two" aria-hidden="true" />
        <div className="ai-spotlight-icon"><HiSparkles aria-hidden="true" /></div>
        <div className="ai-spotlight-copy">
          <p className="welcome-kicker">Watch &amp; Chill AI</p>
          <h2 id="ai-spotlight-title">A good recommendation starts with a feeling.</h2>
          <p>Tell us the vibe—rainy Sunday, loud action, a smart mystery—and get a movie-night lineup made for it.</p>
        </div>
        <NavLink to="/ai-assistance" className="ai-spotlight-button">Try AI picks <FaStar aria-hidden="true" /></NavLink>
      </section>
    </div>
  );
}

export default DefaultPage;
