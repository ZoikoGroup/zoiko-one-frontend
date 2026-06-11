"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "../lib/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="theme-toggle-btn relative inline-flex h-12 w-12 items-center justify-center rounded-3xl border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      <span
        className="absolute inset-0 flex items-center justify-center transition-all duration-300"
        style={{ opacity: isDark ? 1 : 0, transform: isDark ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0.5)" }}
      >
        <Moon className="h-5 w-5 theme-icon-moon" />
      </span>
      <span
        className="absolute inset-0 flex items-center justify-center transition-all duration-300"
        style={{ opacity: isDark ? 0 : 1, transform: isDark ? "rotate(-90deg) scale(0.5)" : "rotate(0deg) scale(1)" }}
      >
        <Sun className="h-5 w-5 theme-icon-sun" />
      </span>
    </button>
  );
}
