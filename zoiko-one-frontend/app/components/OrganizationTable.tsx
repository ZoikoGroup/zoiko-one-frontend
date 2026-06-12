export default function OrganizationTable() {
  const organizations = [
    {
      name: "ABC Corp",
      plan: "Enterprise",
      employees: 1200,
      status: "Active",
    },
    {
      name: "XYZ Ltd",
      plan: "Premium",
      employees: 450,
      status: "Active",
    },
    {
      name: "Demo Org",
      plan: "Trial",
      employees: 25,
      status: "Trial",
    },
    {
      name: "Tech Solutions",
      plan: "Enterprise",
      employees: 980,
      status: "Active",
    },
    {
      name: "Global Industries",
      plan: "Premium",
      employees: 620,
      status: "Pending",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">
          Organizations
        </h2>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          + Add Organization
        </button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3">Organization</th>
            <th className="text-left p-3">Plan</th>
            <th className="text-left p-3">Employees</th>
            <th className="text-left p-3">Status</th>
            <th className="text-left p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {organizations.map((org, index) => (
            <tr
              key={index}
              className="border-b hover:bg-gray-50"
            >
              <td className="p-3 font-medium">
                {org.name}
              </td>

              <td className="p-3">
                {org.plan}
              </td>

              <td className="p-3">
                {org.employees}
              </td>

              <td className="p-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    org.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : org.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {org.status}
                </span>
              </td>

              <td className="p-3">
                <button className="text-blue-600 hover:underline mr-3">
                  View
                </button>

                <button className="text-green-600 hover:underline mr-3">
                  Edit
                </button>

                <button className="text-red-600 hover:underline">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}