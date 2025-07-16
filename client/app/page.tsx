'use client';

import { useEffect, useState } from 'react';
import './globals.css';

export default function Home() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/jobs')
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error("Error fetching jobs:", err));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📋 Job Listings</h1>

      {jobs.length === 0 ? (
        <p>⏳ Loading jobs...</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job._id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="text-sm text-gray-500">{job.company} — {job.location}</p>
              <a href={job.url} target="_blank" className="text-blue-600 hover:underline">View Job</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
