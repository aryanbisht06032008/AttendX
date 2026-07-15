function Table({ columns, children }) {
  return (
    <table className="w-full border-collapse">
      <thead className="bg-stone-100">
        <tr>
          {columns.map((column) => (
            <th
              key={column}
              className="text-left p-4 font-semibold text-stone-700"
            >
              {column}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {children}
      </tbody>
    </table>
  );
}

export default Table;