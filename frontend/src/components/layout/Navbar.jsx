import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSignOutAlt, FaBars, FaRegBell } from "react-icons/fa";
import ThemeToggle from "../ui/ThemeToggle";

const PAGE_TITLES = {
  "/admin": "Dashboard",
  "/admin/departments": "Departments",
  "/admin/programs": "Programs",
  "/admin/subjects": "Subjects",
  "/admin/teachers": "Teachers",
  "/admin/teacher-assignments": "Teacher Assignments",
  "/admin/students": "Students",
  "/admin/sections": "Sections",
  "/admin/users": "Users",
};

function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const userName = user?.name || "Administrator";
  const userRole = (user?.role || "ADMIN").toLowerCase();
  const pageTitle = PAGE_TITLES[location.pathname] || "Dashboard";

  const firstLetter = userName.charAt(0).toUpperCase();

  const roleStyles = {
    admin: "bg-rose-100 text-rose-700",
    teacher: "bg-emerald-100 text-emerald-700",
    student: "bg-sky-100 text-sky-700",
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/80">
      <div className="flex min-h-[76px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 lg:hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          >
            <FaBars />
          </button>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-amber-600">
              AttendX Admin
            </p>
            <h2 className="mt-0.5 font-display text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
              {pageTitle}
            </h2>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Theme toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <button
            type="button"
            title="Notifications"
            className="relative hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 sm:flex dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          >
            <FaRegBell />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white" />
          </button>

          {/* System Status */}
          <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3.5 py-2 lg:flex">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold text-emerald-700">
              System Online
            </span>
          </div>

          <div className="hidden h-10 w-px bg-slate-200 sm:block dark:bg-slate-800" />

          {/* User */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-sm font-bold text-white shadow-glow-sm ring-2 ring-white">
              {firstLetter}
            </div>

            <div className="hidden sm:block">
              <p className="max-w-[180px] truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                {userName}
              </p>
              <span
                className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${roleStyles[userRole] || "bg-slate-100 text-slate-600"}`}
              >
                {userRole}
              </span>
            </div>
          </div>

          {/* LOGOUT BUTTON */}
          <button
            type="button"
            onClick={handleLogout}
            title="Logout"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-600 transition hover:bg-rose-100 hover:text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20 dark:hover:text-rose-300"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
