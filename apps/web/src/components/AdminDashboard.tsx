// apps/web/src/admin/AdminDashboard.tsx
import React from "react";

const AdminDashboard: React.FC = () => {
  // Example static data — replace with API calls to your backend
  const stats = [
    { label: "Total Users", value: 245 },
    { label: "Active Sessions", value: 37 },
    { label: "Files Stored", value: "12,430" },
    { label: "Storage Used", value: "8.2 GB / 10 GB" },
  ];

  const recentLogs = [
    { id: 1, action: "User signup", detail: "john@example.com", time: "2025-11-20 14:32" },
    { id: 2, action: "File deleted", detail: "backup.zip", time: "2025-11-21 09:15" },
    { id: 3, action: "Role updated", detail: "Admin → Moderator", time: "2025-11-22 18:47" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white shadow rounded p-4 text-center"
          >
            <h2 className="text-lg font-semibold">{stat.label}</h2>
            <p className="text-xl text-blue-600 font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent activity logs */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2">Action</th>
              <th className="border-b p-2">Detail</th>
              <th className="border-b p-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {recentLogs.map((log) => (
              <tr key={log.id}>
                <td className="border-b p-2">{log.action}</td>
                <td className="border-b p-2">{log.detail}</td>
                <td className="border-b p-2 text-gray-500">{log.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
