import { useEffect, useState } from "react";

import AdminLayout from "../../components/layout/AdminLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

import { toast } from "react-toastify";

import {
  getSubjects,
  createSubject,
  deleteSubject,
} from "../../services/subjectService";

import {
  getSemesters,
} from "../../services/semesterService";

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState([]);

  const [semesterId, setSemesterId] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [credits, setCredits] = useState("");
  const [type, setType] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ================================
  // LOAD DATA
  // ================================

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        subjectsData,
        semestersData,
      ] = await Promise.all([
        getSubjects(),
        getSemesters(),
      ]);

      setSubjects(subjectsData || []);
      setSemesters(semestersData || []);

    } catch (error) {
      console.error("LOAD SUBJECT DATA ERROR:", error);

      toast.error(
        error.response?.data?.message ||
        "Failed to load subjects."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ================================
  // CREATE SUBJECT
  // ================================

  const handleCreateSubject = async (e) => {
    e.preventDefault();

    if (
      !semesterId ||
      !name ||
      !code ||
      !credits ||
      !type
    ) {
      toast.error(
        "Please fill all subject fields."
      );
      return;
    }

    try {
      setSaving(true);

      await createSubject({
        semesterId,
        name: name.trim(),
        code: code.trim().toUpperCase(),
        credits: Number(credits),
        type,
      });

      toast.success(
        "Subject created successfully!"
      );

      // Clear form
      setSemesterId("");
      setName("");
      setCode("");
      setCredits("");
      setType("");

      // Reload subjects
      await loadData();

    } catch (error) {
      console.error(
        "CREATE SUBJECT ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Failed to create subject."
      );
    } finally {
      setSaving(false);
    }
  };

  // ================================
  // DELETE SUBJECT
  // ================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this subject?"
    );

    if (!confirmed) return;

    try {
      await deleteSubject(id);

      toast.success(
        "Subject deleted successfully."
      );

      await loadData();

    } catch (error) {
      console.error(
        "DELETE SUBJECT ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Failed to delete subject."
      );
    }
  };

  return (
    <AdminLayout>

      {/* ================= HEADER ================= */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-stone-800">
          Subjects
        </h1>

        <p className="text-stone-500 mt-2">
          Create and manage subjects for your academic programs.
        </p>

      </div>


      {/* ================= CREATE SUBJECT ================= */}

      <Card>

        <h2 className="text-2xl font-semibold text-stone-800 mb-6">
          Create Subject
        </h2>

        <form
          onSubmit={handleCreateSubject}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >

          {/* SEMESTER */}

          <div>

            <label className="block text-sm font-medium text-stone-700 mb-2">
              Semester
            </label>

            <select
              value={semesterId}
              onChange={(e) =>
                setSemesterId(e.target.value)
              }
              className="w-full border border-stone-300 rounded-xl px-4 py-3 bg-white"
            >

              <option value="">
                Select Semester
              </option>

              {semesters.map((semester) => (

                <option
                  key={semester.id}
                  value={semester.id}
                >
                  {semester.program?.name ||
                    "Unknown Program"}
                  {" - Semester "}
                  {semester.semesterNumber}
                </option>

              ))}

            </select>

          </div>


          {/* SUBJECT NAME */}

          <div>

            <label className="block text-sm font-medium text-stone-700 mb-2">
              Subject Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="e.g. Data Structures"
              className="w-full border border-stone-300 rounded-xl px-4 py-3"
            />

          </div>


          {/* SUBJECT CODE */}

          <div>

            <label className="block text-sm font-medium text-stone-700 mb-2">
              Subject Code
            </label>

            <input
              type="text"
              value={code}
              onChange={(e) =>
                setCode(
                  e.target.value.toUpperCase()
                )
              }
              placeholder="e.g. CS101"
              className="w-full border border-stone-300 rounded-xl px-4 py-3 uppercase"
            />

          </div>


          {/* CREDITS */}

          <div>

            <label className="block text-sm font-medium text-stone-700 mb-2">
              Credits
            </label>

            <input
              type="number"
              min="1"
              max="10"
              value={credits}
              onChange={(e) =>
                setCredits(e.target.value)
              }
              placeholder="e.g. 4"
              className="w-full border border-stone-300 rounded-xl px-4 py-3"
            />

          </div>


          {/* TYPE */}

          <div>

            <label className="block text-sm font-medium text-stone-700 mb-2">
              Subject Type
            </label>

            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value)
              }
              className="w-full border border-stone-300 rounded-xl px-4 py-3 bg-white"
            >

              <option value="">
                Select Type
              </option>

              <option value="THEORY">
                Theory
              </option>

              <option value="PRACTICAL">
                Practical
              </option>

              <option value="LAB">
                Lab
              </option>

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
                : "Create Subject"}
            </Button>

          </div>

        </form>

      </Card>


      {/* ================= SUBJECT LIST ================= */}

      <Card className="mt-8">

        <h2 className="text-2xl font-semibold text-stone-800 mb-6">
          Existing Subjects
        </h2>

        {loading ? (

          <p className="text-stone-500">
            Loading subjects...
          </p>

        ) : subjects.length === 0 ? (

          <p className="text-stone-500">
            No subjects found.
          </p>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b">

                  <th className="text-left px-4 py-4">
                    Subject
                  </th>

                  <th className="text-left px-4 py-4">
                    Code
                  </th>

                  <th className="text-left px-4 py-4">
                    Program
                  </th>

                  <th className="text-left px-4 py-4">
                    Semester
                  </th>

                  <th className="text-left px-4 py-4">
                    Credits
                  </th>

                  <th className="text-left px-4 py-4">
                    Type
                  </th>

                  <th className="text-left px-4 py-4">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {subjects.map(
                  (subject) => (

                    <tr
                      key={subject.id}
                      className="border-b hover:bg-stone-50"
                    >

                      <td className="px-4 py-4 font-medium">
                        {subject.name}
                      </td>

                      <td className="px-4 py-4">
                        {subject.code}
                      </td>

                      <td className="px-4 py-4">
                        {subject.semester?.program?.name ||
                          "—"}
                      </td>

                      <td className="px-4 py-4">
                        {subject.semester?.semesterNumber ||
                          "—"}
                      </td>

                      <td className="px-4 py-4">
                        {subject.credits}
                      </td>

                      <td className="px-4 py-4">
                        {subject.type}
                      </td>

                      <td className="px-4 py-4">

                        <button
                          onClick={() =>
                            handleDelete(
                              subject.id
                            )
                          }
                          className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200"
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </Card>

    </AdminLayout>
  );
}

export default Subjects;