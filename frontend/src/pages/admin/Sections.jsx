import { useEffect, useState } from "react";

import AdminLayout from "../../components/layout/AdminLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";
import StatCard from "../../components/ui/StatCard";
import Modal from "../../components/ui/Modal";

import {
  FaPlus,
  FaSearch,
  FaLayerGroup,
} from "react-icons/fa";

import {
  getSections,
  createSection,
} from "../../services/sectionService";

import { getPrograms } from "../../services/programService";

function Sections() {
  const [sections, setSections] = useState([]);
  const [programs, setPrograms] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] =
    useState(false);

  const [formData, setFormData] = useState({
    programId: "",
    name: "",
    batchYear: "",
    maxStrength: "",
  });

  // Fetch sections
  const fetchSections = async () => {
    try {
      setLoading(true);

      const data = await getSections();

      setSections(data);
    } catch (error) {
      console.error(
        "Failed to fetch sections:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch programs
  const fetchPrograms = async () => {
    try {
      const data = await getPrograms();

      setPrograms(data);
    } catch (error) {
      console.error(
        "Failed to fetch programs:",
        error
      );
    }
  };

  useEffect(() => {
    fetchSections();
    fetchPrograms();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Create section
  const handleCreateSection = async (e) => {
    e.preventDefault();

    try {
      await createSection({
        programId: formData.programId,
        name: formData.name,
        batchYear: Number(
          formData.batchYear
        ),
        maxStrength: Number(
          formData.maxStrength
        ),
      });

      setOpenModal(false);

      setFormData({
        programId: "",
        name: "",
        batchYear: "",
        maxStrength: "",
      });

      await fetchSections();

      alert(
        "Section created successfully!"
      );
    } catch (error) {
      console.error(
        "Failed to create section:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to create section."
      );
    }
  };

  // Search
  const filteredSections =
    sections.filter((section) => {
      const searchText =
        search.toLowerCase();

      return (
        section.name
          ?.toLowerCase()
          .includes(searchText) ||
        section.program?.name
          ?.toLowerCase()
          .includes(searchText) ||
        String(section.batchYear)
          .includes(searchText)
      );
    });

  const totalSections =
    sections.length;

  const activeSections =
    sections.filter(
      (section) => section.isActive
    ).length;

  const inactiveSections =
    totalSections -
    activeSections;

  return (
    <AdminLayout>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-4xl font-bold text-stone-800 dark:text-slate-100">
            Sections
          </h1>

          <p className="text-stone-500 dark:text-slate-400 mt-2">
            Manage program sections and batches
          </p>
        </div>

        <Button
          onClick={() =>
            setOpenModal(true)
          }
        >
          <div className="flex items-center gap-2">
            <FaPlus />
            Add Section
          </div>
        </Button>

      </div>


      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <StatCard
          title="Total Sections"
          value={totalSections}
          color="amber"
        />

        <StatCard
          title="Active"
          value={activeSections}
          color="green"
        />

        <StatCard
          title="Inactive"
          value={inactiveSections}
          color="red"
        />

      </div>


      {/* Table */}
      <Card>

        {/* Search */}
        <div className="relative mb-6">

          <FaSearch
            className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 dark:text-slate-500"
          />

          <input
            type="text"
            placeholder="Search sections, programs or batch year..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-2xl pl-14 pr-5 py-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />

        </div>


        <Table
          columns={[
            "Section",
            "Program",
            "Batch Year",
            "Max Strength",
            "Status",
          ]}
        >

          {loading ? (

            <tr>
              <td
                colSpan="5"
                className="text-center py-10"
              >
                Loading sections...
              </td>
            </tr>

          ) : filteredSections.length === 0 ? (

            <tr>

              <td
                colSpan="5"
                className="py-16"
              >

                <div className="flex flex-col items-center">

                  <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center text-4xl mb-5">

                    <FaLayerGroup className="text-amber-700" />

                  </div>

                  <h3 className="text-2xl font-semibold text-stone-800 dark:text-slate-100">
                    No Sections Yet
                  </h3>

                  <p className="text-stone-500 dark:text-slate-400 mt-2">
                    Create your first section.
                  </p>

                </div>

              </td>

            </tr>

          ) : (

            filteredSections.map(
              (section) => (

                <tr
                  key={section.id}
                  className="hover:bg-stone-50 dark:hover:bg-slate-800/60 dark:bg-slate-800 transition"
                >

                  <td className="px-6 py-5 font-semibold text-stone-800 dark:text-slate-100">
                    {section.name}
                  </td>

                  <td className="px-6 py-5 text-stone-600 dark:text-slate-300">
                    {section.program?.name ||
                      "—"}
                  </td>

                  <td className="px-6 py-5 text-stone-600 dark:text-slate-300">
                    {section.batchYear}
                  </td>

                  <td className="px-6 py-5 text-stone-600 dark:text-slate-300">
                    {section.maxStrength}
                  </td>

                  <td className="px-6 py-5">

                    {section.isActive ? (

                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-emerald-500/15 dark:text-emerald-300 text-sm font-medium">
                        Active
                      </span>

                    ) : (

                      <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 dark:bg-rose-500/15 dark:text-rose-300 text-sm font-medium">
                        Inactive
                      </span>

                    )}

                  </td>

                </tr>

              )
            )

          )}

        </Table>

      </Card>


      {/* Add Section Modal */}
      <Modal
        open={openModal}
        title="Add Section"
        onClose={() =>
          setOpenModal(false)
        }
      >

        <form
          onSubmit={
            handleCreateSection
          }
          className="space-y-5"
        >

          {/* Program */}
          <div>

            <label className="block text-sm font-medium text-stone-700 dark:text-slate-200 mb-2">
              Program
            </label>

            <select
              name="programId"
              value={
                formData.programId
              }
              onChange={
                handleChange
              }
              required
              className="w-full border border-stone-300 dark:border-slate-700 rounded-xl px-4 py-3 bg-white focus:outline-none dark:bg-slate-800 focus:ring-2 focus:ring-amber-500"
            >

              <option value="">
                Select Program
              </option>

              {programs.map(
                (program) => (

                  <option
                    key={program.id}
                    value={program.id}
                  >
                    {program.name}
                  </option>

                )
              )}

            </select>

          </div>


          {/* Section Name */}
          <div>

            <label className="block text-sm font-medium text-stone-700 dark:text-slate-200 mb-2">
              Section Name
            </label>

            <input
              type="text"
              name="name"
              value={
                formData.name
              }
              onChange={
                handleChange
              }
              placeholder="e.g. A"
              required
              className="w-full border border-stone-300 dark:border-slate-700 rounded-xl px-4 py-3"
            />

          </div>


          {/* Batch Year */}
          <div>

            <label className="block text-sm font-medium text-stone-700 dark:text-slate-200 mb-2">
              Batch Year
            </label>

            <input
              type="number"
              name="batchYear"
              value={
                formData.batchYear
              }
              onChange={
                handleChange
              }
              placeholder="e.g. 2025"
              min="2000"
              required
              className="w-full border border-stone-300 dark:border-slate-700 rounded-xl px-4 py-3"
            />

          </div>


          {/* Maximum Strength */}
          <div>

            <label className="block text-sm font-medium text-stone-700 dark:text-slate-200 mb-2">
              Maximum Strength
            </label>

            <input
              type="number"
              name="maxStrength"
              value={
                formData.maxStrength
              }
              onChange={
                handleChange
              }
              placeholder="e.g. 60"
              min="1"
              required
              className="w-full border border-stone-300 dark:border-slate-700 rounded-xl px-4 py-3"
            />

          </div>


          {/* Submit */}
          <div className="flex justify-end pt-4">

            <Button type="submit">
              Create Section
            </Button>

          </div>

        </form>

      </Modal>

    </AdminLayout>
  );
}

export default Sections;