import { NavLink } from "react-router-dom";

import {
  FaHome,
  FaBuilding,
  FaBook,
  FaBookOpen,
  FaChalkboardTeacher,
  FaGraduationCap,
  FaUsers,
  FaLayerGroup,
  FaListOl,
  FaTimes,
} from "react-icons/fa";

const menuItems = [
  { name: "Dashboard", path: "/admin", icon: <FaHome />, end: true },
  { name: "Departments", path: "/admin/departments", icon: <FaBuilding /> },
  { name: "Programs", path: "/admin/programs", icon: <FaBook /> },
  { name: "Semesters", path: "/admin/semesters", icon: <FaListOl /> },
  { name: "Subjects", path: "/admin/subjects", icon: <FaBookOpen /> },
  { name: "Teachers", path: "/admin/teachers", icon: <FaUsers /> },
  {
    name: "Teacher Assignments",
    path: "/admin/teacher-assignments",
    icon: <FaChalkboardTeacher />,
  },
  { name: "Students", path: "/admin/students", icon: <FaGraduationCap /> },
  { name: "Sections", path: "/admin/sections", icon: <FaLayerGroup /> },
  { name: "Users", path: "/admin/users", icon: <FaUsers /> },
];

function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile drawer overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 animate-fade-in bg-slate-950/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-950 bg-gradient-to-b from-slate-950 via-[#150b33] to-[#2a0a61] shadow-2xl transition-transform duration-300 lg:translate-x-0 lg:shadow-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-6 pb-6 pt-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 font-display text-xl font-extrabold text-white shadow-glow">
              A
            </div>
            <div>
              <h1 className="font-display text-xl font-extrabold tracking-tight text-white">
                AttendX
              </h1>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">
                Attendance System
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <FaTimes />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 pb-6">
          <p className="px-3 pb-2 pt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Menu
          </p>

          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-glow"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* System status footer */}
        <div className="px-6 py-5">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <p className="text-xs font-semibold text-white">System Online</p>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              All services operational
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
