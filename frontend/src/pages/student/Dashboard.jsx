import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaQrcode,
  FaHistory,
  FaSignOutAlt,
  FaArrowRight,
  FaChartPie,
} from "react-icons/fa";
import ThemeToggle from "../../components/ui/ThemeToggle";

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const firstName = (user?.name || "Student").split(" ")[0];

  const actions = [
    {
      title: "Scan Attendance",
      description:
        "Scan the QR code displayed by your teacher to mark your attendance instantly.",
      navigateTo: "/student/attendance-scanner",
      icon: <FaQrcode />,
      gradient: "from-amber-500 to-amber-700",
      buttonClass:
        "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-glow-sm hover:shadow-glow",
      glow: "bg-amber-500/20",
    },
    {
      title: "Attendance History",
      description:
        "Review your attendance records, status, subjects, teachers and attendance percentage.",
      navigateTo: "/student/attendance-history",
      icon: <FaHistory />,
      gradient: "from-sky-500 to-blue-600",
      buttonClass:
        "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-[0_4px_14px_-6px_rgb(14_165_233/0.5)] hover:shadow-[0_8px_20px_-8px_rgb(14_165_233/0.6)]",
      glow: "bg-sky-500/20",
    },
    {
      title: "Attendance Report",
      description:
        "Visualize your attendance percentage per subject with charts and performance insights.",
      navigateTo: "/student/attendance-report",
      icon: <FaChartPie />,
      gradient: "from-violet-500 to-purple-600",
      buttonClass:
        "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-[0_4px_14px_-6px_rgb(139_92_246/0.5)] hover:shadow-[0_8px_20px_-8px_rgb(139_92_246/0.6)]",
      glow: "bg-violet-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-app p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        {/* ================= HERO ================= */}
        <div className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-br from-amber-600 via-amber-700 to-[#2a0a61] p-8 shadow-glow sm:p-10">
          <div className="pointer-events-none absolute inset-0 opacity-20">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-amber-300/30 blur-3xl" />
          </div>

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-200">
                Student Portal
              </p>
              <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Hi {firstName} 👋
              </h1>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-amber-100/90">
                Manage your attendance with a quick QR scan or explore your
                complete history and performance.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start">
              <ThemeToggle className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20" />

              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* ================= ATTENDANCE ACTIONS ================= */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {actions.map((action) => (
            <button
              key={action.title}
              type="button"
              onClick={() => navigate(action.navigateTo)}
              className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-8 text-left shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900"
            >
              <div
                className={`pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full ${action.glow} opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100`}
              />

              <div
                className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br text-3xl text-white shadow-glow-sm transition-transform duration-300 group-hover:scale-110 ${action.gradient}`}
              >
                {action.icon}
              </div>

              <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {action.title}
              </h2>

              <p className="mt-2 mb-8 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {action.description}
              </p>

              <span
                className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200 group-hover:gap-3 ${action.buttonClass}`}
              >
                Get Started
                <FaArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
