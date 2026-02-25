"use client";
import { useEffect, useState } from "react";
const STORAGE_KEY = "kv-theme-v2";
function applyTheme(theme) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
}
function ThemeToggle() {
  const [theme, setTheme] = useState("dark");
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const preferred = stored ?? "dark";
    setTheme(preferred);
    applyTheme(preferred);
  }, []);
  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
    void fetch("/api/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "theme", value: next })
    });
  }
  return <button
    type="button"
    onClick={toggleTheme}
    className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/90 px-3 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm shadow-emerald-100 transition hover:border-emerald-300 hover:text-emerald-700"
    aria-label="Toggle light or dark theme"
  >
      <span className="h-2 w-2 rounded-full bg-emerald-500" />
      {theme === "light" ? "Light" : "Dark"}
    </button>;
}
export { ThemeToggle };
