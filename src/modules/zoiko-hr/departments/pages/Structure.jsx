import { useState, useMemo } from "react";
import { ChevronRight, ChevronDown, Building2, Users, CircleDollarSign, ChevronsDownUp } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { useDepartments } from "../hooks/useDepartment";
import { formatCurrency } from "../utils/helpers";

function TreeNode({ node, allDepts, depth = 0 }) {
  const [expanded, setExpanded] = useState(depth < 1);
  const children = allDepts.filter((d) => d.parent_id === node.id);

  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer hover:bg-rose-50 group ${depth === 0 ? "bg-rose-50/50 border border-rose-100" : ""}`}
        style={{ marginLeft: depth * 24 }}
        onClick={() => children.length > 0 && setExpanded(!expanded)}
      >
        {children.length > 0 ? (
          <span className="text-gray-400 w-4 h-4 flex items-center justify-center">
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </span>
        ) : (
          <span className="w-4 h-4 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          </span>
        )}
        <div className="flex-1 flex items-center gap-3">
          <div className={`p-1.5 rounded-lg ${depth === 0 ? "bg-rose-100" : "bg-gray-100"}`}>
            <Building2 className={`w-4 h-4 ${depth === 0 ? "text-rose-600" : "text-gray-500"}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className={`font-medium ${depth === 0 ? "text-gray-900" : "text-gray-800"}`}>{node.name}</span>
              <span className="text-xs font-mono text-gray-400">{node.code}</span>
              <StatusBadge status={node.status} />
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500 mt-0.5">
              <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {node.employee_count} employees</span>
              {node.head && <span>Head: {node.head}</span>}
              {node.budget && <span className="flex items-center gap-1">{formatCurrency(node.budget)}</span>}
            </div>
          </div>
        </div>
      </div>
      {expanded && children.map((child) => (
        <TreeNode key={child.id} node={child} allDepts={allDepts} depth={depth + 1} />
      ))}
    </div>
  );
}

function DepartmentDetail({ dept }) {
  if (!dept) return null;
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Details</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-50 rounded-lg"><Building2 className="w-5 h-5 text-rose-600" /></div>
          <div>
            <p className="text-lg font-bold text-gray-900">{dept.name}</p>
            <p className="text-sm text-gray-500 font-mono">{dept.code}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
            <p className="text-sm text-gray-700">{dept.description || "-"}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
            <StatusBadge status={dept.status} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Department Head</label>
            <p className="text-sm text-gray-900">{dept.head || <span className="text-gray-400">-</span>}</p>
            {dept.head_title && <p className="text-xs text-gray-400">{dept.head_title}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Employees</label>
            <p className="text-sm text-gray-900 font-semibold">{dept.employee_count}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Budget</label>
            <p className="text-sm text-gray-900 font-semibold">{formatCurrency(dept.budget)}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Parent Department</label>
            <p className="text-sm text-gray-900">{dept.parent_id ? `#${dept.parent_id}` : <span className="text-gray-400">Root</span>}</p>
          </div>
        </div>
        <div className="pt-3 border-t border-gray-100 text-xs text-gray-400">
          <div>Created: {dept.created_at ? new Date(dept.created_at).toLocaleString() : "-"}</div>
          <div>Updated: {dept.updated_at ? new Date(dept.updated_at).toLocaleString() : "-"}</div>
        </div>
      </div>
    </div>
  );
}

export default function DepartmentStructure() {
  const { data: departments, loading } = useDepartments();
  const [selectedDept, setSelectedDept] = useState(null);

  const rootDepts = useMemo(() => departments.filter((d) => !d.parent_id), [departments]);

  const handleNodeClick = (dept) => {
    setSelectedDept(dept);
  };

  if (loading) return <div className="p-6 text-gray-400">Loading structure...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Department Structure</h1>
        <p className="text-sm text-gray-500 mt-1">Organizational hierarchy and department relationships</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Org Chart</h2>
            <span className="text-xs text-gray-400">{departments.length} departments</span>
          </div>
          <div className="space-y-1">
            {rootDepts.map((dept) => (
              <div key={dept.id} onClick={() => handleNodeClick(dept)}>
                <TreeNode node={dept} allDepts={departments} depth={0} />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          {selectedDept ? (
            <DepartmentDetail dept={selectedDept} />
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <ChevronsDownUp className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Click on any department node to view its details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
