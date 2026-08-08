import { useEffect, useState } from "react";

import AdminLayout from "../../components/layout/AdminLayout";
import StatCard from "../../components/ui/StatCard";
import { useAuth } from "../../context/AuthContext";
import { getAdminDashboard } from "../../services/dashboardService";

import {
  FaBuilding,
  FaBook,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaBookOpen,
  FaLayerGroup,
  FaStopwatch,
} from "react-icons/fa";

function Dashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);

  async function fetchDashboard() {
    try {
      const data = await getAdminDashboard();
      setDashboard(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (!dashboard) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-32">
          <div className="flex flex-col items-center gap-4">
            <span className="h-10 w-10 animate-spin rounded-full border-4 border-amber-200 border-t-amber-600" />
            <p className="text-sm font-medium text-slate-500">
              Loading dashboard...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const firstName = (user?.name || "Admin").split(" ")[0];
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <AdminLayout>
      {/* Hero banner */}
      <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-amber-600 via-amber-700 to-[#2a0a61] p-8 shadow-glow sm:p-10">
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-amber-300/30 blur-3xl" />
        </div>

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-200">
              {today}
            </p>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Welcome back, {firstName} 👋
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-amber-100/90">
              Here's what's happening across your institution today. Start a
              live QR session, manage departments, and keep every class
              accounted for.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-2xl">
              <FaStopwatch className="text-white" />
            </div>
            <div>
              <p className="font-display text-2xl font-extrabold leading-none text-white">
                {dashboard.activeSessions}
              </p>
              <p className="mt-1 text-xs font-medium text-amber-100/80">
                Active Sessions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Departments"
          value={dashboard.departments}
          color="amber"
          icon={<FaBuilding />}
        />
        <StatCard
          title="Courses"
          value={dashboard.courses}
          color="orange"
          icon={<FaBook />}
        />
        <StatCard
          title="Programs"
          value={dashboard.programs}
          color="indigo"
          icon={<FaGraduationCap />}
        />
        <StatCard
          title="Teachers"
          value={dashboard.teachers}
          color="blue"
          icon={<FaChalkboardTeacher />}
        />
        <StatCard
          title="Students"
          value={dashboard.students}
          color="green"
          icon={<FaUserGraduate />}
        />
        <StatCard
          title="Subjects"
          value={dashboard.subjects}
          color="violet"
          icon={<FaBookOpen />}
        />
        <StatCard
          title="Sections"
          value={dashboard.sections}
          color="teal"
          icon={<FaLayerGroup />}
        />
        <StatCard
          title="Active Sessions"
          value={dashboard.activeSessions}
          color="cyan"
          icon={<FaStopwatch />}
        />
      </div>
    </AdminLayout>
  );
}

export default Dashboard;
