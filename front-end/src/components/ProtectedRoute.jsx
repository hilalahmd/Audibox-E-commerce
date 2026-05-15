import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { user, loadingAuth } = useAuth();

  if (loadingAuth) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
        {/* Premium Minimalist Spinner */}
        <div className="w-12 h-12 border-2 border-white/5 border-t-white rounded-full animate-spin mb-4" />
        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold">
          Authenticating
        </p>
      </div>
    );
  }

  if (!user) {
    // replace: true ensures the user can't go "back" to a protected route after logout
    return <Navigate to="/login" replace />;
  }

  return children;
};