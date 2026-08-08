function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/70 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
