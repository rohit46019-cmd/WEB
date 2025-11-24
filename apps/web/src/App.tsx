import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ForgotPassword from "./components/auth/ForgotPassword";
import RecycleBin from "./pages/RecycleBin";
import Settings from "./pages/Settings";
import AdminDashboard from "./components/admin/AdminDashboard";
import { useAuthStore } from "./store/auth.store";

export default function App() {
  const { token, user } = useAuthStore();

  return (
    <div className={user?.theme || "dark"}>
      <Navbar />
      <main style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={token ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/recycle" element={token ? <RecycleBin /> : <Navigate to="/login" replace />} />
          <Route path="/settings" element={token ? <Settings /> : <Navigate to="/login" replace />} />
          <Route path="/admin" element={user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
