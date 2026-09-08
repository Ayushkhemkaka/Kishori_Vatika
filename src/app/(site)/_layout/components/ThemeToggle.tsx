"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";
const STORAGE_KEY = "kv-theme-v2";

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    const preferred: Theme = stored ?? "light";
    setTheme(preferred);
    applyTheme(preferred);
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
    void fetch("/api/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "theme", value: next }),
    });
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-sm border border-emerald-200 bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-800 transition hover:border-emerald-400 hover:text-emerald-700"
      aria-label="Toggle light or dark theme"
    >
      <span className="h-2 w-2 rounded-full bg-emerald-500" />
      {theme === "light" ? "Light" : "Dark"}
    </button>
  );
}
