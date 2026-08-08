function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  loading = false,
}) {
  const base =
    "inline-flex select-none items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const sizes = {
    sm: "px-3.5 py-2 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variants = {
    primary:
      "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-glow-sm hover:-translate-y-0.5 hover:shadow-glow active:translate-y-0",

    secondary:
      "border border-slate-200 bg-white text-slate-700 shadow-soft hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-700 dark:hover:text-white",

    outline:
      "border border-amber-200 bg-white text-amber-700 hover:border-amber-300 hover:bg-amber-50 dark:border-amber-500/40 dark:bg-transparent dark:text-amber-300 dark:hover:border-amber-400/60 dark:hover:bg-amber-500/10",

    danger:
      "bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-[0_4px_14px_-6px_rgb(225_29_72/0.5)] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-8px_rgb(225_29_72/0.55)] active:translate-y-0",

    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {loading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
}

export default Button;
