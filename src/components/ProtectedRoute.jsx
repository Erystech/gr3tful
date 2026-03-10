import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { session } = useAuth();

  // Still loading session — render nothing to avoid flash
  if (session === undefined) return null;

  // Not logged in — redirect to login
  if (session === null) return <Navigate to="/login" replace />;

  return children;
}