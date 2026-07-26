import { useEffect, useState } from "react";

import AdminLayout from "../../components/layout/AdminLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

import { toast } from "react-toastify";

import {
  getTeachers,
} from "../../services/teacherService";

import {
  getSubjects,
} from "../../services/subjectService";

import {
  getSections,
} from "../../services/sectionService";

import {
  getTeacherAssignments,
  createTeacherAssignment,
  deleteTeacherAssignment,
} from "../../services/teacherAssignmentService";

function TeacherAssignments() {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [sections, setSections] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [teacherId, setTeacherId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [sectionId, setSectionId] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ================================
  // LOAD DATA
  // ================================

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        teachersData,
        subjectsData,
        sectionsData,
        assignmentsData,
      ] = await Promise.all([
        getTeachers(),
        getSubjects(),
        getSections(),
        getTeacherAssignments(),
      ]);

      setTeachers(teachersData);
      setSubjects(subjectsData);
      setSections(sectionsData);
      setAssignments(assignmentsData);

    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to load assignment data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ================================
  // CREATE ASSIGNMENT
  // ================================

  const handleCreateAssignment = async (e) => {
    e.preventDefault();

    if (!teacherId || !subjectId || !sectionId) {
      toast.error(
        "Please select teacher, subject and section."
      );
      return;
    }

    try {
      setSaving(true);

      await createTeacherAssignment({
        teacherId,
        subjectId,
        sectionId,
      });

      toast.success(
        "Teacher assigned successfully!"
      );

      setTeacherId("");
      setSubjectId("");
      setSectionId("");

      await loadData();

    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to create assignment."
      );
    } finally {
      setSaving(false);
    }
  };

  // ================================
  // DELETE ASSIGNMENT
  // ================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this assignment?"
    );

    if (!confirmed) return;

    try {
      await deleteTeacherAssignment(id);

      toast.success(
        "Assignment removed successfully."
      );

      await loadData();

    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to remove assignment."
      );
    }
  };

  return (
    <AdminLayout>

      {/* ================= HEADER ================= */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-stone-800">
          Teacher Assignments
        </h1>

        <p className="text-stone-500 mt-2">
          Assign teachers to subjects and sections.
        </p>

      </div>


      {/* ================= CREATE FORM ================= */}

      <Card>

        <h2 className="text-2xl font-semibold text-stone-800 mb-6">
          Create Teacher Assignment
        </h2>

        <form
          onSubmit={handleCreateAssignment}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >

          {/* TEACHER */}

          <div>

            <label className="block text-sm font-medium text-stone-700 mb-2">
              Teacher
            </label>

            <select
              value={teacherId}
              onChange={(e) =>
                setTeacherId(e.target.value)
              }
              className="w-full border border-stone-300 rounded-xl px-4 py-3 bg-white"
            >

              <option value="">
                Select Teacher
              </option>

              {teachers
                .filter(
                  (teacher) => teacher.isActive
                )
                .map((teacher) => (

                  <option
                    key={teacher.userId}
                    value={teacher.userId}
                  >
                    {teacher.user?.name}
                    {" - "}
                    {teacher.employeeId}
                  </option>

                ))}

            </select>

          </div>


          {/* SUBJECT */}

          <div>

            <label className="block text-sm font-medium text-stone-700 mb-2">
              Subject
            </label>

            <select
              value={subjectId}
              onChange={(e) =>
                setSubjectId(e.target.value)
              }
              className="w-full border border-stone-300 rounded-xl px-4 py-3 bg-white"
            >

              <option value="">
                Select Subject
              </option>

              {subjects.map((subject) => (

                <option
                  key={subject.id}
                  value={subject.id}
                >
                  {subject.name}
                </option>

              ))}

            </select>

          </div>


          {/* SECTION */}

          <div>

            <label className="block text-sm font-medium text-stone-700 mb-2">
              Section
            </label>

            <select
              value={sectionId}
              onChange={(e) =>
                setSectionId(e.target.value)
              }
              className="w-full border border-stone-300 rounded-xl px-4 py-3 bg-white"
            >

              <option value="">
                Select Section
              </option>

              {sections.map((section) => (

                <option
                  key={section.id}
                  value={section.id}
                >
                  {section.name}
                </option>

              ))}

            </select>

          </div>


          {/* BUTTON */}

          <div className="md:col-span-3">

            <Button
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Assigning..."
                : "Assign Teacher"}
            </Button>

          </div>

        </form>

      </Card>


      {/* ================= ASSIGNMENTS TABLE ================= */}

      <Card className="mt-8">

        <h2 className="text-2xl font-semibold text-stone-800 mb-6">
          Current Assignments
        </h2>

        {loading ? (

          <p className="text-stone-500">
            Loading assignments...
          </p>

        ) : assignments.length === 0 ? (

          <p className="text-stone-500">
            No teacher assignments found.
          </p>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b">

                  <th className="text-left px-4 py-4">
                    Teacher
                  </th>

                  <th className="text-left px-4 py-4">
                    Subject
                  </th>

                  <th className="text-left px-4 py-4">
                    Section
                  </th>

                  <th className="text-left px-4 py-4">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {assignments.map(
                  (assignment) => (

                    <tr
                      key={assignment.id}
                      className="border-b hover:bg-stone-50"
                    >

                      <td className="px-4 py-4">

                        {assignment.teacher?.user?.name ||
                          "—"}

                      </td>

                      <td className="px-4 py-4">

                        {assignment.subject?.name ||
                          "—"}

                      </td>

                      <td className="px-4 py-4">

                        {assignment.section?.name ||
                          "—"}

                      </td>

                      <td className="px-4 py-4">

                        <button
                          onClick={() =>
                            handleDelete(
                              assignment.id
                            )
                          }
                          className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200"
                        >
                          Remove
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

export default TeacherAssignments;