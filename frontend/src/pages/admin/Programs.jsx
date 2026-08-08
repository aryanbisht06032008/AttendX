import { useEffect, useState } from "react";

import AdminLayout from "../../components/layout/AdminLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";
import StatCard from "../../components/ui/StatCard";
import Modal from "../../components/ui/Modal";

import ProgramForm from "../../components/program/ProgramForm";

import {
  FaPlus,
  FaSearch,
  FaGraduationCap,
} from "react-icons/fa";

import {
  getPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
} from "../../services/programService";

function Programs() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);

  // =========================
  // Fetch Programs
  // =========================
  const fetchPrograms = async () => {
    try {
      setLoading(true);

      const data = await getPrograms();

      setPrograms(data);
    } catch (error) {
      console.error("Failed to fetch programs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load programs when page opens
  useEffect(() => {
    fetchPrograms();
  }, []);

  // =========================
  // Create Program
  // =========================
  const handleCreateProgram = async (formData) => {
    try {
      await createProgram(formData);

      setOpenModal(false);

      await fetchPrograms();

      alert("Program created successfully!");
    } catch (error) {
      console.error("Failed to create program:", error);

      alert(
        error.response?.data?.message ||
        "Failed to create program."
      );
    }
  };

  // =========================
  // Update Program
  // =========================
  const handleUpdateProgram = async (formData) => {
    try {
      await updateProgram(
        editingProgram.id,
        formData
      );

      setEditingProgram(null);

      await fetchPrograms();

      alert("Program updated successfully!");
    } catch (error) {
      console.error(
        "Failed to update program:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to update program."
      );
    }
  };

  // =========================
  // Deactivate Program
  // =========================
  const handleDeleteProgram = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate this program?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProgram(id);

      await fetchPrograms();

      alert("Program deactivated successfully!");
    } catch (error) {
      console.error(
        "Failed to deactivate program:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to deactivate program."
      );
    }
  };

  // =========================
  // Search
  // =========================
  const filteredPrograms = programs.filter(
    (program) =>
      program.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      program.code
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  // =========================
  // Statistics
  // =========================
  const totalPrograms = programs.length;

  const activePrograms = programs.filter(
    (program) => program.isActive
  ).length;

  const inactivePrograms =
    totalPrograms - activePrograms;

  return (
    <AdminLayout>

      {/* =========================
          Header
      ========================= */}
      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-4xl font-bold text-stone-800 dark:text-slate-100">
            Programs
          </h1>

          <p className="text-stone-500 dark:text-slate-400 mt-2">
            Manage academic programs
          </p>
        </div>

        <Button
          onClick={() => setOpenModal(true)}
        >
          <div className="flex items-center gap-2">
            <FaPlus />
            Add Program
          </div>
        </Button>

      </div>

      {/* =========================
          Statistics
      ========================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <StatCard
          title="Programs"
          value={totalPrograms}
          color="amber"
        />

        <StatCard
          title="Active"
          value={activePrograms}
          color="green"
        />

        <StatCard
          title="Inactive"
          value={inactivePrograms}
          color="red"
        />

      </div>

      {/* =========================
          Programs Table
      ========================= */}
      <Card>

        {/* Search */}
        <div className="relative mb-6">

          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 dark:text-slate-500 text-lg" />

          <input
            type="text"
            placeholder="Search programs..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-2xl pl-14 pr-5 py-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />

        </div>

        <Table
          columns={[
            "Program",
            "Code",
            "Department",
            "Duration",
            "Semesters",
            "Status",
            "Actions",
          ]}
        >

          {/* Loading */}
          {loading ? (

            <tr>
              <td
                colSpan="7"
                className="text-center py-16 text-stone-500 dark:text-slate-400"
              >
                Loading programs...
              </td>
            </tr>

          ) : filteredPrograms.length === 0 ? (

            /* No Programs */
            <tr>

              <td
                colSpan="7"
                className="py-16"
              >

                <div className="flex flex-col items-center">

                  <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center text-4xl mb-5">

                    <FaGraduationCap className="text-amber-700" />

                  </div>

                  <h3 className="text-2xl font-semibold text-stone-800 dark:text-slate-100">
                    No Programs Yet
                  </h3>

                  <p className="text-stone-500 dark:text-slate-400 mt-2">
                    Create your first academic program.
                  </p>

                </div>

              </td>

            </tr>

          ) : (

            /* Programs */
            filteredPrograms.map((program) => (

              <tr
                key={program.id}
                className="hover:bg-stone-50 dark:hover:bg-slate-800/60 dark:bg-slate-800 transition"
              >

                <td className="px-6 py-5 font-medium text-stone-800 dark:text-slate-100">
                  {program.name}
                </td>

                <td className="px-6 py-5 text-stone-600 dark:text-slate-300">
                  {program.code}
                </td>

                <td className="px-6 py-5 text-stone-600 dark:text-slate-300">
                  {program.department?.name || "—"}
                </td>

                <td className="px-6 py-5 text-stone-600 dark:text-slate-300">
                  {program.duration} Years
                </td>

                <td className="px-6 py-5 text-stone-600 dark:text-slate-300">
                  {program.semesters}
                </td>

                <td className="px-6 py-5">

                  {program.isActive ? (

                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-emerald-500/15 dark:text-emerald-300 text-sm font-medium">
                      Active
                    </span>

                  ) : (

                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 dark:bg-rose-500/15 dark:text-rose-300 text-sm font-medium">
                      Inactive
                    </span>

                  )}

                </td>

                {/* Actions */}
                <td className="px-6 py-5">

                  <div className="flex items-center gap-2">

                    {/* Edit */}
                    <button
                      onClick={() =>
                        setEditingProgram(program)
                      }
                      className="px-4 py-2 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 font-medium hover:bg-amber-200"
                    >
                      Edit
                    </button>

                    {/* Deactivate */}
                    {program.isActive && (
                      <button
                        onClick={() =>
                          handleDeleteProgram(program.id)
                        }
                        className="px-4 py-2 rounded-xl bg-red-100 text-red-700 dark:bg-rose-500/15 dark:text-rose-300 font-medium hover:bg-red-200"
                      >
                        Deactivate
                      </button>
                    )}

                  </div>

                </td>

              </tr>

            ))

          )}

        </Table>

      </Card>

      {/* =========================
          Add Program Modal
      ========================= */}
      <Modal
        open={openModal}
        title="Add Program"
        onClose={() =>
          setOpenModal(false)
        }
      >

        <ProgramForm
          onSubmit={handleCreateProgram}
        />

      </Modal>

      {/* =========================
          Edit Program Modal
      ========================= */}
      <Modal
        open={!!editingProgram}
        title="Edit Program"
        onClose={() =>
          setEditingProgram(null)
        }
      >

        {editingProgram && (

          <ProgramForm
            initialData={editingProgram}
            onSubmit={handleUpdateProgram}
          />

        )}

      </Modal>

    </AdminLayout>
  );
}

export default Programs;