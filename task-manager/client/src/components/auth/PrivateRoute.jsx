import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to login page but save the attempted url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default PrivateRoute;
