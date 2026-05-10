import { useState } from "react";
import { NavLink } from "react-router-dom";
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
        <div className="navbar-section">
          <NavLink to="/" className="nav-link">
            About Us
          </NavLink>
        </div>

        <div className="navbar-center">
          <img src={logo} alt="logo" className="navbar-logo" />
          <span className="navbar-title">Watch & Chill</span>
        </div>

        <div className="navbar-section">
          <NavLink to="/home" className="nav-link">
            Home
          </NavLink>
          <NavLink to="/favorites" className="nav-link">
            Favorites
          </NavLink>
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
                <span className="nav-account-text">{user?.name}</span>
              </button>
              <button type="button" className="logout-button" onClick={logout}>
                Logout
              </button>
            </div>
          ) : (
            <NavLink to="/login" className="nav-link login-btn">
              Login
            </NavLink>
          )}
        </div>
      </nav>

      <UserProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}

export default NavBar;
