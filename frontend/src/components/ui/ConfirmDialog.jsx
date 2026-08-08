function ConfirmDialog({
  open,
  title,
  message,
  onCancel,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md animate-scale-in rounded-3xl border border-slate-100 bg-white p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-red-600 text-2xl text-white shadow-[0_8px_20px_-8px_rgb(225_29_72/0.6)]">
            <svg
              className="h-7 w-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14" />
            </svg>
          </div>

          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h2>

          <p className="mt-3 text-slate-500 dark:text-slate-400">{message}</p>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="rounded-xl bg-gradient-to-r from-rose-500 to-red-600 px-6 py-3 font-semibold text-white shadow-[0_8px_20px_-8px_rgb(225_29_72/0.6)] transition hover:-translate-y-0.5"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
