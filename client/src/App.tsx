import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/index';
import RegisterPage from './pages/register';
import DashboardPage from './pages/dashboard';
import { useEffect } from 'react';

import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";
import type { JSX } from 'react';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = useAuthStore((state) => state.token);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  console.log({ token, isHydrated });

  if (!isHydrated) return <div>Loading...</div>;

  return token ? children : <Navigate to="/" />;
}


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
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;