import { useAuthStore } from "@/features/auth/store";
import { Navigate } from "react-router-dom";

export default function AdminPage() {
  const user = useAuthStore((state) => state.user);

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">Admin Panel</h1>
      <p className="text-muted-foreground mt-2">
        Here you can manage users and climate data.
      </p>
      {/* Add AdminTables, user roles, analytics here later */}
    </main>
  );
}