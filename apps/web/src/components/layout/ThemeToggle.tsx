import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  useEffect(() => {
    document.body.className = theme === "light" ? "light" : "dark";
    localStorage.setItem("theme", theme);
  }, [theme]);
  return (
    <button className="glass" onClick={() => setTheme(theme === "light" ? "dark" : "light")} style={{ padding: "6px 10px" }}>
      {theme === "light" ? "Dark" : "Light"}
    </button>
  );
}
