'use client';
import '../../app/globals.css';

// pages/admin/logs.jsx
import React, { useEffect, useState } from "react";

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/logs")
      .then((res) => res.json())
      .then((data) => {
        setLogs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch logs", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📄 Import Logs</h1>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-200 text-gray-700 text-sm">
              <tr>
                <th className="py-3 px-4 border-b text-left">File Name</th>
                <th className="py-3 px-4 border-b text-left">Timestamp</th>
                <th className="py-3 px-4 border-b text-left">Total</th>
                <th className="py-3 px-4 border-b text-left">New</th>
                <th className="py-3 px-4 border-b text-left">Updated</th>
                <th className="py-3 px-4 border-b text-left">Failed</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-4 border-b break-all">{log.fileName}</td>
                  <td className="py-3 px-4 border-b">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 border-b">{log.totalFetched}</td>
                  <td className="py-3 px-4 border-b text-green-700 font-semibold">
                    {log.newJobs}
                  </td>
                  <td className="py-3 px-4 border-b text-blue-700 font-semibold">
                    {log.updatedJobs}
                  </td>
                  <td className="py-3 px-4 border-b text-red-600 font-semibold">
                    {log.failedJobs?.length}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LogsPage;
