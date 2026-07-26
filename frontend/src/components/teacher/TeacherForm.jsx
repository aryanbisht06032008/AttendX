import { useEffect, useState } from "react";
import Button from "../ui/Button";
import { getDepartments } from "../../services/departmentService";

function TeacherForm({
  onSubmit,
  initialData = null,
}) {
  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);

  const [formData, setFormData] = useState({
    name: initialData?.user?.name || "",
    email: initialData?.user?.email || "",
    password: "",

    employeeId: initialData?.employeeId || "",
    departmentId: initialData?.departmentId || "",
    designation: initialData?.designation || "",
    highestQualification:
      initialData?.highestQualification || "",

    joiningDate: initialData?.joiningDate
      ? initialData.joiningDate.split("T")[0]
      : "",

    primaryPhone: initialData?.primaryPhone || "",
    alternatePhone: initialData?.alternatePhone || "",
  });

  const [loading, setLoading] = useState(false);

  // Fetch departments
  useEffect(() => {
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
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error(
        "Teacher form error:",
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

      {/* Teacher Name */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Teacher Name
        </label>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter teacher name"
          required
          className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Email
        </label>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="teacher@example.com"
          required
          className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* Password - Only Create */}
      {!initialData && (
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Password
          </label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
            minLength="6"
            className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      )}

      {/* Employee ID */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Employee ID
        </label>

        <input
          type="text"
          name="employeeId"
          value={formData.employeeId}
          onChange={handleChange}
          placeholder="e.g. EMP001"
          required
          className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* Department */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Department
        </label>

        <select
          name="departmentId"
          value={formData.departmentId}
          onChange={handleChange}
          required
          disabled={loadingDepartments}
          className="w-full border border-stone-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="">
            {loadingDepartments
              ? "Loading departments..."
              : "Select Department"}
          </option>

          {departments.map((department) => (
            <option
              key={department.id}
              value={department.id}
            >
              {department.name} ({department.code})
            </option>
          ))}
        </select>
      </div>

      {/* Designation */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Designation
        </label>

        <input
          type="text"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          placeholder="e.g. Assistant Professor"
          required
          className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* Highest Qualification */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Highest Qualification
        </label>

        <input
          type="text"
          name="highestQualification"
          value={formData.highestQualification}
          onChange={handleChange}
          placeholder="e.g. M.Tech, PhD"
          required
          className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* Joining Date */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Joining Date
        </label>

        <input
          type="date"
          name="joiningDate"
          value={formData.joiningDate}
          onChange={handleChange}
          required
          className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* Phone Numbers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Primary Phone */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Primary Phone
          </label>

          <input
            type="tel"
            name="primaryPhone"
            value={formData.primaryPhone}
            onChange={handleChange}
            placeholder="Enter primary phone"
            required
            className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Alternate Phone */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Alternate Phone
          </label>

          <input
            type="tel"
            name="alternatePhone"
            value={formData.alternatePhone}
            onChange={handleChange}
            placeholder="Optional"
            className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

      </div>

      {/* Submit */}
      <div className="flex justify-end pt-4">

        <Button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : initialData
            ? "Update Teacher"
            : "Create Teacher"}
        </Button>

      </div>

    </form>
  );
}

export default TeacherForm;