import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaQrcode } from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../services/authService";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-4">
      {/* ---- Decorative background ---- */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(70rem_70rem_at_50%_-20%,rgb(122_46_242/0.35),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(50rem_50rem_at_110%_110%,rgb(71_63_232/0.3),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(40rem_40rem_at_-10%_20%,rgb(138_77_255/0.25),transparent_55%)]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        {/* Floating QR motif */}
        <div className="absolute left-[8%] top-[18%] hidden animate-float lg:block">
          <div className="flex h-28 w-28 items-center justify-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <FaQrcode className="h-14 w-14 text-white/70" />
          </div>
        </div>
        <div
          className="absolute bottom-[14%] right-[10%] hidden animate-float lg:block"
          style={{ animationDelay: "-4s" }}
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <FaQrcode className="h-10 w-10 text-white/50" />
          </div>
        </div>
      </div>

      {/* ---- Card ---- */}
      <div className="relative z-10 w-full max-w-md animate-fade-up">
        <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-8 shadow-2xl backdrop-blur-2xl sm:p-10">
          {/* Brand */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 font-display text-3xl font-extrabold text-white shadow-glow">
              A
            </div>

            <h1 className="font-display text-3xl font-extrabold tracking-tight text-white">
              AttendX
            </h1>

            <p className="mt-2 text-sm font-medium text-slate-400">
              QR Based Attendance System
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 animate-fade-in rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-300">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email
              </label>
              <div className="relative">
                <FaEnvelope className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="relative">
                <FaLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 transition hover:text-slate-300"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 py-3.5 font-semibold text-white shadow-glow transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-10px_rgb(138_77_255/0.7)] disabled:pointer-events-none disabled:opacity-60"
            >
              {loading && (
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                  aria-hidden="true"
                />
              )}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 flex items-center justify-center gap-2 text-center">
            <span className="text-xs font-medium text-slate-500">
              Secure • Real-time • QR powered
            </span>
          </div>
        </div>

        <p className="mt-6 text-center text-xs font-medium text-slate-600">
          © {new Date().getFullYear()} AttendX — Attendance Management System
        </p>
      </div>
    </div>
  );
}

export default Login;
