function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition">

      <p className="text-stone-500">
        {title}
      </p>

      <h2 className="text-4xl font-bold text-amber-800 mt-4">
        {value}
      </h2>

    </div>
  );
}

export default StatCard;