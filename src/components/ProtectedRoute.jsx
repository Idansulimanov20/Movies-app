import { Link } from "react-router-dom";
import { FaHeart, FaLock } from "react-icons/fa";
import Loader from "./Loader";
import { useAuth } from "../context/useAuth";
import "../css/Favorites.css";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loader />;

  if (!isAuthenticated) {
    return (
      <div className="favorites-auth-required">
        <span className="favorites-auth-icon">
          <FaLock aria-hidden="true" />
        </span>
        <p className="favorites-eyebrow">Private watchlist</p>
        <h2>Sign in to save your favorite movies</h2>
        <p>
          Favorites are synced to your account so your movie picks stay
          available whenever you come back.
        </p>
        <Link
          to="/login"
          state={{ authRequired: true }}
          className="favorites-login-link"
        >
          <FaHeart aria-hidden="true" />
          Sign in and save favorites
        </Link>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
