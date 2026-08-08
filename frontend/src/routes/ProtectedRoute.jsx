import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  // Wait until authentication state is restored
  // from localStorage
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-app">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-glow">
            <span className="h-7 w-7 animate-spin rounded-full border-[3px] border-white/30 border-t-white" />
          </div>
          <p className="text-sm font-semibold text-slate-500">Loading AttendX...</p>
        </div>
      </div>
    );
  }

  // User is not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // User does not have required role
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;