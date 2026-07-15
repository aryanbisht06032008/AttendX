function Card({ children }) {
  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6">
      {children}
    </div>
  );
}

export default Card;