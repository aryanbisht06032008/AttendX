import {
  FaBuilding,
  FaCheckCircle,
  FaTimesCircle,
  FaUsers,
  FaChartLine,
  FaBolt,
  FaBook,
  FaLayerGroup,
  FaStopwatch,
} from "react-icons/fa";

function StatCard({ title, value, color = "amber", icon }) {
  const styles = {
    amber: {
      gradient: "from-amber-500 to-amber-700",
      icon: <FaBuilding />,
    },
    green: {
      gradient: "from-emerald-500 to-green-600",
      icon: <FaCheckCircle />,
    },
    red: {
      gradient: "from-rose-500 to-red-600",
      icon: <FaTimesCircle />,
    },
    blue: {
      gradient: "from-sky-500 to-blue-600",
      icon: <FaUsers />,
    },
    indigo: {
      gradient: "from-indigo-500 to-blue-600",
      icon: <FaChartLine />,
    },
    violet: {
      gradient: "from-violet-500 to-purple-600",
      icon: <FaBolt />,
    },
    teal: {
      gradient: "from-teal-400 to-emerald-600",
      icon: <FaLayerGroup />,
    },
    orange: {
      gradient: "from-orange-400 to-amber-600",
      icon: <FaBook />,
    },
    cyan: {
      gradient: "from-cyan-400 to-sky-600",
      icon: <FaStopwatch />,
    },
  };

  const active = styles[color] || styles.amber;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900">
      {/* Decorative corner glow */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-amber-500/15 to-transparent opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {value}
          </h2>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl text-white shadow-glow-sm ${active.gradient}`}
        >
          {icon || active.icon}
        </div>
      </div>
    </div>
  );
}

export default StatCard;
