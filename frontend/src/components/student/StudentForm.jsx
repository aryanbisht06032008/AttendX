import { useEffect, useState } from "react";
import Button from "../ui/Button";

import { getPrograms } from "../../services/programService";
import { getSections } from "../../services/sectionService";

const emptyForm = {
    name: "",
    email: "",
    password: "",
    programId: "",
    sectionId: "",
    enrollmentNumber: "",
    rollNumber: "",
    admissionYear: "",
    guardianName: "",
    guardianPhone: "",
    address: "",
    dateOfBirth: "",
};

function StudentForm({
    onSubmit,
    initialData = null,
}) {
    const [programs, setPrograms] = useState([]);
    const [loadingPrograms, setLoadingPrograms] =
        useState(true);

    const [sections, setSections] = useState([]);
    const [loadingSections, setLoadingSections] =
        useState(false);

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] =
        useState(emptyForm);

    // Fill form when editing
    useEffect(() => {
        if (!initialData) {
            setFormData(emptyForm);
            return;
        }

        setFormData({
            name: initialData.user?.name || "",
            email: initialData.user?.email || "",
            password: "",
            programId: initialData.programId || "",
            sectionId: initialData.sectionId || "",
            enrollmentNumber:
                initialData.enrollmentNumber || "",
            rollNumber:
                initialData.rollNumber || "",
            admissionYear:
                initialData.admissionYear || "",
            guardianName:
                initialData.guardianName || "",
            guardianPhone:
                initialData.guardianPhone || "",
            address:
                initialData.address || "",
            dateOfBirth: initialData.dateOfBirth
                ? new Date(initialData.dateOfBirth)
                    .toISOString()
                    .split("T")[0]
                : "",
        });
    }, [initialData]);

    // Load programs
    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                setLoadingPrograms(true);

                const data = await getPrograms();

                setPrograms(data);
            } catch (error) {
                console.error(
                    "Failed to fetch programs:",
                    error
                );

                setPrograms([]);
            } finally {
                setLoadingPrograms(false);
            }
        };

        fetchPrograms();
    }, []);

    // Load sections when program changes
    useEffect(() => {
        if (!formData.programId) {
            setSections([]);
            return;
        }

        const fetchSections = async () => {
            try {
                setLoadingSections(true);

                const data = await getSections(
                    formData.programId
                );

                setSections(data);
            } catch (error) {
                console.error(
                    "Failed to fetch sections:",
                    error
                );

                setSections([]);
            } finally {
                setLoadingSections(false);
            }
        };

        fetchSections();
    }, [formData.programId]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,

            // Reset section when program changes
            ...(name === "programId"
                ? { sectionId: "" }
                : {}),
        }));
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const dataToSubmit = {
                ...formData,
                rollNumber: Number(
                    formData.rollNumber
                ),
                admissionYear: Number(
                    formData.admissionYear
                ),
            };

            // Don't send empty password while editing
            if (
                initialData &&
                !dataToSubmit.password
            ) {
                delete dataToSubmit.password;
            }

            await onSubmit(dataToSubmit);
        } finally {
            setLoading(false);
        }
    };

    const isEditing = Boolean(initialData);

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            {/* Personal Information */}
            <div>
                <h3 className="text-lg font-semibold text-stone-800 dark:text-slate-100 mb-4">
                    Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-stone-700 dark:text-slate-300 mb-2">
                            Student Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter student name"
                            required
                            className="w-full border border-stone-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-stone-700 dark:text-slate-300 mb-2">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="student@example.com"
                            required
                            className="w-full border border-stone-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-stone-700 dark:text-slate-300 mb-2">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder={
                                isEditing
                                    ? "Leave blank to keep current password"
                                    : "Enter password"
                            }
                            required={!isEditing}
                            minLength="6"
                            className="w-full border border-stone-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label className="block text-sm font-medium text-stone-700 dark:text-slate-300 mb-2">
                            Date of Birth
                        </label>

                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            required
                            className="w-full border border-stone-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </div>

                </div>
            </div>

            {/* Academic Information */}
            <div>
                <h3 className="text-lg font-semibold text-stone-800 dark:text-slate-100 mb-4">
                    Academic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Program */}
                    <div>
                        <label className="block text-sm font-medium text-stone-700 dark:text-slate-300 mb-2">
                            Program
                        </label>

                        <select
                            name="programId"
                            value={formData.programId}
                            onChange={handleChange}
                            required
                            disabled={loadingPrograms}
                            className="w-full border border-stone-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-xl px-4 py-3 bg-white focus:outline-none dark:bg-slate-800 focus:ring-2 focus:ring-amber-500"
                        >
                            <option value="">
                                {loadingPrograms
                                    ? "Loading programs..."
                                    : "Select Program"}
                            </option>

                            {programs.map((program) => (
                                <option
                                    key={program.id}
                                    value={program.id}
                                >
                                    {program.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Section */}
                    <div>
                        <label className="block text-sm font-medium text-stone-700 dark:text-slate-300 mb-2">
                            Section
                        </label>

                        <select
                            name="sectionId"
                            value={formData.sectionId}
                            onChange={handleChange}
                            required
                            disabled={
                                !formData.programId ||
                                loadingSections
                            }
                            className="w-full border border-stone-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-xl px-4 py-3 bg-white focus:outline-none dark:bg-slate-800 focus:ring-2 focus:ring-amber-500"
                        >
                            <option value="">
                                {!formData.programId
                                    ? "Select program first"
                                    : loadingSections
                                        ? "Loading sections..."
                                        : sections.length === 0
                                            ? "No sections available"
                                            : "Select Section"}
                            </option>

                            {sections.map((section) => (
                                <option
                                    key={section.id}
                                    value={section.id}
                                >
                                    {section.name} -{" "}
                                    {section.batchYear}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Enrollment Number */}
                    <div>
                        <label className="block text-sm font-medium text-stone-700 dark:text-slate-300 mb-2">
                            Enrollment Number
                        </label>

                        <input
                            type="text"
                            name="enrollmentNumber"
                            value={
                                formData.enrollmentNumber
                            }
                            onChange={handleChange}
                            placeholder="e.g. ENR2025001"
                            required
                            className="w-full border border-stone-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </div>

                    {/* Roll Number */}
                    <div>
                        <label className="block text-sm font-medium text-stone-700 dark:text-slate-300 mb-2">
                            Roll Number
                        </label>

                        <input
                            type="number"
                            name="rollNumber"
                            value={formData.rollNumber}
                            onChange={handleChange}
                            placeholder="e.g. 1"
                            required
                            min="1"
                            className="w-full border border-stone-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </div>

                    {/* Admission Year */}
                    <div>
                        <label className="block text-sm font-medium text-stone-700 dark:text-slate-300 mb-2">
                            Admission Year
                        </label>

                        <input
                            type="number"
                            name="admissionYear"
                            value={formData.admissionYear}
                            onChange={handleChange}
                            placeholder="e.g. 2025"
                            required
                            className="w-full border border-stone-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </div>

                </div>
            </div>

            {/* Guardian Information */}
            <div>
                <h3 className="text-lg font-semibold text-stone-800 dark:text-slate-100 mb-4">
                    Guardian Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Guardian Name */}
                    <div>
                        <label className="block text-sm font-medium text-stone-700 dark:text-slate-300 mb-2">
                            Guardian Name
                        </label>

                        <input
                            type="text"
                            name="guardianName"
                            value={formData.guardianName}
                            onChange={handleChange}
                            placeholder="Enter guardian name"
                            required
                            className="w-full border border-stone-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </div>

                    {/* Guardian Phone */}
                    <div>
                        <label className="block text-sm font-medium text-stone-700 dark:text-slate-300 mb-2">
                            Guardian Phone
                        </label>

                        <input
                            type="tel"
                            name="guardianPhone"
                            value={
                                formData.guardianPhone
                            }
                            onChange={handleChange}
                            placeholder="Enter guardian phone"
                            required
                            className="w-full border border-stone-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </div>

                </div>
            </div>

            {/* Address */}
            <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-slate-300 mb-2">
                    Address
                </label>

                <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter student's address"
                    required
                    rows="3"
                    className="w-full border border-stone-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-4">
                <Button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? isEditing
                            ? "Updating Student..."
                            : "Creating Student..."
                        : isEditing
                            ? "Update Student"
                            : "Create Student"}
                </Button>
            </div>
        </form>
    );
}

export default StudentForm;