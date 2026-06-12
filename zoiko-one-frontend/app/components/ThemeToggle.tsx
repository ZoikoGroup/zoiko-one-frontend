"use client";

import { useTheme } from "../lib/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <label id="theme-toggle-button" htmlFor="toggle">
      <input
        type="checkbox"
        id="toggle"
        checked={isDark}
        onChange={toggleTheme}
      />
      <svg
        xmlSpace="preserve"
        viewBox="0 0 90 45"
        height="100%"
        width="100%"
        preserveAspectRatio="xMidYMid meet"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible", display: "block" }}
      >
        <defs>
          <path
            id="gentle-wave"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          />
        </defs>
        <rect
          className="light"
          y="0"
          x="0"
          rx="22.5"
          height="45"
          width="90"
          id="container"
          fill="#357ded"
        />
        <g id="patches" />
        <g id="stars">
          <path
            d="M 17.5 12.5 L 17.7 13.8 L 19 14 L 17.7 14.2 L 17.5 15.5 L 17.3 14.2 L 16 14 L 17.3 13.8 Z"
            fill="#fff"
          />
          <path
            d="M 32.5 7.5 L 32.7 8.8 L 34 9 L 32.7 9.2 L 32.5 10.5 L 32.3 9.2 L 31 9 L 32.3 8.8 Z"
            fill="#fff"
          />
          <path
            d="M 22.5 27.5 L 22.7 28.8 L 24 29 L 22.7 29.2 L 22.5 30.5 L 22.3 29.2 L 21 29 L 22.3 28.8 Z"
            fill="#fff"
          />
        </g>
        <g id="cloud">
          <path
            d="M 12 36 L 45 36 A 6 6 0 0 0 45 24 A 12 12 0 0 0 24 20 A 9 9 0 0 0 12 24 A 6 6 0 0 0 12 36 Z"
            fill="#fff"
          />
        </g>
        <g id="button">
          <circle cy="22.5" cx="22.5" r="18.5" fill="#fce43a" />
          <path
            d="M 22.5 10.5 A 12 12 0 0 1 34.5 22.5 A 12 12 0 0 1 22.5 34.5 A 12 12 0 0 1 10.5 22.5 A 12 12 0 0 1 22.5 10.5 Z"
            id="sun"
            fill="#eed21f"
          />
          <path
            d="M 22 10.5 A 12.5 12.5 0 0 0 9.5 23 A 12.5 12.5 0 0 0 22 35.5 A 12.5 12.5 0 0 0 34.5 23 A 12.5 12.5 0 0 0 22 10.5 Z M 27 15.5 A 7.5 7.5 0 0 1 34.5 23 A 7.5 7.5 0 0 1 27 30.5 A 7.5 7.5 0 0 1 19.5 23 A 7.5 7.5 0 0 1 27 15.5 Z"
            id="moon"
            fill="#dbe2e3"
          />
        </g>
      </svg>
    </label>
  );
}
