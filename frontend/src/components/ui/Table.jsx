function Table({ columns, children }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-stone-100 sticky top-0">

            <tr>

              {columns.map((column) => (
                <th
                  key={column}
                  className="px-6 py-5 text-left text-xs uppercase tracking-wider text-stone-600 font-bold"
                >
                  {column}
                </th>
              ))}

            </tr>

          </thead>

          <tbody className="divide-y divide-stone-100">

            {children}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Table;