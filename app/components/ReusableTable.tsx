import type { ReactNode } from "react";

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface ReusableTableProps<T> {
  title: string;
  description?: string;
  columns: TableColumn<T>[];
  data: T[];
  emptyState?: string;
}

export default function ReusableTable<T extends Record<string, unknown>>({
  title,
  description,
  columns,
  data,
  emptyState = "No records found.",
}: ReusableTableProps<T>) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
      <div className="border-b border-slate-800 px-5 py-4">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {description ? <p className="mt-1 text-sm text-slate-400">{description}</p> : null}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead className="bg-slate-950 text-xs uppercase text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)} className={`px-5 py-3 font-semibold ${column.className ?? ""}`}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={String(row.id ?? rowIndex)} className="transition duration-200 hover:bg-slate-900/80">
                  {columns.map((column) => (
                    <td key={String(column.key)} className={`border-t border-slate-800 px-5 py-4 text-slate-300 ${column.className ?? ""}`}>
                      {column.render ? column.render(row) : String(row[column.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-5 py-8 text-center text-slate-400" colSpan={columns.length}>
                  {emptyState}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
