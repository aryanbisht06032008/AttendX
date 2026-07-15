function Input({
  label,
  ...props
}) {
  return (
    <div>

      <label className="block mb-2 text-sm font-medium text-stone-700">
        {label}
      </label>

      <input
        {...props}
        className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:ring-2 focus:ring-amber-600"
      />

    </div>
  );
}

export default Input;