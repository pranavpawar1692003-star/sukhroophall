import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const AdminLoginRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-royal">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  // If already authenticated, redirect to admin
  if (user) {
    return <Navigate to="/admin" replace />;
  }

  // Check if we were redirected here from the /admin route (via ProtectedRoute)
  const cameFromAdmin = location.state?.from?.pathname?.startsWith("/admin");

  if (!cameFromAdmin) {
    // If accessed directly via URL, redirect to home page
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
