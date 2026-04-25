import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { session } = useAuth();

  // Still loading session — render nothing to avoid flash
  if (session === undefined) return (
     <div className="min-h-screen bg-fwhite flex items-center justify-center">
        <span className="font-parag text-secondary-text text-sm italic animate-pulse">
          Loading…
        </span>
    </div>
  );

  // Not logged in — redirect to login
  if (session === null) return <Navigate to="/login" replace />;

  return children;
}