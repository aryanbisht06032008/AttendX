import { useEffect, useState } from "react";
import api from "../../api/axios";

function AttendanceHistory() {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const getMyAttendance = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await api.get("/attendance/my");

      setAttendances(
        response.data?.attendances || []
      );
    } catch (error) {
      console.error(
        "Failed to fetch attendance history:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to load attendance history."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyAttendance();
  }, []);

  // ================================
  // STATISTICS
  // ================================

  const total = attendances.length;

  const present = attendances.filter(
    (attendance) =>
      attendance.status === "PRESENT"
  ).length;

  const late = attendances.filter(
    (attendance) =>
      attendance.status === "LATE"
  ).length;

  const absent = attendances.filter(
    (attendance) =>
      attendance.status === "ABSENT"
  ).length;

  const attendancePercentage =
    total > 0
      ? Math.round(
          ((present + late) / total) * 100
        )
      : 0;

  return (
    <div className="min-h-screen bg-app p-8">

      <div className="max-w-6xl mx-auto">

        {/* ================= HEADER ================= */}

        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900">
              Attendance History
            </h1>

            <p className="text-slate-500 mt-2">
              View your complete attendance records.
            </p>
          </div>

          <button
            onClick={getMyAttendance}
            disabled={loading}
            className="rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-5 py-3 font-semibold text-white shadow-glow-sm transition hover:-translate-y-0.5 hover:shadow-glow disabled:pointer-events-none disabled:opacity-50"
          >
            {loading
              ? "Refreshing..."
              : "Refresh"}
          </button>

        </div>


        {/* ================= STATISTICS ================= */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

          {/* Total */}

          <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-card">

            <p className="text-gray-500">
              Total Records
            </p>

            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-slate-900">
              {total}
            </h2>

          </div>


          {/* Present */}

          <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-card">

            <p className="text-gray-500">
              Present
            </p>

            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-emerald-600">
              {present}
            </h2>

          </div>


          {/* Late */}

          <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-card">

            <p className="text-gray-500">
              Late
            </p>

            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-yellow-500">
              {late}
            </h2>

          </div>


          {/* Percentage */}

          <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-card">

            <p className="text-gray-500">
              Attendance %
            </p>

            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-sky-600">
              {attendancePercentage}%
            </h2>

          </div>

        </div>


        {/* ================= MESSAGE ================= */}

        {message && (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
            {message}
          </div>
        )}


        {/* ================= TABLE ================= */}

        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-card overflow-hidden">

          <div className="border-b border-slate-100 px-6 py-5">

            <h2 className="font-display text-xl font-bold tracking-tight text-slate-900">
              Attendance Records
            </h2>

          </div>


          {loading ? (

            <div className="text-center py-16">

              <p className="text-slate-500">
                Loading attendance history...
              </p>

            </div>

          ) : attendances.length === 0 ? (

            <div className="text-center py-16">

              <div className="text-5xl mb-4">
                📋
              </div>

              <h3 className="font-display text-xl font-bold tracking-tight text-slate-900">
                No Attendance Records
              </h3>

              <p className="text-slate-500 mt-2">
                You don't have any attendance records yet.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead>

                  <tr className="border-b bg-slate-50/80">

                    <th className="px-6 py-4">
                      Subject
                    </th>

                    <th className="px-6 py-4">
                      Teacher
                    </th>

                    <th className="px-6 py-4">
                      Section
                    </th>

                    <th className="px-6 py-4">
                      Date
                    </th>

                    <th className="px-6 py-4">
                      Status
                    </th>

                    <th className="px-6 py-4">
                      Method
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {attendances.map(
                    (attendance) => {

                      const assignment =
                        attendance
                          .attendanceSession
                          ?.teacherAssignment;

                      const subject =
                        assignment?.subject;

                      const section =
                        assignment?.section;

                      const teacher =
                        assignment?.teacher?.user;

                      return (

                        <tr
                          key={attendance.id}
                          className="border-b transition hover:bg-slate-50"
                        >

                          {/* Subject */}

                          <td className="px-6 py-4 font-semibold text-gray-800">

                            {subject?.name ||
                              "—"}

                          </td>


                          {/* Teacher */}

                          <td className="px-6 py-4">

                            {teacher?.name ||
                              "—"}

                          </td>


                          {/* Section */}

                          <td className="px-6 py-4">

                            {section?.name ||
                              section?.code ||
                              "—"}

                          </td>


                          {/* Date */}

                          <td className="px-6 py-4">

                            {attendance.scanTime
                              ? new Date(
                                  attendance.scanTime
                                ).toLocaleString()
                              : "—"}

                          </td>


                          {/* Status */}

                          <td className="px-6 py-4">

                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                attendance.status ===
                                "PRESENT"
                                  ? "bg-green-100 text-green-700"
                                  : attendance.status ===
                                    "LATE"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {attendance.status}
                            </span>

                          </td>


                          {/* Method */}

                          <td className="px-6 py-4">

                            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                              {attendance.method}
                            </span>

                          </td>

                        </tr>

                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default AttendanceHistory;