function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
}) {
  const styles = {
    primary:
      "bg-amber-700 hover:bg-amber-800 text-white",

    secondary:
      "bg-stone-200 hover:bg-stone-300 text-stone-800",

    danger:
      "bg-red-600 hover:bg-red-700 text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-5 py-2 rounded-xl transition font-medium ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;