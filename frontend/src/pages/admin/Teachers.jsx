import { useEffect, useState } from "react";

import AdminLayout from "../../components/layout/AdminLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";
import StatCard from "../../components/ui/StatCard";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

import TeacherForm from "../../components/teacher/TeacherForm";

import {
  FaPlus,
  FaSearch,
  FaChalkboardTeacher,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import { toast } from "react-toastify";

import {
  getTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../../services/teacherService";

function Teachers() {
  const [teachers, setTeachers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);

  const [editingTeacher, setEditingTeacher] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] =
    useState(false);

  const [selectedTeacher, setSelectedTeacher] =
    useState(null);


  // ================================
  // FETCH TEACHERS
  // ================================

  const fetchTeachers = async () => {
    try {
      setLoading(true);

      const data = await getTeachers();

      setTeachers(data);

    } catch (error) {
      console.error(
        "Failed to fetch teachers:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Failed to fetch teachers."
      );

    } finally {
      setLoading(false);
    }
  };


  // ================================
  // LOAD TEACHERS
  // ================================

  useEffect(() => {
    fetchTeachers();
  }, []);


  // ================================
  // CREATE / UPDATE TEACHER
  // ================================

  const handleSubmitTeacher = async (formData) => {
    try {

      // EDIT
      if (editingTeacher) {
        await updateTeacher(
          editingTeacher.userId,
          formData
        );

        toast.success(
          "Teacher updated successfully!"
        );
      } else {
        await createTeacher(formData);

        toast.success(
          "Teacher created successfully!"
        );
      }


      // Close modal
      setOpenModal(false);

      // Clear editing teacher
      setEditingTeacher(null);

      // Refresh table
      await fetchTeachers();

    } catch (error) {

      console.error(
        "Teacher operation failed:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Operation failed."
      );

      throw error;
    }
  };


  // ================================
  // DEACTIVATE TEACHER
  // ================================

  const handleDeleteTeacher = async () => {

    try {

      await deleteTeacher(
        selectedTeacher.user.id
      );

      toast.success(
        "Teacher deactivated successfully!"
      );

      setOpenDeleteDialog(false);

      setSelectedTeacher(null);

      await fetchTeachers();

    } catch (error) {

      console.error(
        "Failed to deactivate teacher:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Failed to deactivate teacher."
      );
    }
  };


  // ================================
  // SEARCH
  // ================================

  const filteredTeachers =
    teachers.filter((teacher) => {

      const name =
        teacher.user?.name?.toLowerCase() || "";

      const email =
        teacher.user?.email?.toLowerCase() || "";

      const employeeId =
        teacher.employeeId?.toLowerCase() || "";

      const searchValue =
        search.toLowerCase();

      return (
        name.includes(searchValue) ||
        email.includes(searchValue) ||
        employeeId.includes(searchValue)
      );
    });


  // ================================
  // STATISTICS
  // ================================

  const totalTeachers =
    teachers.length;

  const activeTeachers =
    teachers.filter(
      (teacher) => teacher.isActive
    ).length;

  const inactiveTeachers =
    totalTeachers - activeTeachers;


  // ================================
  // PAGE
  // ================================

  return (
    <AdminLayout>

      {/* ================= HEADER ================= */}

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-4xl font-bold text-stone-800 dark:text-slate-100">
            Teachers
          </h1>

          <p className="text-stone-500 dark:text-slate-400 mt-2">
            Manage teachers and faculty members
          </p>

        </div>


        <Button
          onClick={() => {

            setEditingTeacher(null);

            setOpenModal(true);

          }}
        >

          <div className="flex items-center gap-2">

            <FaPlus />

            Add Teacher

          </div>

        </Button>

      </div>


      {/* ================= STATISTICS ================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <StatCard
          title="Total Teachers"
          value={totalTeachers}
          color="amber"
        />

        <StatCard
          title="Active"
          value={activeTeachers}
          color="green"
        />

        <StatCard
          title="Inactive"
          value={inactiveTeachers}
          color="red"
        />

      </div>


      {/* ================= TABLE ================= */}

      <Card>

        {/* SEARCH */}

        <div className="relative mb-6">

          <FaSearch
            className="absolute left-5 top-1/2
            -translate-y-1/2
            text-stone-400 dark:text-slate-500 text-lg"
          />

          <input
            type="text"
            placeholder="Search teachers..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full
            bg-stone-50 dark:bg-slate-800
            border border-stone-200 dark:border-slate-700
            rounded-2xl
            pl-14 pr-5 py-4
            focus:outline-none
            focus:ring-2
            focus:ring-amber-500"
          />

        </div>


        {/* TABLE */}

        <Table
          columns={[
            "Teacher",
            "Employee ID",
            "Email",
            "Department",
            "Status",
            "Actions",
          ]}
        >

          {/* LOADING */}

          {loading ? (

            <tr>

              <td
                colSpan="6"
                className="text-center py-16 text-stone-500 dark:text-slate-400"
              >

                Loading teachers...

              </td>

            </tr>

          )


            /* EMPTY */

            : filteredTeachers.length === 0 ? (

              <tr>

                <td
                  colSpan="6"
                  className="py-16"
                >

                  <div
                    className="flex flex-col
                  items-center"
                  >

                    <div
                      className="w-20 h-20
                    rounded-full
                    bg-amber-100
                    flex items-center
                    justify-center
                    text-4xl mb-5"
                    >

                      <FaChalkboardTeacher
                        className="text-amber-700"
                      />

                    </div>


                    <h3
                      className="text-2xl
                    font-semibold
                    text-stone-800 dark:text-slate-100"
                    >

                      No Teachers Yet

                    </h3>


                    <p className="text-stone-500 dark:text-slate-400 mt-2">

                      Add your first teacher
                      to the system.

                    </p>

                  </div>

                </td>

              </tr>

            )


              /* DATA */

              : (

                filteredTeachers.map(
                  (teacher) => (

                    <tr
                      key={teacher.userId}
                      className="hover:bg-stone-50 dark:hover:bg-slate-800/60 dark:bg-slate-800 transition"
                    >

                      {/* NAME */}

                      <td
                        className="px-6 py-5
                    font-medium
                    text-stone-800 dark:text-slate-100"
                      >

                        {teacher.user?.name || "—"}

                      </td>


                      {/* EMPLOYEE ID */}

                      <td
                        className="px-6 py-5
                    text-stone-600 dark:text-slate-300"
                      >

                        {teacher.employeeId || "—"}

                      </td>


                      {/* EMAIL */}

                      <td
                        className="px-6 py-5
                    text-stone-600 dark:text-slate-300"
                      >

                        {teacher.user?.email || "—"}

                      </td>


                      {/* DEPARTMENT */}

                      <td
                        className="px-6 py-5
                    text-stone-600 dark:text-slate-300"
                      >

                        {teacher.department?.name || "—"}

                      </td>


                      {/* STATUS */}

                      <td className="px-6 py-5">

                        {teacher.isActive ? (

                          <span
                            className="px-3 py-1
                        rounded-fullbg-green-100 text-green-700 dark:bg-emerald-500/15 dark:text-emerald-300
                        text-sm
                        font-medium"
                          >

                            Active

                          </span>

                        ) : (

                          <span
                            className="px-3 py-1
                        rounded-fullbg-red-100 text-red-700 dark:bg-rose-500/15 dark:text-rose-300
                        text-sm
                        font-medium"
                          >

                            Inactive

                          </span>

                        )}

                      </td>


                      {/* ACTIONS */}

                      <td className="px-6 py-5">

                        <div
                          className="flex
                      items-center gap-3"
                        >

                          {/* EDIT */}

                          <button
                            onClick={() => {

                              setEditingTeacher(
                                teacher
                              );

                              setOpenModal(true);

                            }}
                            className="w-10 h-10
                        rounded-xlbg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 hover:bg-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:hover:bg-amber-500/25
                        transition
                        flex items-center
                        justify-center"
                            title="Edit Teacher"
                          >

                            <FaEdit />

                          </button>


                          {/* DEACTIVATE */}

                          <button
                            onClick={() => {

                              setSelectedTeacher(
                                teacher
                              );

                              setOpenDeleteDialog(
                                true
                              );

                            }}
                            disabled={
                              !teacher.isActive
                            }
                            className="w-10 h-10
                        rounded-xlbg-red-100 text-red-600 hover:bg-red-200 dark:bg-rose-500/15 dark:text-rose-400 dark:hover:bg-rose-500/25
                        transition
                        flex items-center
                        justify-center
                        disabled:opacity-40
                        disabled:cursor-not-allowed"
                            title="Deactivate Teacher"
                          >

                            <FaTrash />

                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              )}

        </Table>

      </Card>


      {/* ================= CREATE / EDIT MODAL ================= */}

      <Modal
        open={openModal}
        title={
          editingTeacher
            ? "Edit Teacher"
            : "Add Teacher"
        }
        onClose={() => {

          setOpenModal(false);

          setEditingTeacher(null);

        }}
      >

        <TeacherForm
          initialData={
            editingTeacher
          }
          onSubmit={
            handleSubmitTeacher
          }
        />

      </Modal>


      {/* ================= DELETE CONFIRMATION ================= */}

      <ConfirmDialog
        open={openDeleteDialog}
        title="Deactivate Teacher"
        message={`Are you sure you want to deactivate "${selectedTeacher?.user?.name || ""
          }"?`}
        onCancel={() => {

          setOpenDeleteDialog(false);

          setSelectedTeacher(null);

        }}
        onConfirm={
          handleDeleteTeacher
        }
      />

    </AdminLayout>
  );
}

export default Teachers;