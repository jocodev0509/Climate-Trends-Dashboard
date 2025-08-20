import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/index';
import RegisterPage from './pages/register';
import DashboardPage from './pages/dashboard';
import { Header } from './components/layout/Header';
import { AdminPanel } from './components/admin/AdminPanel';
import { useEffect } from 'react';
import { Loader2 } from "lucide-react";

import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false
}) => {
  const { isHydrated, user, token } = useAuthStore();

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    console.log("Calling hydrate...");
    hydrate();
  }, [hydrate]);

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Header />
          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <DashboardPage />
          </main></ProtectedRoute>} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <Header />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <AdminPanel />
            </main>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;