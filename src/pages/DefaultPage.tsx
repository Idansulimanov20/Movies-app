import { NavLink } from "react-router-dom";
import "../css/DefaultPage.css";
import {
  FaClock,
  FaFilm,
  FaFire,
  FaHeart,
  FaPlay,
  FaSearch,
  FaStar,
} from "react-icons/fa";

function DefaultPage() {
  return (
    <div className="default-page">
      <section className="welcome-hero">
        <p className="welcome-kicker">Watch & Chill</p>
        <h1 className="welcome-title">Find the next movie worth your night</h1>
        <p className="welcome-text">
          Explore trending films, search across every mood, and keep a personal
          watchlist ready for when you finally press play.
        </p>
        <div className="welcome-actions">
          <NavLink to="/home" className="get-started-btn">
            <FaPlay aria-hidden="true" />
            Start exploring
          </NavLink>
          <NavLink to="/favorites" className="welcome-secondary-btn">
            Save favorites
          </NavLink>
        </div>
      </section>

      <div className="features">
        <div className="feature-item">
          <FaFire className="feature-icon" />
          <h3>Trending Now</h3>
          <p>Stay close to the movies people are talking about right now.</p>
        </div>

        <div className="feature-item">
          <FaSearch className="feature-icon" />
          <h3>Smart Search</h3>
          <p>Find the right title fast, from new releases to hidden gems.</p>
        </div>

        <div className="feature-item">
          <FaHeart className="feature-icon" />
          <h3>Favorites</h3>
          <p>Save the films you care about in a private personal library.</p>
        </div>

        <div className="feature-item">
          <FaStar className="feature-icon" />
          <h3>Top Rated</h3>
          <p>Browse acclaimed movies when you want something proven.</p>
        </div>

        <div className="feature-item">
          <FaFilm className="feature-icon" />
          <h3>New Releases</h3>
          <p>Keep up with fresh titles as they appear on your radar.</p>
        </div>

        <div className="feature-item">
          <FaClock className="feature-icon" />
          <h3>Watch Later</h3>
          <p>Plan your next movie night without losing track of a good pick.</p>
        </div>
      </div>

      <p className="final-line">Build a watchlist that feels made for you.</p>
    </div>
  );
}

export default DefaultPage;
