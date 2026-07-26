import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import AdminLayout from "../../components/layout/AdminLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";
import StatCard from "../../components/ui/StatCard";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

import DepartmentForm from "../../components/department/DepartmentForm";

import {
  FaPlus,
  FaSearch,
  FaBuilding,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../services/departmentService";

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // =========================
  // Fetch Departments
  // =========================
  const fetchDepartments = async () => {
    try {
      setLoading(true);

      const data = await getDepartments();

      setDepartments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "Failed to fetch departments:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load departments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // =========================
  // Open Add Modal
  // =========================
  const handleAddDepartment = () => {
    setEditingDepartment(null);
    setOpenModal(true);
  };

  // =========================
  // Open Edit Modal
  // =========================
  const handleEditDepartment = (department) => {
    setEditingDepartment(department);
    setOpenModal(true);
  };

  // =========================
  // Close Modal
  // =========================
  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingDepartment(null);
  };

  // =========================
  // Create / Update
  // =========================
  const handleSubmitDepartment = async (formData) => {
    try {
      if (editingDepartment) {
        await updateDepartment(
          editingDepartment.id,
          formData
        );

        toast.success(
          "Department updated successfully!"
        );
      } else {
        await createDepartment(formData);

        toast.success(
          "Department created successfully!"
        );
      }

      handleCloseModal();

      await fetchDepartments();
    } catch (error) {
      console.error(
        "Department operation failed:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Operation failed."
      );

      throw error;
    }
  };

  // =========================
  // Open Delete Dialog
  // =========================
  const handleOpenDeleteDialog = (department) => {
    setSelectedDepartment(department);
    setOpenDeleteDialog(true);
  };

  // =========================
  // Close Delete Dialog
  // =========================
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedDepartment(null);
  };

  // =========================
  // Delete / Deactivate
  // =========================
  const handleDeleteDepartment = async () => {
    if (!selectedDepartment?.id) {
      return;
    }

    try {
      await deleteDepartment(
        selectedDepartment.id
      );

      toast.success(
        "Department deactivated successfully!"
      );

      handleCloseDeleteDialog();

      await fetchDepartments();
    } catch (error) {
      console.error(
        "Failed to deactivate department:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to deactivate department."
      );
    }
  };

  // =========================
  // Search
  // =========================
  const searchText = search.toLowerCase().trim();

  const filteredDepartments = departments.filter(
    (department) => {
      const name =
        department.name?.toLowerCase() || "";

      const code =
        department.code?.toLowerCase() || "";

      return (
        name.includes(searchText) ||
        code.includes(searchText)
      );
    }
  );

  // =========================
  // Statistics
  // =========================
  const activeDepartments = departments.filter(
    (department) => department.isActive
  ).length;

  const inactiveDepartments =
    departments.length - activeDepartments;

  return (
    <AdminLayout>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-8">

        <div>
          <h1 className="text-4xl font-bold text-stone-800">
            Departments
          </h1>

          <p className="text-stone-500 mt-2">
            Manage all departments
          </p>
        </div>

        <Button onClick={handleAddDepartment}>
          <div className="flex items-center gap-2">
            <FaPlus />
            Add Department
          </div>
        </Button>

      </div>


      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <StatCard
          title="Departments"
          value={departments.length}
          color="amber"
        />

        <StatCard
          title="Active"
          value={activeDepartments}
          color="green"
        />

        <StatCard
          title="Inactive"
          value={inactiveDepartments}
          color="red"
        />

      </div>


      {/* Main Card */}
      <Card>

        {/* Search */}
        <div className="relative mb-6">

          <FaSearch
            className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 text-lg"
          />

          <input
            type="text"
            placeholder="Search departments by name or code..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-14 pr-5 py-4 text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
          />

        </div>


        {/* Table */}
        <Table
          columns={[
            "Department",
            "Status",
            "Actions",
          ]}
        >

          {loading ? (

            <tr>
              <td
                colSpan="3"
                className="text-center py-10 text-stone-500"
              >
                Loading departments...
              </td>
            </tr>

          ) : filteredDepartments.length === 0 ? (

            <tr>
              <td
                colSpan="3"
                className="py-16"
              >

                <div className="flex flex-col items-center justify-center">

                  <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center text-4xl mb-5">
                    <FaBuilding className="text-amber-700" />
                  </div>

                  <h3 className="text-2xl font-semibold text-stone-800">
                    No Departments Found
                  </h3>

                  <p className="text-stone-500 mt-2 text-center max-w-sm">
                    We couldn't find any departments matching your search.
                    Try a different keyword or create a new department.
                  </p>

                  <Button
                    className="mt-6"
                    onClick={handleAddDepartment}
                  >
                    <div className="flex items-center gap-2">
                      <FaPlus />
                      Add Department
                    </div>
                  </Button>

                </div>

              </td>
            </tr>

          ) : (

            filteredDepartments.map(
              (department) => (

                <tr
                  key={department.id}
                  className="group transition-all duration-200 hover:bg-amber-50"
                >

                  {/* Department */}
                  <td className="px-6 py-5">

                    <div className="flex items-center gap-4">

                      <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                        <FaBuilding />
                      </div>

                      <div>

                        <p className="font-semibold text-stone-800">
                          {department.name}
                        </p>

                        <p className="text-sm text-stone-400">
                          {department.code}
                        </p>

                      </div>

                    </div>

                  </td>


                  {/* Status */}
                  <td className="px-6 py-5">

                    {department.isActive ? (

                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                        Active
                      </span>

                    ) : (

                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold">
                        Inactive
                      </span>

                    )}

                  </td>


                  {/* Actions */}
                  <td className="px-6 py-5">

                    <div className="flex items-center gap-3">

                      <button
                        type="button"
                        onClick={() =>
                          handleEditDepartment(
                            department
                          )
                        }
                        className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 hover:bg-amber-200 transition flex items-center justify-center"
                        title="Edit Department"
                      >
                        <FaEdit />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleOpenDeleteDialog(
                            department
                          )
                        }
                        className="w-10 h-10 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition flex items-center justify-center"
                        title="Deactivate Department"
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


      {/* Add / Edit Modal */}
      <Modal
        open={openModal}
        title={
          editingDepartment
            ? "Edit Department"
            : "Add Department"
        }
        onClose={handleCloseModal}
      >

        <DepartmentForm
          key={
            editingDepartment
              ? `edit-${editingDepartment.id}`
              : "create"
          }
          initialData={editingDepartment}
          onSubmit={handleSubmitDepartment}
          isEditing={Boolean(editingDepartment)}
        />

      </Modal>


      {/* Delete Confirmation */}
      <ConfirmDialog
        open={openDeleteDialog}
        title="Deactivate Department"
        message={`Are you sure you want to deactivate "${
          selectedDepartment?.name || ""
        }"?`}
        onCancel={handleCloseDeleteDialog}
        onConfirm={handleDeleteDepartment}
      />

    </AdminLayout>
  );
}

export default Departments;