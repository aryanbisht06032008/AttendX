import { useEffect, useState } from "react";

import Button from "../ui/Button";

import { getDepartments } from "../../services/departmentService";

function ProgramForm({ onSubmit, initialData = null }) {
  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    duration: "",
    semesters: "",
    departmentId: "",
  });

  const [loading, setLoading] = useState(false);

  // =========================
  // Load Departments
  // =========================
  useEffect(() => {
    fetchDepartments();
  }, []);

  // =========================
  // Load Existing Program
  // For Edit
  // =========================
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        code: initialData.code || "",
        duration: initialData.duration || "",
        semesters: initialData.semesters || "",
        departmentId: initialData.departmentId || "",
      });
    }
  }, [initialData]);

  // =========================
  // Fetch Departments
  // =========================
  const fetchDepartments = async () => {
    try {
      const data = await getDepartments();

      setDepartments(
        data.filter(
          (department) => department.isActive
        )
      );
    } catch (error) {
      console.error(
        "Failed to fetch departments:",
        error
      );
    }
  };

  // =========================
  // Handle Input Change
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // Submit
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await onSubmit(formData);

      // Clear form only when creating
      if (!initialData) {
        setFormData({
          name: "",
          code: "",
          duration: "",
          semesters: "",
          departmentId: "",
        });
      }
    } catch (error) {
      console.error(
        "Program form error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >

      {/* =========================
          Program Name
      ========================= */}
      <div>

        <label className="block text-sm font-medium text-stone-700 dark:text-slate-300 mb-2">
          Program Name
        </label>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Bachelor of Computer Applications"
          required
          className="w-full border border-stone-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />

      </div>

      {/* =========================
          Program Code
      ========================= */}
      <div>

        <label className="block text-sm font-medium text-stone-700 dark:text-slate-300 mb-2">
          Program Code
        </label>

        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleChange}
          placeholder="e.g. BCA"
          required
          className="w-full border border-stone-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-xl px-4 py-3 uppercase focus:outline-none focus:ring-2 focus:ring-amber-500"
        />

      </div>

      {/* =========================
          Department
      ========================= */}
      <div>

        <label className="block text-sm font-medium text-stone-700 dark:text-slate-300 mb-2">
          Department
        </label>

        <select
          name="departmentId"
          value={formData.departmentId}
          onChange={handleChange}
          required
          className="w-full border border-stone-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-xl px-4 py-3 bg-white focus:outline-none dark:bg-slate-800 focus:ring-2 focus:ring-amber-500"
        >

          <option value="">
            Select Department
          </option>

          {departments.map(
            (department) => (

              <option
                key={department.id}
                value={department.id}
              >
                {department.name} (
                {department.code})
              </option>

            )
          )}

        </select>

      </div>

      {/* =========================
          Duration + Semesters
      ========================= */}
      <div className="grid grid-cols-2 gap-4">

        {/* Duration */}
        <div>

          <label className="block text-sm font-medium text-stone-700 dark:text-slate-300 mb-2">
            Duration (Years)
          </label>

          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            min="1"
            max="10"
            placeholder="3"
            required
            className="w-full border border-stone-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />

        </div>

        {/* Semesters */}
        <div>

          <label className="block text-sm font-medium text-stone-700 dark:text-slate-300 mb-2">
            Semesters
          </label>

          <input
            type="number"
            name="semesters"
            value={formData.semesters}
            onChange={handleChange}
            min="1"
            max="20"
            placeholder="6"
            required
            className="w-full border border-stone-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />

        </div>

      </div>

      {/* =========================
          Submit Button
      ========================= */}
      <div className="flex justify-end pt-4">

        <Button
          type="submit"
          disabled={loading}
        >
          {loading
            ? initialData
              ? "Updating..."
              : "Creating..."
            : initialData
            ? "Update Program"
            : "Create Program"}
        </Button>

      </div>

    </form>
  );
}

export default ProgramForm;