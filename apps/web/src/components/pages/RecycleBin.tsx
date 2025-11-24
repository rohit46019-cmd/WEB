import React from "react";

const RecycleBin: React.FC = () => {
  // Example static data — replace with API calls to your backend
  const deletedFiles = [
    { id: 1, name: "old-report.pdf", deletedAt: "2025-11-20" },
    { id: 2, name: "draft-design.png", deletedAt: "2025-11-21" },
    { id: 3, name: "backup.zip", deletedAt: "2025-11-22" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Recycle Bin</h1>
      <p className="text-gray-600 mb-6">
        These are files you deleted recently. You can restore or permanently remove them.
      </p>

      <ul className="space-y-3">
        {deletedFiles.map((file) => (
          <li
            key={file.id}
            className="flex justify-between items-center bg-white shadow rounded px-4 py-2"
          >
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-gray-500">Deleted on {file.deletedAt}</p>
            </div>
            <div className="space-x-2">
              <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                Restore
              </button>
              <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                Delete Permanently
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecycleBin;
