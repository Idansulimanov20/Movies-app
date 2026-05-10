import { Navigate } from "react-router-dom";
import Loader from "./Loader";
import { useAuth } from "../context/useAuth";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ authRequired: true }} />;
  }

  return children;
}

export default ProtectedRoute;
