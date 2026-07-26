import { useEffect, useState } from "react";

import AdminLayout from "../../components/layout/AdminLayout";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import StatCard from "../../components/ui/StatCard";

import {
  FaUsers,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserShield,
  FaSearch,
} from "react-icons/fa";

import api from "../../services/api";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await api.get("/users");

      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalUsers = users.length;

  const students = users.filter(
    (user) => user.role === "STUDENT"
  ).length;

  const teachers = users.filter(
    (user) => user.role === "TEACHER"
  ).length;

  const admins = users.filter(
    (user) => user.role === "ADMIN"
  ).length;

  return (
    <AdminLayout>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-stone-800">
          Users
        </h1>

        <p className="text-stone-500 mt-2">
          Manage all users of AttendX
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

        <StatCard
          title="Total Users"
          value={totalUsers}
          color="amber"
        />

        <StatCard
          title="Students"
          value={students}
          color="blue"
        />

        <StatCard
          title="Teachers"
          value={teachers}
          color="green"
        />

        <StatCard
          title="Admins"
          value={admins}
          color="red"
        />

      </div>

      {/* Users Table */}
      <Card>

        {/* Search */}
        <div className="relative mb-6">

          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400" />

          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-14 pr-5 py-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />

        </div>

        <Table
          columns={[
            "Name",
            "Email",
            "Role",
            "Created",
          ]}
        >

          {loading ? (

            <tr>
              <td
                colSpan="4"
                className="text-center py-16 text-stone-500"
              >
                Loading users...
              </td>
            </tr>

          ) : filteredUsers.length === 0 ? (

            <tr>
              <td
                colSpan="4"
                className="text-center py-16 text-stone-500"
              >
                No users found.
              </td>
            </tr>

          ) : (

            filteredUsers.map((user) => (

              <tr
                key={user.id}
                className="hover:bg-stone-50 transition"
              >

                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                      <FaUsers />
                    </div>

                    <span className="font-medium text-stone-800">
                      {user.name}
                    </span>

                  </div>
                </td>

                <td className="px-6 py-5 text-stone-600">
                  {user.email}
                </td>

                <td className="px-6 py-5">

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.role === "ADMIN"
                        ? "bg-red-100 text-red-700"
                        : user.role === "TEACHER"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {user.role}
                  </span>

                </td>

                <td className="px-6 py-5 text-stone-500">
                  {user.createdAt
                    ? new Date(
                        user.createdAt
                      ).toLocaleDateString()
                    : "—"}
                </td>

              </tr>

            ))

          )}

        </Table>

      </Card>

    </AdminLayout>
  );
}

export default Users;