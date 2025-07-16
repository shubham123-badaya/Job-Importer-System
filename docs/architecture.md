### Architecture Overview

This system is designed as a **modular and scalable job importer** that efficiently fetches jobs from external APIs, queues them for background processing, and keeps track of each import session with detailed logs.

---

## Components & Responsibilities

| Component    | Responsibility                                                                  |
| ------------ | ------------------------------------------------------------------------------- |
| **Frontend** | Built with Next.js and Tailwind CSS. Displays imported job listings and logs.   |
| **Backend**  | Express.js handles REST APIs, job fetching, cron scheduling, and MongoDB logic. |
| **Queue**    | BullMQ with Redis handles background task queuing and concurrency.              |
| **Worker**   | Dedicated Node.js script processes jobs in the queue: insert/update in MongoDB. |
| **Database** | MongoDB stores job data and import logs in separate collections.                |

---

## 2️⃣ Import & Processing Flow

1. **Cron Job Trigger**
   A cron job runs every hour and triggers the job import process.

2. **Fetch Jobs from XML API**
   Multiple external XML-based job feeds are fetched. The XML response is converted to JSON.

3. **Queue Jobs**
   Each job is added to a Redis queue (BullMQ), allowing async and scalable background processing.

4. **Worker Processes Jobs**
   A worker script listens to the queue. For each job:

   * Checks for duplicates using the job URL.
   * If exists, it updates the existing job.
   * If not, it inserts as a new job.
   * Errors are caught and logged as failed jobs.

5. **Log Import Run**
   For every feed and fetch run, a log entry is created with stats:

   * Total jobs fetched
   * New jobs inserted
   * Updated jobs
   * Failed jobs (with reason)

6. **Frontend Visualization**
   Admin users can view:

   * A table of all jobs.
   * A table of all import logs with counts per feed.

---

## 3️⃣ MongoDB Collections

### `jobs`

Stores individual job records with fields like:

* `title`
* `url`
* `company`
* `location`
* `publishedDate`
* `source`
* `category`, `type`, etc.

### `import_logs`

Stores metadata of each import run with fields:

* `fileName` (API URL)
* `timestamp`
* `totalFetched`
* `newJobs`
* `updatedJobs`
* `failedJobs` (with error details)

---

## 4️⃣ Design Highlights

* **Modular Codebase**: Cleanly separated services, models, routes, and worker logic.
* **Scalable Queue Handling**: BullMQ with Redis ensures background processing and retry capabilities.
* **Accurate Tracking**: Each import run is traceable via logs.
* **Extendable**: Easy to add new job feeds or scheduling frequency via `.env`.

---

## 5️⃣ Future Enhancements

* Add real-time updates using **Socket.IO** or **Server-Sent Events**.
* Implement retry logic and exponential backoff on failed jobs.
* Allow `.env` configuration of concurrency, batch size, and fetch limits.
* Deploy backend to **Render**, frontend to **Vercel**, and use **MongoDB Atlas + Redis Cloud**.
* Add analytics and visual dashboards for job insights (using Chart.js or Recharts).

---

This document summarizes the architecture and decisions made to ensure scalability, modularity, and robustness of the job importer system.
