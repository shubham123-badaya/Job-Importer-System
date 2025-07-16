# Job Importer System

This is a scalable job importer system that:

* Fetches job feeds from multiple external XML APIs
* Converts XML to JSON
* Queues them using Redis & BullMQ
* Processes jobs via worker
* Inserts or updates jobs into MongoDB
* Tracks every import run (logs with new, updated, failed)

---

## Tech Stack

| Layer     | Technology             |
| --------- | ---------------------- |
| Frontend  | Next.js + Tailwind CSS |
| Backend   | Node.js + Express.js   |
| Queue     | BullMQ (Redis)         |
| Database  | MongoDB (Mongoose)     |
| Scheduler | node-cron              |

---

## Project Structure

```
/client        → Next.js Admin UI (jobs + logs)
/server        → Express.js + BullMQ workers
/docs
  └── architecture.md → System design explanation
README.md      → Setup & usage guide
```

---

## Setup Instructions

### Prerequisites

* Node.js (v18+ recommended)
* Redis Server (6.2+ recommended)
* MongoDB (local or MongoDB Atlas)

---

### Backend Setup (Server)

```bash
cd server
npm install
node workers/jobWorker.js    # Start background worker
node server.js               # Start Express + Cron
```

---

### Frontend Setup (Client)

```bash
cd client
npm install
npm run dev                  # Runs Next.js at http://localhost:3000
```

---

## Job Flow

1. XML job feeds are fetched every hour (via cron).
2. XML is parsed to JSON.
3. Jobs are queued to Redis using BullMQ.
4. Background worker:

   * Checks for duplicates
   * Inserts or updates job data in MongoDB
5. Import logs saved in `import_logs` collection.

---

## API Endpoints

| Route           | Description         |
| --------------- | ------------------- |
| `GET /api/jobs` | Get all job records |
| `GET /api/logs` | Get all import logs |

---

## ✅ Features

* Fetch jobs from XML API
* Convert XML to JSON
* Redis queue with BullMQ
* Cron job scheduler (hourly)
* Job insertion/update logic
* Import logs with success/failure stats
* Admin UI for logs & job listing (Next.js)
* Modular file structure

---

## Notes

* Some APIs (like Jobicy) return delayed data (\~6 hrs)
* Duplicate detection is based on job `url`
* You can adjust cron time or concurrency easily in code
* Logs saved in `import_logs` collection

---

