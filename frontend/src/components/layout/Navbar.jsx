import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userName = user?.name || "Administrator";
  const userRole = user?.role || "ADMIN";

  const firstLetter = userName.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">

      <div className="flex min-h-[76px] items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* LEFT */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            AttendX Admin
          </p>

          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Dashboard
          </h2>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* System Status */}
          <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 sm:flex">

            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>

            <span className="text-xs font-semibold text-emerald-700">
              System Online
            </span>

          </div>

          <div className="hidden h-10 w-px bg-slate-200 sm:block" />

          {/* User */}
          <div className="flex items-center gap-3">

            <div className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              bg-gradient-to-br
              from-blue-500
              to-indigo-600
              text-sm
              font-bold
              text-white
              shadow-md
            ">
              {firstLetter}
            </div>

            <div className="hidden text-right sm:block">
              <p className="max-w-[180px] truncate text-sm font-bold text-slate-800">
                {userName}
              </p>

              <p className="mt-0.5 text-xs font-medium text-slate-500">
                {userRole}
              </p>
            </div>

          </div>

          {/* LOGOUT BUTTON */}
          <button
            type="button"
            onClick={handleLogout}
            title="Logout"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-red-100
              bg-red-50
              text-red-600
              transition
              hover:bg-red-100
              hover:text-red-700
            "
          >
            <FaSignOutAlt />
          </button>

        </div>

      </div>

    </header>
  );
}

export default Navbar;