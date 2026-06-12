import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { token, isGuest } = useContext(AuthContext);

  if (!token && !isGuest) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;