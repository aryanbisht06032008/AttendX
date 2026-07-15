function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-stone-800">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-stone-500 hover:text-black"
          >
            ×
          </button>
        </div>

        {children}

      </div>
    </div>
  );
}

export default Modal;