import { useEffect, useState } from "react";
import Button from "../ui/Button";

import { getDepartments } from "../../services/departmentService";

function DepartmentForm({
  onSubmit,
  initialData = null,
  isEditing = false,
}) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  // Load existing department data when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        code: initialData.code || "",
        description: initialData.description || "",
      });
    } else {
      setFormData({
        name: "",
        code: "",
        description: "",
      });
    }
  }, [initialData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await onSubmit({
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        description: formData.description.trim(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Department Name */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Department Name
        </label>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter department name"
          required
          className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* Department Code */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Department Code
        </label>

        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleChange}
          placeholder="e.g. CSE"
          required
          className="w-full border border-stone-300 rounded-xl px-4 py-3 uppercase focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Description
        </label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter department description"
          rows="4"
          className="w-full border border-stone-300 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={loading}
        >
          {loading
            ? initialData
              ? "Updating..."
              : "Creating..."
            : initialData
              ? "Update Department"
              : "Create Department"}
        </Button>
      </div>
    </form>
  );
}

export default DepartmentForm;