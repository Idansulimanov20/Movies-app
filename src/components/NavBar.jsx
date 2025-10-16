import { NavLink } from "react-router-dom";
import "../css/NavBar.css";
import logo from "../assets/icon.png";

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-section">
        <NavLink to="/" className="nav-link">
          Movie App 🎥
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
        <NavLink to="/login" className="nav-link login-btn">
          Login
        </NavLink>
      </div>
    </nav>
  );
}

export default NavBar;
