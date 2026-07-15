import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../services/authService";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const data = await loginUser(form);

            login(data.user, data.token);

            if (data.user.role === "ADMIN") {
                navigate("/admin");
            } else if (data.user.role === "TEACHER") {
                navigate("/teacher");
            } else {
                navigate("/student");
            }

        } catch (err) {
            console.log("Login Error:", err);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Login failed"
            );
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

                <h1 className="text-3xl font-bold text-center text-indigo-600">
                    AttendX
                </h1>

                <p className="text-center text-gray-500 mt-2 mb-8">
                    QR Based Attendance System
                </p>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full rounded-xl border px-4 py-3"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full rounded-xl border px-4 py-3"
                            required
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="w-full rounded-xl bg-indigo-600 py-3 text-white hover:bg-indigo-700"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

            </div>
        </div>
    );
}

export default Login;