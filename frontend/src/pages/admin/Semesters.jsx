import { useEffect, useState } from "react";

import AdminLayout from "../../components/layout/AdminLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";

import { toast } from "react-toastify";

import {
  getSemesters,
  createSemester,
  updateSemester,
  deleteSemester,
} from "../../services/semesterService";

import { getPrograms } from "../../services/programService";

function Semesters() {
  const [semesters, setSemesters] = useState([]);
  const [programs, setPrograms] = useState([]);

  const [programId, setProgramId] = useState("");
  const [semesterNumber, setSemesterNumber] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingSemester, setEditingSemester] = useState(null);
  const [editProgramId, setEditProgramId] = useState("");
  const [editSemesterNumber, setEditSemesterNumber] = useState("");
  const [editing, setEditing] = useState(false);

  // ================================
  // LOAD DATA
  // ================================

  const loadData = async () => {
    try {
      setLoading(true);

      const [semestersData, programsData] = await Promise.all([
        getSemesters(),
        getPrograms(),
      ]);

      setSemesters(semestersData || []);
      setPrograms(programsData || []);
    } catch (error) {
      console.error("LOAD SEMESTER DATA ERROR:", error);

      toast.error(
        error.response?.data?.message ||
        "Failed to load semesters."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ================================
  // SEMESTER NUMBER OPTIONS
  // ================================

  const semesterOptions = (programId) => {
    const program = programs.find(
      (p) => p.id === programId
    );

    const count = program?.semesters || 8;

    return Array.from(
      { length: count },
      (_, index) => index + 1
    );
  };

  // ================================
  // CREATE SEMESTER
  // ================================

  const handleCreateSemester = async (e) => {
    e.preventDefault();

    if (!programId || !semesterNumber) {
      toast.error(
        "Please select a program and semester number."
      );
      return;
    }

    try {
      setSaving(true);

      await createSemester({
        programId,
        semesterNumber: Number(semesterNumber),
      });

      toast.success(
        "Semester created successfully!"
      );

      // Clear form
      setProgramId("");
      setSemesterNumber("");

      // Reload semesters
      await loadData();
    } catch (error) {
      console.error(
        "CREATE SEMESTER ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Failed to create semester."
      );
    } finally {
      setSaving(false);
    }
  };

  // ================================
  // EDIT SEMESTER
  // ================================

  const openEditModal = (semester) => {
    setEditingSemester(semester);
    setEditProgramId(semester.programId);
    setEditSemesterNumber(
      String(semester.semesterNumber)
    );
  };

  const handleUpdateSemester = async (e) => {
    e.preventDefault();

    if (!editProgramId || !editSemesterNumber) {
      toast.error(
        "Please select a program and semester number."
      );
      return;
    }

    try {
      setEditing(true);

      await updateSemester(editingSemester.id, {
        programId: editProgramId,
        semesterNumber: Number(editSemesterNumber),
      });

      toast.success(
        "Semester updated successfully!"
      );

      setEditingSemester(null);

      await loadData();
    } catch (error) {
      console.error(
        "UPDATE SEMESTER ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Failed to update semester."
      );
    } finally {
      setEditing(false);
    }
  };

  // ================================
  // DELETE SEMESTER
  // ================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this semester?"
    );

    if (!confirmed) return;

    try {
      await deleteSemester(id);

      toast.success(
        "Semester deleted successfully."
      );

      await loadData();
    } catch (error) {
      console.error(
        "DELETE SEMESTER ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Failed to delete semester."
      );
    }
  };

  return (
    <AdminLayout>

      {/* ================= HEADER ================= */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-stone-800 dark:text-slate-100">
          Semesters
        </h1>

        <p className="text-stone-500 dark:text-slate-400 mt-2">
          Create and manage semesters for your academic programs.
        </p>

      </div>


      {/* ================= CREATE SEMESTER ================= */}

      <Card>

        <h2 className="text-2xl font-semibold text-stone-800 dark:text-slate-100 mb-6">
          Create Semester
        </h2>

        <form
          onSubmit={handleCreateSemester}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >

          {/* PROGRAM */}

          <div>

            <label className="block text-sm font-medium text-stone-700 dark:text-slate-200 mb-2">
              Program
            </label>

            <select
              value={programId}
              onChange={(e) => {
                setProgramId(e.target.value);
                setSemesterNumber("");
              }}
              className="w-full border border-stone-300 dark:border-slate-700 rounded-xl px-4 py-3 bg-white dark:bg-slate-800"
            >

              <option value="">
                Select Program
              </option>

              {programs.map((program) => (

                <option
                  key={program.id}
                  value={program.id}
                >
                  {program.name} ({program.code})
                </option>

              ))}

            </select>

          </div>


          {/* SEMESTER NUMBER */}

          <div>

            <label className="block text-sm font-medium text-stone-700 dark:text-slate-200 mb-2">
              Semester Number
            </label>

            <select
              value={semesterNumber}
              onChange={(e) =>
                setSemesterNumber(e.target.value)
              }
              disabled={!programId}
              className="w-full border border-stone-300 dark:border-slate-700 rounded-xl px-4 py-3 bg-white dark:bg-slate-800 disabled:opacity-50"
            >

              <option value="">
                {programId
                  ? "Select Semester"
                  : "Select a program first"}
              </option>

              {programId &&
                semesterOptions(programId).map(
                  (number) => (

                    <option
                      key={number}
                      value={number}
                    >
                      Semester {number}
                    </option>

                  )
                )}

            </select>

          </div>


          {/* BUTTON */}

          <div className="md:col-span-2">

            <Button
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Creating..."
                : "Create Semester"}
            </Button>

          </div>

        </form>

      </Card>


      {/* ================= SEMESTER LIST ================= */}

      <Card className="mt-8">

        <h2 className="text-2xl font-semibold text-stone-800 dark:text-slate-100 mb-6">
          Existing Semesters
        </h2>

        {loading ? (

          <p className="text-stone-500 dark:text-slate-400">
            Loading semesters...
          </p>

        ) : semesters.length === 0 ? (

          <p className="text-stone-500 dark:text-slate-400">
            No semesters found.
          </p>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b">

                  <th className="text-left px-4 py-4">
                    Program
                  </th>

                  <th className="text-left px-4 py-4">
                    Semester
                  </th>

                  <th className="text-left px-4 py-4">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {semesters.map(
                  (semester) => (

                    <tr
                      key={semester.id}
                      className="border-b hover:bg-stone-50 dark:hover:bg-slate-800/60 dark:bg-slate-800"
                    >

                      <td className="px-4 py-4 font-medium">
                        {semester.program?.name ||
                          "—"}
                      </td>

                      <td className="px-4 py-4">
                        {semester.semesterNumber}
                      </td>

                      <td className="px-4 py-4">

                        <div className="flex items-center gap-2">

                          <button
                            onClick={() =>
                              openEditModal(semester)
                            }
                            className="bg-amber-100 text-amber-700 px-4 py-2 rounded-lg hover:bg-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:hover:bg-amber-500/25"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                semester.id
                              )
                            }
                            className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 dark:bg-rose-500/15 dark:text-rose-400 dark:hover:bg-rose-500/25"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </Card>


      {/* ================= EDIT SEMESTER MODAL ================= */}

      <Modal
        open={!!editingSemester}
        title="Edit Semester"
        onClose={() =>
          setEditingSemester(null)
        }
      >

        <form
          onSubmit={handleUpdateSemester}
          className="space-y-6"
        >

          {/* PROGRAM */}

          <div>

            <label className="block text-sm font-medium text-stone-700 dark:text-slate-200 mb-2">
              Program
            </label>

            <select
              value={editProgramId}
              onChange={(e) => {
                setEditProgramId(e.target.value);
                setEditSemesterNumber("");
              }}
              className="w-full border border-stone-300 dark:border-slate-700 rounded-xl px-4 py-3 bg-white dark:bg-slate-800"
            >

              <option value="">
                Select Program
              </option>

              {programs.map((program) => (

                <option
                  key={program.id}
                  value={program.id}
                >
                  {program.name} ({program.code})
                </option>

              ))}

            </select>

          </div>


          {/* SEMESTER NUMBER */}

          <div>

            <label className="block text-sm font-medium text-stone-700 dark:text-slate-200 mb-2">
              Semester Number
            </label>

            <select
              value={editSemesterNumber}
              onChange={(e) =>
                setEditSemesterNumber(e.target.value)
              }
              disabled={!editProgramId}
              className="w-full border border-stone-300 dark:border-slate-700 rounded-xl px-4 py-3 bg-white dark:bg-slate-800 disabled:opacity-50"
            >

              <option value="">
                {editProgramId
                  ? "Select Semester"
                  : "Select a program first"}
              </option>

              {editProgramId &&
                semesterOptions(editProgramId).map(
                  (number) => (

                    <option
                      key={number}
                      value={number}
                    >
                      Semester {number}
                    </option>

                  )
                )}

            </select>

          </div>


          {/* BUTTONS */}

          <div className="flex items-center gap-3 pt-2">

            <Button
              type="submit"
              disabled={editing}
            >
              {editing
                ? "Saving..."
                : "Save Changes"}
            </Button>

            <button
              type="button"
              onClick={() =>
                setEditingSemester(null)
              }
              className="px-5 py-3 rounded-xl border border-stone-300 dark:border-slate-700 text-stone-600 dark:text-slate-300 hover:bg-stone-50 dark:hover:bg-slate-800"
            >
              Cancel
            </button>

          </div>

        </form>

      </Modal>

    </AdminLayout>
  );
}

export default Semesters;
