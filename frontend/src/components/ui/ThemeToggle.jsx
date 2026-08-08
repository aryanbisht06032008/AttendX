import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border transition-all duration-300 ${
        isDark
          ? "border-white/10 bg-white/10 text-amber-300 hover:bg-white/20"
          : "border-slate-200 bg-white text-slate-500 shadow-soft hover:bg-amber-50 hover:text-amber-600"
      } ${className}`}
    >
      <span
        key={theme}
        className="animate-fade-in"
        style={{ display: "flex" }}
      >
        {isDark ? <FaSun /> : <FaMoon />}
      </span>
    </button>
  );
}

export default ThemeToggle;
