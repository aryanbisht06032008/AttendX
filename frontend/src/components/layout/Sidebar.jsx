import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBuilding,
  FaBook,
  FaGraduationCap,
  FaUsers,
} from "react-icons/fa";

const menuItems = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: <FaHome />,
  },
  {
    name: "Departments",
    path: "/admin/departments",
    icon: <FaBuilding />,
  },
  // {
  //   name: "Courses",
  //   path: "/admin/courses",
  //   icon: <FaBook />,
  // },
  {
    name: "Programs",
    path: "/admin/programs",
    icon: <FaGraduationCap />,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: <FaUsers />,
  },
];

function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-stone-200 border-r border-stone-300">

      <div className="p-8">
        <h1 className="text-3xl font-bold text-amber-800">
          AttendX
        </h1>

        <p className="text-stone-500 text-sm mt-1">
          Attendance System
        </p>
      </div>

      <nav className="px-4">

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 mb-2 transition-all duration-200 ${isActive
                ? "bg-amber-700 text-white shadow"
                : "text-stone-700 hover:bg-stone-300"
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}

      </nav>

    </aside>
  );
}

export default Sidebar;