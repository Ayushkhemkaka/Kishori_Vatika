"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem("kv-theme") as Theme | null;
    const preferred: Theme = stored ?? "light";
    setTheme(preferred);
    applyTheme(preferred);
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    window.localStorage.setItem("kv-theme", next);
    applyTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/90 px-3 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm shadow-emerald-100 transition hover:border-emerald-300 hover:text-emerald-700"
      aria-label="Toggle light or dark theme"
    >
      <span className="h-2 w-2 rounded-full bg-emerald-500" />
      {theme === "light" ? "Light" : "Dark"}
    </button>
  );
}
