import { useEffect, useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";

function DepartmentForm({ onSubmit, initialData }) {
  const [form, setForm] = useState({
    name: "",
    code: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        code: initialData.code,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <Input
        label="Department Name"
        name="name"
        value={form.name}
        onChange={handleChange}
      />

      <Input
        label="Department Code"
        name="code"
        value={form.code}
        onChange={handleChange}
      />

      <div className="flex justify-end">
        <Button type="submit">
          {initialData ? "Update Department" : "Create Department"}
        </Button>
      </div>
    </form>
  );
}

export default DepartmentForm;