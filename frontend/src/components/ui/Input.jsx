function Input({ label, required, error, icon, className = "", ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="ml-0.5 text-rose-500">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">
            {icon}
          </span>
        )}

        <input
          {...props}
          required={required}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 ${
            icon ? "pl-11" : ""
          } ${error ? "border-rose-400" : "border-slate-300"}`}
        />
      </div>

      {error && <p className="mt-1.5 text-sm text-rose-600">{error}</p>}
    </div>
  );
}

export default Input;
