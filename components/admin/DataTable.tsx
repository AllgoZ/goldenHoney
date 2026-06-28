interface Column<T> {
  key:     string
  label:   string
  width?:  string
  render?: (row: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns:     Column<T>[]
  data:        T[]
  loading?:    boolean
  keyField?:   keyof T
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  keyField = 'id' as keyof T,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="bg-white rounded-card border border-black/6 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 border-b border-black/4 px-5 flex items-center gap-4">
            {columns.map((c) => (
              <div key={c.key} className="h-4 bg-onyx/6 rounded animate-pulse flex-1" style={{ maxWidth: c.width ?? 'auto' }} />
            ))}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-card border border-black/6 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/6 bg-onyx/2">
              {columns.map((c) => (
                <th
                  key={c.key}
                  className="text-left text-[11px] font-semibold text-onyx/40 uppercase tracking-wider px-5 py-3 whitespace-nowrap"
                  style={{ width: c.width }}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={String(row[keyField] ?? i)}
                className="border-b border-black/4 last:border-0 hover:bg-onyx/1.5 transition-colors"
              >
                {columns.map((c) => (
                  <td key={c.key} className="px-5 py-3.5 text-onyx/80 align-middle">
                    {c.render ? c.render(row) : String(row[c.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
