import { useEffect, useState } from "react";

import AdminLayout from "../../components/layout/AdminLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";
import StatCard from "../../components/ui/StatCard";
import Modal from "../../components/ui/Modal";

import StudentForm from "../../components/student/StudentForm";

import {
    getStudents,
    createStudent,
    updateStudent,
} from "../../services/studentService";

import {
    FaPlus,
    FaSearch,
    FaGraduationCap,
} from "react-icons/fa";

function Students() {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    // Modal state
    const [openModal, setOpenModal] = useState(false);

    // Student currently being edited
    const [editingStudent, setEditingStudent] = useState(null);

    // Fetch students
    const fetchStudents = async () => {
        try {
            setLoading(true);

            const data = await getStudents();

            setStudents(data);
        } catch (error) {
            console.error(
                "Failed to fetch students:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // ==========================================
    // CREATE STUDENT
    // ==========================================

    const handleCreateStudent = async (formData) => {
        try {
            await createStudent(formData);

            setOpenModal(false);
            setEditingStudent(null);

            await fetchStudents();

            alert("Student created successfully!");
        } catch (error) {
            console.error(
                "Failed to create student:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to create student."
            );

            throw error;
        }
    };

    // ==========================================
    // UPDATE STUDENT
    // ==========================================

    const handleUpdateStudent = async (formData) => {
        try {
            if (!editingStudent) {
                return;
            }

            await updateStudent(
                editingStudent.userId,
                formData
            );

            setOpenModal(false);
            setEditingStudent(null);

            await fetchStudents();

            alert("Student updated successfully!");
        } catch (error) {
            console.error(
                "Failed to update student:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update student."
            );

            throw error;
        }
    };

    // ==========================================
    // OPEN EDIT MODAL
    // ==========================================

    const handleEditStudent = (student) => {
        setEditingStudent(student);
        setOpenModal(true);
    };

    // ==========================================
    // OPEN CREATE MODAL
    // ==========================================

    const handleAddStudent = () => {
        setEditingStudent(null);
        setOpenModal(true);
    };

    // ==========================================
    // CLOSE MODAL
    // ==========================================

    const handleCloseModal = () => {
        setOpenModal(false);
        setEditingStudent(null);
    };

    // ==========================================
    // SEARCH
    // ==========================================

    const filteredStudents = students.filter(
        (student) =>
            student.user?.name
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||
            student.user?.email
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||
            student.enrollmentNumber
                ?.toLowerCase()
                .includes(search.toLowerCase())
    );

    // ==========================================
    // STATISTICS
    // ==========================================

    const totalStudents = students.length;

    const activeStudents = students.filter(
        (student) => student.isActive
    ).length;

    const inactiveStudents =
        totalStudents - activeStudents;

    return (
        <AdminLayout>

            {/* ==========================================
                HEADER
            ========================================== */}

            <div className="flex justify-between items-center mb-8">

                <div>
                    <h1 className="text-4xl font-bold text-stone-800 dark:text-slate-100">
                        Students
                    </h1>

                    <p className="text-stone-500 dark:text-slate-400 mt-2">
                        Manage students
                    </p>
                </div>

                <Button
                    onClick={handleAddStudent}
                >
                    <div className="flex items-center gap-2">
                        <FaPlus />
                        Add Student
                    </div>
                </Button>

            </div>


            {/* ==========================================
                STATISTICS
            ========================================== */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                <StatCard
                    title="Total Students"
                    value={totalStudents}
                    color="amber"
                />

                <StatCard
                    title="Active"
                    value={activeStudents}
                    color="green"
                />

                <StatCard
                    title="Inactive"
                    value={inactiveStudents}
                    color="red"
                />

            </div>


            {/* ==========================================
                STUDENTS TABLE
            ========================================== */}

            <Card>

                {/* Search */}

                <div className="relative mb-6">

                    <FaSearch
                        className="absolute left-5 top-1/2
                        -translate-y-1/2
                        text-stone-400 dark:text-slate-500 text-lg"
                    />

                    <input
                        type="text"
                        placeholder="Search students by name, email or enrollment number..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="w-full
                        bg-stone-50 dark:bg-slate-800
                        border border-stone-200 dark:border-slate-700
                        rounded-2xl
                        pl-14 pr-5 py-4
                        text-stone-700 dark:text-slate-200
                        focus:outline-none
                        focus:ring-2
                        focus:ring-amber-500"
                    />

                </div>


                {/* Table */}

                <Table
                    columns={[
                        "Student",
                        "Enrollment",
                        "Program",
                        "Section",
                        "Status",
                        "Actions",
                    ]}
                >

                    {loading ? (

                        <tr>
                            <td
                                colSpan="6"
                                className="text-center py-10 text-stone-500 dark:text-slate-400"
                            >
                                Loading students...
                            </td>
                        </tr>

                    ) : filteredStudents.length === 0 ? (

                        <tr>
                            <td
                                colSpan="6"
                                className="py-16 text-center"
                            >

                                <div className="flex flex-col items-center">

                                    <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center text-4xl mb-5">

                                        <FaGraduationCap className="text-amber-700" />

                                    </div>

                                    <h3 className="text-2xl font-semibold text-stone-800 dark:text-slate-100">
                                        No Students Yet
                                    </h3>

                                    <p className="text-stone-500 dark:text-slate-400 mt-2">
                                        Add your first student to the system.
                                    </p>

                                </div>

                            </td>
                        </tr>

                    ) : (

                        filteredStudents.map((student) => (

                            <tr
                                key={student.userId}
                                className="hover:bg-stone-50 dark:hover:bg-slate-800/60 dark:bg-slate-800 transition"
                            >

                                {/* Student */}

                                <td className="px-6 py-5">

                                    <div>

                                        <p className="font-semibold text-stone-800 dark:text-slate-100">
                                            {student.user?.name}
                                        </p>

                                        <p className="text-sm text-stone-500 dark:text-slate-400">
                                            {student.user?.email}
                                        </p>

                                    </div>

                                </td>


                                {/* Enrollment */}

                                <td className="px-6 py-5 text-stone-600 dark:text-slate-300">
                                    {student.enrollmentNumber}
                                </td>


                                {/* Program */}

                                <td className="px-6 py-5 text-stone-600 dark:text-slate-300">
                                    {student.program?.name || "—"}
                                </td>


                                {/* Section */}

                                <td className="px-6 py-5 text-stone-600 dark:text-slate-300">
                                    {student.section?.name || "—"}
                                </td>


                                {/* Status */}

                                <td className="px-6 py-5">

                                    {student.isActive ? (

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

                                    <button
                                        onClick={() =>
                                            handleEditStudent(student)
                                        }
                                        className="px-4 py-2 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 font-medium hover:bg-amber-200"
                                    >
                                        Edit
                                    </button>

                                </td>

                            </tr>

                        ))

                    )}

                </Table>

            </Card>


            {/* ==========================================
                CREATE / EDIT MODAL
            ========================================== */}

            <Modal
                open={openModal}
                title={
                    editingStudent
                        ? "Edit Student"
                        : "Add Student"
                }
                onClose={handleCloseModal}
            >

                <StudentForm
                    initialData={editingStudent}
                    isEditing={!!editingStudent}
                    onSubmit={
                        editingStudent
                            ? handleUpdateStudent
                            : handleCreateStudent
                    }
                />

            </Modal>

        </AdminLayout>
    );
}

export default Students;