import { useDesignationLevels } from "../hooks/useDesignation";
import { levelColor, formatCurrency } from "../utils/helpers";
import { Building2 } from "lucide-react";

export default function LevelMatrix() {
  const { data, loading } = useDesignationLevels();

  if (loading) return <div className="p-6 text-gray-400">Loading level matrix...</div>;

  const maxSalary = Math.max(...data.map((l) => l.max_salary));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Level Matrix</h1>
        <p className="text-sm text-gray-500 mt-1">Comparison of all designation levels, salary bands, and requirements</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Level</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Salary Band</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Salary Range</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Typical Roles</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Requirements</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Departments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((level) => {
                const midPct = (level.mid_salary / maxSalary) * 100;
                return (
                  <tr key={level.level} className="hover:bg-orange-50/30 transition-colors">
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${levelColor(level.level)}`}>
                        {level.level}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-medium text-gray-900">{level.name}</span>
                    </td>
                    <td className="px-4 py-4 w-48">
                      <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`absolute h-full rounded-full opacity-80 ${levelColor(level.level).split(" ")[0]}`}
                          style={{ width: `${midPct}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-700">{formatCurrency(level.min_salary)} - {formatCurrency(level.max_salary)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-mono text-xs text-gray-600">{formatCurrency(level.min_salary)} - {formatCurrency(level.max_salary)}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {level.typical_roles.map((role) => (
                          <span key={role} className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{role}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-600 max-w-xs">{level.requirements}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {level.departments.map((dept) => (
                          <span key={dept} className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-orange-50 text-orange-700 rounded text-xs">
                            <Building2 className="w-3 h-3" />{dept}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[
          { title: "Entry Levels (L1-L3)", levels: data.slice(0, 3), color: "from-blue-400 to-indigo-500" },
          { title: "Mid Levels (L4-L6)", levels: data.slice(3, 6), color: "from-orange-400 to-orange-500" },
          { title: "Leadership (L7-L10)", levels: data.slice(6, 10), color: "from-purple-400 to-purple-600" },
        ].map((group) => (
          <div key={group.title} className={`bg-gradient-to-br ${group.color} rounded-xl p-5 text-white shadow-md`}>
            <h3 className="font-semibold text-white/90 mb-3">{group.title}</h3>
            <div className="space-y-2">
              {group.levels.map((l) => (
                <div key={l.level} className="flex items-center justify-between text-sm">
                  <span className="font-mono font-bold">{l.level}</span>
                  <span className="text-white/80">{l.name}</span>
                  <span className="text-white/70 text-xs">{formatCurrency(l.min_salary)} - {formatCurrency(l.max_salary)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
