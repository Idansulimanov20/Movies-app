import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaCompass, FaHeart, FaHome, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import "../css/NavBar.css";
import logo from "../assets/icon.png";
import { useAuth } from "../context/useAuth";
import UserProfileModal from "./UserProfileModal";

function NavBar() {
  const { isAuthenticated, logout, user } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const initials = (user?.name || user?.username || "U").slice(0, 1).toUpperCase();

  return (
    <>
      <nav className="navbar">
        <Link to="/home" className="navbar-brand" aria-label="Watch and Chill home">
          <img src={logo} alt="logo" className="navbar-logo" />
          <span className="navbar-copy">
            <span className="navbar-title">Watch & Chill</span>
            <span className="navbar-tagline">Stream your next favorite</span>
          </span>
        </Link>

        <div className="navbar-links" aria-label="Primary navigation">
          <NavLink to="/" className="nav-link">
            <FaCompass aria-hidden="true" />
            <span>Discover</span>
          </NavLink>
          <NavLink to="/home" className="nav-link">
            <FaHome aria-hidden="true" />
            <span>Home</span>
          </NavLink>
          <NavLink to="/ai-assistance" className="nav-link">
            <HiSparkles aria-hidden="true" />
            <span>AI</span>
          </NavLink>
          <NavLink to="/favorites" className="nav-link">
            <FaHeart aria-hidden="true" />
            <span>Favorites</span>
          </NavLink>
        </div>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <div className="nav-account">
              <button
                type="button"
                className="nav-profile-button"
                onClick={() => setProfileOpen(true)}
                aria-label="Open profile settings"
              >
                <span className="nav-avatar">
                  {user?.avatar ? <img src={user.avatar} alt="" /> : initials}
                </span>
                <span className="nav-account-copy">
                  <span className="nav-account-label">Profile</span>
                  <span className="nav-account-text">{user?.name || user?.username}</span>
                </span>
              </button>
              <button type="button" className="logout-button" onClick={logout}>
                <FaSignOutAlt aria-hidden="true" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <NavLink to="/login" className="nav-link login-btn">
              <FaSignInAlt aria-hidden="true" />
              <span>Login</span>
            </NavLink>
          )}
        </div>
      </nav>

      <UserProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}

export default NavBar;
