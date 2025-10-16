import { NavLink } from "react-router-dom";
import "../css/DefaultPage.css";
import {
  FaFire,
  FaHeart,
  FaSearch,
  FaStar,
  FaFilm,
  FaClock,
} from "react-icons/fa";

function DefaultPage() {
  return (
    <div className="default-page">
      <h1 className="welcome-title">🎬 Welcome to Watch & Chill!</h1>

      <p className="welcome-text">
        Your ultimate destination for discovering and saving your favorite
        movies. Whether you're into blockbusters, timeless classics, or hidden
        indie gems — we’ve got you covered.
      </p>

      <div className="features">
        <div className="feature-item">
          <FaFire className="feature-icon" />
          <h3>Trending Now</h3>
          <p>Stay up-to-date with the hottest and most popular movies.</p>
        </div>

        <div className="feature-item">
          <FaSearch className="feature-icon" />
          <h3>Smart Search</h3>
          <p>Find any movie in seconds — from cult hits to new releases.</p>
        </div>

        <div className="feature-item">
          <FaHeart className="feature-icon" />
          <h3>Favorites</h3>
          <p>Save what you love and build your own personalized movie list.</p>
        </div>

        <div className="feature-item">
          <FaStar className="feature-icon" />
          <h3>Top Rated</h3>
          <p>Explore top-rated movies and discover what others are watching.</p>
        </div>

        <div className="feature-item">
          <FaFilm className="feature-icon" />
          <h3>New Releases</h3>
          <p>Catch the latest movies as soon as they hit the screens.</p>
        </div>

        <div className="feature-item">
          <FaClock className="feature-icon" />
          <h3>Watch Later</h3>
          <p>Plan your movie nights by adding films to your watchlist.</p>
        </div>
      </div>

      <p className="final-line">
        Sit back, relax, and let the magic of cinema begin 🎥✨
      </p>

      <NavLink to="/login" className="get-started-btn">
        Get Started
      </NavLink>
    </div>
  );
}

export default DefaultPage;
