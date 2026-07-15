import Modal from "../../components/ui/Modal";
import DepartmentForm from "../../components/department/DepartmentForm";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../services/departmentService";
import { useEffect, useState } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

import AdminLayout from "../../components/layout/AdminLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";
import ConfirmDialog from "../../components/ui/ConfirmDialog";



function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitDepartment = async (formData) => {
    try {
      if (editingDepartment) {
        await updateDepartment(editingDepartment.id, formData);

        toast.success("Department updated successfully!");
      } else {
        await createDepartment(formData);

        toast.success("Department created successfully!");
      }

      setOpenModal(false);
      setEditingDepartment(null);

      fetchDepartments();
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message || "Operation failed."
      );
    }
  };

  const handleDeleteDepartment = async () => {
    try {
      await deleteDepartment(selectedDepartment.id);

      toast.success("Department deactivated successfully!");

      setOpenDeleteDialog(false);
      setSelectedDepartment(null);

      fetchDepartments();
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message || "Failed to delete department."
      );
    }
  };

  const filteredDepartments = departments.filter(
    (department) =>
      department.name.toLowerCase().includes(search.toLowerCase()) ||
      department.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-stone-800">
            Departments TEST
          </h1>

          <p className="text-stone-500 mt-2">
            Manage all departments
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingDepartment(null);
            setOpenModal(true);
          }}
        >
          <div className="flex items-center gap-2">
            <FaPlus />
            Add Department
          </div>
        </Button>
      </div>

      <Card>
        <div className="relative mb-6">
          <FaSearch className="absolute left-4 top-4 text-stone-400" />

          <input
            type="text"
            placeholder="Search departments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-stone-300 pl-12 pr-4 py-3 focus:ring-2 focus:ring-amber-700 outline-none"
          />
        </div>

        <Table
          columns={[
            "Code",
            "Department",
            "Status",
            "Actions",
          ]}
        >
          {loading ? (
            <tr>
              <td colSpan="4" className="text-center py-10">
                Loading...
              </td>
            </tr>
          ) : filteredDepartments.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-10 text-stone-500">
                No departments found.
              </td>
            </tr>
          ) : (
            filteredDepartments.map((department) => (
              <tr
                key={department.id}
                className="border-t border-stone-200 hover:bg-stone-50"
              >
                <td className="p-4">{department.code}</td>
                <td className="p-4">{department.name}</td>

                <td className="p-4">
                  {department.isActive ? (
                    <span className="text-green-600 font-medium">
                      Active
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium">
                      Inactive
                    </span>
                  )}
                </td>

                <td className="p-4">
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setEditingDepartment(department);
                        setOpenModal(true);
                      }}
                      className="text-amber-700 hover:text-amber-900"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedDepartment(department);
                        setOpenDeleteDialog(true);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </Table>
      </Card>
      <Modal
        open={openModal}
        title="Add Department"
        onClose={() => setOpenModal(false)}
      >
        <DepartmentForm
          onSubmit={handleSubmitDepartment}
          initialData={editingDepartment}
        />
      </Modal>
      <ConfirmDialog
        open={openDeleteDialog}
        title="Deactivate Department"
        message={`Are you sure you want to deactivate "${selectedDepartment?.name || ""
          }"?`}
        onCancel={() => {
          setOpenDeleteDialog(false);
          setSelectedDepartment(null);
        }}
        onConfirm={handleDeleteDepartment}
      />
    </AdminLayout>
  );
}

export default Departments;
