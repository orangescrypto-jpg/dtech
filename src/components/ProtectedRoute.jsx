import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="section-container py-32 flex justify-center">
        <Loader2 className="animate-spin text-brand-blue w-10 h-10" />
      </div>
    );
  }

  // Redirect unauthenticated users to /admin (which shows the login screen)
  if (!user) return <Navigate to="/admin" replace />;

  return children;
}
