function Modal({
  open,
  title,
  subtitle,
  onClose,
  children,
  maxWidth = "max-w-2xl",
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 animate-fade-in bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`relative z-10 flex max-h-[90vh] w-full ${maxWidth} animate-scale-in flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-7 py-6 dark:border-slate-800 dark:from-slate-800/60 dark:to-slate-900">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-7">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
