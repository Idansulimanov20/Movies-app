import { Link } from "react-router-dom";
import Loader from "./Loader";
import { useAuth } from "../context/useAuth";
import "../css/Favorites.css";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loader />;

  if (!isAuthenticated) {
    return (
      <div className="favorites-auth-required">
        <h2>Favorites are saved for signed-in users</h2>
        <p>
          Sign in to save movies, keep your favorites in sync, and open them
          later from any session.
        </p>
        <Link
          to="/login"
          state={{ authRequired: true }}
          className="favorites-login-link"
        >
          Go to login
        </Link>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
