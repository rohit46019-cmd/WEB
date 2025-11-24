import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import SearchBar from "../search/SearchBar";
import { useAuthStore } from "../../store/auth.store";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  return (
    <header className="glass" style={{ display: "flex", gap: 16, alignItems: "center", padding: 12 }}>
      <img src="/logo.png" alt="CloudBox" style={{ width: 36, height: 36, borderRadius: 8 }} />
      <Link to="/">CloudBox</Link>
      <SearchBar />
      <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
        <ThemeToggle />
        {user ? (
          <>
            <span>{user.email}</span>
            <button onClick={logout} className="glass" style={{ padding: "6px 10px" }}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </header>
  );
}
