import { useEffect, useState } from "react";

import AdminLayout from "../../components/layout/AdminLayout";
import StatCard from "../../components/ui/StatCard";

import { getAdminDashboard } from "../../services/dashboardService";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const data = await getAdminDashboard();
      setDashboard(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!dashboard) {
    return (
      <AdminLayout>
        <p className="text-stone-500">Loading dashboard...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>

      <h1 className="text-4xl font-bold text-stone-800 mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-6">

        <StatCard
          title="Departments"
          value={dashboard.departments}
        />

        <StatCard
          title="Courses"
          value={dashboard.courses}
        />

        <StatCard
          title="Programs"
          value={dashboard.programs}
        />

        <StatCard
          title="Teachers"
          value={dashboard.teachers}
        />

        <StatCard
          title="Students"
          value={dashboard.students}
        />

        <StatCard
          title="Subjects"
          value={dashboard.subjects}
        />

        <StatCard
          title="Sections"
          value={dashboard.sections}
        />

        <StatCard
          title="Active Sessions"
          value={dashboard.activeSessions}
        />

      </div>

    </AdminLayout>
  );
}

export default Dashboard;