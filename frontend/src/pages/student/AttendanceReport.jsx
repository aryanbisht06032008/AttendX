import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  FaChartPie,
  FaArrowLeft,
  FaSyncAlt,
  FaUserTie,
  FaBookOpen,
  FaCheckCircle,
  FaClock,
  FaGraduationCap,
  FaFileCsv,
} from "react-icons/fa";
import { downloadCsv, csvFilename } from "../../utils/csvExport";

import api from "../../api/axios";
import ThemeToggle from "../../components/ui/ThemeToggle";

// ---- helpers -------------------------------------------------------------

function percentColor(value) {
  if (value >= 75) return "#10b981";
  if (value >= 50) return "#f59e0b";
  return "#f43f5e";
}

function StatTile({ title, value, icon, gradient }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white dark:border-slate-800 dark:bg-slate-900 p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 dark:text-slate-500">{title}</p>
          <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {value}
          </h2>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-xl text-white shadow-glow-sm ${gradient}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

const CHART_TOOLTIP_STYLE = {
  borderRadius: 12,
  border: "1px solid #e2e8f0",
  boxShadow: "0 12px 32px -12px rgb(15 23 42 / 0.25)",
  fontSize: 13,
  fontWeight: 600,
};

function truncateLabel(value, maxLength = 20) {
  return value.length > maxLength
    ? `${value.slice(0, maxLength - 1)}…`
    : value;
}

// ---- page ------------------------------------------------------------------

function AttendanceReport() {
  const navigate = useNavigate();

  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function fetchReport() {
    try {
      setLoading(true);
      setMessage("");

      const response = await api.get("/attendance/my");
      setAttendances(response.data?.attendances || []);
    } catch (error) {
      console.error("Failed to fetch attendance report:", error);
      setMessage(
        error.response?.data?.message || "Failed to load attendance report."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReport();
  }, []);

  // ---- aggregate by subject ----
  const subjectMap = {};

  attendances.forEach((attendance) => {
    const assignment =
      attendance.attendanceSession?.teacherAssignment;
    const subject = assignment?.subject;

    const key = subject?.id || "unknown";

    if (!subjectMap[key]) {
      subjectMap[key] = {
        id: key,
        name: subject?.name || "Unknown Subject",
        code: subject?.code || "",
        teacher: assignment?.teacher?.user?.name || "—",
        total: 0,
        present: 0,
        late: 0,
        absent: 0,
      };
    }

    const record = subjectMap[key];
    record.total += 1;
    if (attendance.status === "PRESENT") record.present += 1;
    else if (attendance.status === "LATE") record.late += 1;
    else record.absent += 1;
  });

  const subjects = Object.values(subjectMap)
    .map((subject) => ({
      ...subject,
      percentage:
        subject.total > 0
          ? Math.round(((subject.present + subject.late) / subject.total) * 100)
          : 0,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  // ---- overall stats ----
  const total = attendances.length;
  const present = attendances.filter(
    (attendance) => attendance.status === "PRESENT"
  ).length;
  const late = attendances.filter(
    (attendance) => attendance.status === "LATE"
  ).length;
  const absent = attendances.filter(
    (attendance) => attendance.status === "ABSENT"
  ).length;

  const overallPercentage =
    total > 0 ? Math.round(((present + late) / total) * 100) : 0;

  const donutData = [
    { name: "Present", value: present, color: "#10b981" },
    { name: "Late", value: late, color: "#f59e0b" },
    { name: "Absent", value: absent, color: "#f43f5e" },
  ].filter((item) => item.value > 0);

  // ---- export report (CSV) ----
  const exportReportCsv = () => {
    const rows = [
      [
        "Subject",
        "Code",
        "Teacher",
        "Total Sessions",
        "Present",
        "Late",
        "Absent",
        "Attendance %",
      ],
      ...subjects.map((subject) => [
        subject.name,
        subject.code || "",
        subject.teacher,
        subject.total,
        subject.present,
        subject.late,
        subject.absent,
        `${subject.percentage}%`,
      ]),
    ];

    downloadCsv({
      filename: csvFilename("attendance-report"),
      rows,
    });
  };

  // ---- loading ----
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-app">
        <div className="flex flex-col items-center gap-4">
          <span className="h-10 w-10 animate-spin rounded-full border-4 border-amber-200 border-t-amber-600" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 dark:text-slate-500">
            Building your report...
          </p>
        </div>
      </div>
    );
  }

  // ---- empty ----
  if (total === 0) {
    return (
      <div className="min-h-screen bg-app p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-2xl">
          <div className="flex flex-col items-center rounded-3xl border border-slate-200/70 bg-white dark:border-slate-800 dark:bg-slate-900 p-12 text-center shadow-card">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-4xl text-amber-700 dark:text-amber-300">
              <FaChartPie />
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              No Attendance Yet
            </h1>
            <p className="mt-3 max-w-sm text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">
              Scan your teacher's QR code during a session to start building
              your attendance report.
            </p>
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => navigate("/student/attendance-scanner")}
                className="rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-3 text-sm font-semibold text-white shadow-glow-sm transition hover:-translate-y-0.5 hover:shadow-glow"
              >
                Scan Attendance QR
              </button>
              <button
                onClick={() => navigate("/student")}
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-slate-50"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- content ----
  return (
    <div className="min-h-screen bg-app p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              onClick={() => navigate("/student")}
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-amber-600 transition hover:text-amber-700 dark:text-amber-300"
            >
              <FaArrowLeft />
              Back to Dashboard
            </button>

            <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Attendance Report
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400 dark:text-slate-500">
              Your attendance performance across all subjects.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start">
            <ThemeToggle />

            <button
              onClick={exportReportCsv}
              disabled={total === 0}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <FaFileCsv />
              Export CSV
            </button>

            <button
              onClick={fetchReport}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-5 py-3 text-sm font-semibold text-white shadow-glow-sm transition hover:-translate-y-0.5 hover:shadow-glow disabled:pointer-events-none disabled:opacity-50"
            >
              <FaSyncAlt />
              Refresh
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-500/10 p-4 text-sm font-medium text-rose-700 dark:text-rose-300">
            {message}
          </div>
        )}

        {/* Overall stats */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatTile
            title="Total Sessions"
            value={total}
            icon={<FaBookOpen />}
            gradient="from-amber-500 to-amber-700"
          />
          <StatTile
            title="Present"
            value={present}
            icon={<FaCheckCircle />}
            gradient="from-emerald-500 to-green-600"
          />
          <StatTile
            title="Late"
            value={late}
            icon={<FaClock />}
            gradient="from-amber-400 to-yellow-600"
          />
          <StatTile
            title="Attendance %"
            value={`${overallPercentage}%`}
            icon={<FaGraduationCap />}
            gradient="from-sky-500 to-blue-600"
          />
        </div>

        {/* Charts */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Per-subject bar chart */}
          <div className="rounded-2xl border border-slate-200/70 bg-white dark:border-slate-800 dark:bg-slate-900 p-6 shadow-card lg:col-span-3">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:text-amber-300">
                <FaChartPie />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  Attendance by Subject
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">
                  Percentage of sessions attended per subject
                </p>
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={subjects}
                  layout="vertical"
                  margin={{ top: 16, right: 32, left: 8, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                    tickFormatter={(value) => `${value}%`}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={160}
                    tick={{ fontSize: 12, fill: "#475569", fontWeight: 600 }}
                    tickFormatter={truncateLabel}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "#f1f5f9" }}
                    contentStyle={CHART_TOOLTIP_STYLE}
                    formatter={(value) => [`${value}%`, "Attendance"]}
                  />
                  <ReferenceLine
                    x={75}
                    stroke="#6719d4"
                    strokeDasharray="6 4"
                    strokeWidth={1.5}
                    label={{
                      value: "75% target",
                      position: "insideTopRight",
                      fill: "#6719d4",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  />
                  <Bar dataKey="percentage" radius={[0, 8, 8, 0]} barSize={20}>
                    {subjects.map((subject) => (
                      <Cell
                        key={subject.id}
                        fill={percentColor(subject.percentage)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status donut */}
          <div className="rounded-2xl border border-slate-200/70 bg-white dark:border-slate-800 dark:bg-slate-900 p-6 shadow-card lg:col-span-2">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:text-amber-300">
                <FaCheckCircle />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  Status Breakdown
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">
                  Distribution of all your sessions
                </p>
              </div>
            </div>

            <div className="relative h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={62}
                    outerRadius={92}
                    paddingAngle={4}
                    stroke="none"
                  >
                    {donutData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>

              {/* Center label */}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {overallPercentage}%
                </span>
                <span className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400 dark:text-slate-500">
                  overall
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 space-y-2.5">
              {donutData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.value}
                    <span className="ml-1 font-medium text-slate-400 dark:text-slate-500">
                      ({total > 0 ? Math.round((item.value / total) * 100) : 0}%)
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Per-subject breakdown */}
        <div className="rounded-2xl border border-slate-200/70 bg-white dark:border-slate-800 dark:bg-slate-900 p-6 shadow-card">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:text-amber-300">
              <FaGraduationCap />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Subject Breakdown
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">
                Detailed performance per subject
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className="group rounded-2xl border border-slate-200/70 bg-slate-50/50 dark:bg-slate-800/50 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-card"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-base font-bold tracking-tight text-slate-900 dark:text-white">
                      {subject.name}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">
                      {subject.code && (
                        <span className="rounded-md bg-amber-100 px-2 py-0.5 font-semibold text-amber-700 dark:text-amber-300">
                          {subject.code}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <FaUserTie className="text-slate-400 dark:text-slate-500" />
                        {subject.teacher}
                      </span>
                    </div>
                  </div>
                  <span
                    className="shrink-0 font-display text-2xl font-extrabold tracking-tight"
                    style={{ color: percentColor(subject.percentage) }}
                  >
                    {subject.percentage}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mb-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${subject.percentage}%`,
                      backgroundColor: percentColor(subject.percentage),
                    }}
                  />
                </div>

                {/* Counts */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-emerald-50 dark:bg-emerald-500/10 py-2">
                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                      {subject.present}
                    </p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600/70">
                      Present
                    </p>
                  </div>
                  <div className="rounded-xl bg-amber-50 dark:bg-amber-500/10 py-2">
                    <p className="text-sm font-bold text-amber-700 dark:text-amber-300">
                      {subject.late}
                    </p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-600/70">
                      Late
                    </p>
                  </div>
                  <div className="rounded-xl bg-rose-50 dark:bg-rose-500/10 py-2">
                    <p className="text-sm font-bold text-rose-700 dark:text-rose-300">
                      {subject.absent}
                    </p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-rose-600/70">
                      Absent
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer hint */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-slate-200/70 bg-white dark:border-slate-800 dark:bg-slate-900 p-5 text-xs font-medium text-slate-500 dark:text-slate-400 dark:text-slate-500 shadow-soft">
          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-50 dark:bg-emerald-500/100" /> ≥ 75% — Healthy
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-amber-50 dark:bg-amber-500/100" /> 50–74% — At risk
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-50 dark:bg-rose-500/100" /> &lt; 50% — Critical
          </span>
        </div>
      </div>
    </div>
  );
}

export default AttendanceReport;
