function ConfirmDialog({
  open,
  title,
  message,
  onCancel,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#FAF7F2] rounded-3xl shadow-2xl w-full max-w-md p-8 border border-stone-200">

        <div className="text-center">

          <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center text-3xl mb-4">
            🗑️
          </div>

          <h2 className="text-2xl font-bold text-stone-800">
            {title}
          </h2>

          <p className="text-stone-500 mt-3">
            {message}
          </p>

        </div>

        <div className="flex justify-center gap-4 mt-8">

          <button
            onClick={onCancel}
            className="px-6 py-3 rounded-xl bg-stone-200 hover:bg-stone-300 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white transition"
          >
            Delete
          </button>

        </div>

      </div>
    </div>
  );
}

export default ConfirmDialog;